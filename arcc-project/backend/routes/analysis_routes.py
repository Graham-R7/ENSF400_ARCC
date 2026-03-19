from flask import Blueprint, jsonify, request
from integrations.llm_client import get_resume_suggestions

analysis_bp = Blueprint("analysis", __name__)


@analysis_bp.route("/health", methods=["GET"])
def analysis_health():
    return jsonify({"status": "ok", "module": "analysis"})


@analysis_bp.route("/suggestions", methods=["POST"])
def generate_suggestions():
    payload = request.get_json(silent=True) or {}
    resume_text = payload.get("resume_text", "")
    job_description = payload.get("job_description", "")
    suggestions = get_resume_suggestions(resume_text, job_description)
    return jsonify(suggestions)
