from flask import Blueprint, request, jsonify
from database.db import get_conn

analysis_bp = Blueprint("analysis", __name__)


@analysis_bp.route("/health", methods=["GET"])
def analysis_health():
    return jsonify({"status": "ok", "module": "analysis"})


@analysis_bp.route("/run", methods=["POST"])
def run_analysis():
    """
    Option B contract — DB-backed analysis.

    Request JSON:
        resume_id       (int, required)
        job_description (str, required)
        user_id         (int, optional)

    Response JSON (201):
        analysis_id     int
        resume_id       int
        job_id          int
        match_score     float   (0–100)
        matched_skills  list[str]
        missing_skills  list[str]
        suggestions     list[str]

    Phase 0: returns deterministic stub data so frontend can wire up.
    Phase 2 will replace stub with real LLM + analysis_service.
    """
    data = request.get_json(silent=True) or {}
    resume_id = data.get("resume_id")
    job_description = (data.get("job_description") or "").strip()
    user_id = data.get("user_id")

    if not resume_id or not job_description:
        return jsonify({"error": "resume_id and job_description are required"}), 400

    conn = get_conn()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("SELECT id, text_content FROM resumes WHERE id=%s", (resume_id,))
        resume = cur.fetchone()
        if not resume:
            return jsonify({"error": "resume not found"}), 404

        # --- Phase 0 stub values (replaced in Phase 2) ---
        match_score = 0.0
        matched_skills = []
        missing_skills = []
        suggestions = ["Phase 2 will generate real suggestions via Gemini."]

        # Persist job description
        cur.execute(
            "INSERT INTO job_descriptions (user_id, description) VALUES (%s, %s)",
            (int(user_id) if user_id else None, job_description),
        )
        job_id = cur.lastrowid

        # Persist analysis result
        cur.execute(
            "INSERT INTO analysis_results (resume_id, job_id, match_score, suggestions) VALUES (%s, %s, %s, %s)",
            (resume_id, job_id, match_score, "\n".join(suggestions)),
        )
        analysis_id = cur.lastrowid
        conn.commit()

        return jsonify({
            "analysis_id": analysis_id,
            "resume_id": int(resume_id),
            "job_id": job_id,
            "match_score": match_score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "suggestions": suggestions,
        }), 201

    finally:
        cur.close()
        conn.close()


@analysis_bp.route("/<int:analysis_id>", methods=["GET"])
def get_analysis(analysis_id):
    conn = get_conn()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("""
            SELECT ar.id, ar.resume_id, ar.job_id, ar.match_score, ar.suggestions,
                   jd.description
            FROM analysis_results ar
            LEFT JOIN job_descriptions jd ON jd.id = ar.job_id
            WHERE ar.id = %s
        """, (analysis_id,))
        row = cur.fetchone()
        if not row:
            return jsonify({"error": "analysis not found"}), 404

        suggestions = [s for s in (row.get("suggestions") or "").split("\n") if s.strip()]

        return jsonify({
            "analysis_id": row["id"],
            "resume_id": row["resume_id"],
            "job_id": row["job_id"],
            "match_score": row["match_score"],
            "job_description": row.get("description") or "",
            "suggestions": suggestions,
        })
    finally:
        cur.close()
        conn.close()
