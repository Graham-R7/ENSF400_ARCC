"""
Gemini via OpenAI-compatible REST (Config.LLM_BASE_URL + /chat/completions).
Hybrid: token overlap baseline + LLM JSON; on any failure, overlap + static suggestions.
"""

from __future__ import annotations

import json
import logging
import re
from typing import Any

import requests

from config import Config
from services.analysis_service import analyze_resume_against_job

logger = logging.getLogger(__name__)

# Keep request size reasonable for the REST call and token limits.
_MAX_CHARS = 12_000
_REQUEST_TIMEOUT = 45

# Used when we skip the model or it fails; keeps the API response shape stable.
_FALLBACK_SUGGESTIONS = [
    "Add measurable outcomes (metrics, scale, timelines) to your strongest bullets.",
    "Mirror important job keywords naturally in your experience section.",
    "Surface projects that directly match the role's technical requirements.",
    "Move the most relevant skills and tools closer to the top of the resume.",
    "Replace vague phrases with action + context + result (STAR-style) wording.",
]


def _fallback_bundle(overlap: dict) -> dict:
    # Build the analysis dict from overlap only + fixed suggestion strings.
    return {
        "match_score": overlap["match_score"],
        "matched_skills": overlap["matched_skills"],
        "missing_skills": overlap["missing_skills"],
        "suggestions": list(_FALLBACK_SUGGESTIONS),
    }


def _extract_json_object(text: str) -> dict[str, Any]:
    # Parse the model reply into a dict; handles optional markdown code fences.
    text = (text or "").strip()
    fence = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if fence:
        text = fence.group(1).strip()
    return json.loads(text)


def _coerce_analysis_payload(raw: dict[str, Any], overlap: dict) -> dict | None:
    # Validate LLM fields and merge with overlap; None means caller should fall back.
    try:
        ms = raw.get("match_score")
        if ms is None:
            llm_score = None
        else:
            llm_score = float(ms)
            llm_score = max(0.0, min(100.0, llm_score))

        miss = raw.get("missing_skills")
        if not isinstance(miss, list):
            return None
        missing_skills = [str(x).strip() for x in miss if str(x).strip()][:50]

        sug = raw.get("suggestions")
        if not isinstance(sug, list):
            return None
        suggestions = [str(x).strip() for x in sug if str(x).strip()][:5]

        if not suggestions:
            return None

        # Average overlap score with model score when the model sends match_score.
        base = float(overlap["match_score"])
        if llm_score is not None:
            match_score = round(0.5 * base + 0.5 * llm_score, 2)
        else:
            match_score = base

        if not missing_skills:
            missing_skills = overlap["missing_skills"][:50]

        # matched_skills always come from local overlap (stable, cheap).
        return {
            "match_score": match_score,
            "matched_skills": overlap["matched_skills"],
            "missing_skills": missing_skills,
            "suggestions": suggestions,
        }
    except (TypeError, ValueError):
        return None


def _chat_completion(messages: list[dict[str, str]]) -> str:
    # POST chat/completions; returns assistant message text only.
    url = f"{Config.LLM_BASE_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {Config.LLM_API_KEY.strip()}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": Config.LLM_MODEL,
        "messages": messages,
        # Low-ish: steadier JSON, less rambling.
        "temperature": 0.35,
    }
    resp = requests.post(
        url,
        headers=headers,
        json=payload,
        timeout=_REQUEST_TIMEOUT,
    )
    resp.raise_for_status()
    data = resp.json()
    return (data["choices"][0]["message"].get("content") or "").strip()


def analyze_resume_job(resume_text: str, job_description: str) -> dict:
    """Hybrid overlap + Gemini JSON, or overlap + static bullets on failure."""
    # Entry point for /analysis/run: overlap first, then optional Gemini pass.
    resume_text = (resume_text or "").strip()
    job_description = (job_description or "").strip()

    overlap = analyze_resume_against_job(resume_text, job_description)

    # No key configured - don't hit the network.
    if not Config.LLM_API_KEY or not Config.LLM_API_KEY.strip():
        return _fallback_bundle(overlap)

    r_short = resume_text[:_MAX_CHARS]
    j_short = job_description[:_MAX_CHARS]

    # Prompt: JSON-only reply; overlap numbers are hints, not hard rules.
    system = (
        "You are an expert resume analyst for ALL academic and professional backgrounds. "
        "Analyze the resume against the job description using this keyword framework:\n"
        "- Cluster A: Required tools and software\n"
        "- Cluster B: Programming languages or technical skills\n"
        "- Cluster C: Frameworks, platforms, methodologies\n"
        "- Cluster D: Domain and analytics terms\n"
        "- Cluster E: Action verbs and impact language\n"
        "- Cluster F: Business outcomes and metrics\n"
        "- Cluster G: Soft skills and process terms\n\n"
        "Classify job keywords as: "
        "(1) Required + present in resume, "
        "(2) Required + missing from resume, "
        "(3) Irrelevant or unverifiable — ignore these entirely.\n\n"
        "Suggestions must be truthful, actionable, and specific to what is ACTUALLY in the resume. "
        "Never suggest fabricating experience or skills. "
        "Prioritize Category 2 keywords in missing_skills.\n\n"
        "Reply with ONE JSON object only, no markdown, no prose. "
        'Schema: {"match_score": number 0-100, "missing_skills": string[], '
        '"suggestions": string[] (max 5 short actionable bullets)}.'
    )
    user = (
        f"Baseline token overlap score (hint only): {overlap['match_score']}. "
        f"Baseline missing tokens (hint): {overlap['missing_skills'][:30]}\n\n"
        f"RESUME:\n{r_short}\n\nJOB DESCRIPTION:\n{j_short}"
    )
    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": user},
    ]

    try:
        # Happy path: model text → JSON → validated merge with overlap.
        content = _chat_completion(messages)
        parsed = _extract_json_object(content)
        merged = _coerce_analysis_payload(parsed, overlap)
        if merged:
            return merged
    except requests.HTTPError as e:
        logger.warning("LLM HTTP error: %s", e.response.status_code if e.response else "?")
    except requests.RequestException:
        logger.warning("LLM request failed (timeout or network)")
    except (json.JSONDecodeError, KeyError, IndexError, TypeError, ValueError):
        logger.warning("LLM response could not be parsed as expected JSON shape")

    # Same path as missing key: overlap metrics + canned suggestion list.
    return _fallback_bundle(overlap)


def pack_analysis_for_db(payload: dict) -> str:
    # Serialize skills + suggestions for one DB column (analysis_results.suggestions).
    return json.dumps(
        {
            "matched_skills": payload.get("matched_skills", []),
            "missing_skills": payload.get("missing_skills", []),
            "suggestions": payload.get("suggestions", []),
        },
        ensure_ascii=False,
    )

    #future Gemini call

def unpack_analysis_from_db(raw: str | None) -> dict:
    # Reverse pack_analysis_for_db; supports older rows that only stored plain lines.
    if not raw or not str(raw).strip():
        return {
            "matched_skills": [],
            "missing_skills": [],
            "suggestions": [],
        }
    text = str(raw).strip()
    if text.startswith("{"):
        try:
            data = json.loads(text)
            return {
                "matched_skills": list(data.get("matched_skills") or []),
                "missing_skills": list(data.get("missing_skills") or []),
                "suggestions": list(data.get("suggestions") or []),
            }
        except json.JSONDecodeError:
            pass
    # Legacy newline-only suggestions
    lines = [s.strip() for s in text.split("\n") if s.strip()]
    return {
        "matched_skills": [],
        "missing_skills": [],
        "suggestions": lines,
    }