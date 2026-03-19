from flask import Blueprint, jsonify

interview_bp = Blueprint("interview", __name__)


@interview_bp.route("/health", methods=["GET"])
def interview_health():
    return jsonify({"status": "ok", "module": "interview"})
