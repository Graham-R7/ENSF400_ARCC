from flask import Blueprint, request, jsonify
from services.resume_parser import parse_resume

resume_bp = Blueprint("resume", __name__)

@resume_bp.route("/upload", methods=["POST"])
def upload_resume():

    file = request.files.get("resume")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    parsed_data = parse_resume(file)

    return jsonify({
        "message": "Resume parsed successfully",
        "data": parsed_data
    })