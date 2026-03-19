import os
from pypdf import PdfReader
from docx import Document

def _extract_pdf(path):
    reader = PdfReader(path)
    return "\n".join((p.extract_text() or "") for p in reader.pages).strip()

def _extract_docx(path):
    doc = Document(path)
    return "\n".join(p.text for p in doc.paragraphs).strip()

def parse_resume_file(path):
    ext = os.path.splitext(path)[1].lower()
    if ext == ".pdf":
        raw_text = _extract_pdf(path)
    elif ext == ".docx":
        raw_text = _extract_docx(path)
    elif ext == ".txt":
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            raw_text = f.read()
    else:
        raise ValueError("Unsupported file type. Use PDF, DOCX, or TXT.")

    return {
        "raw_text": raw_text,
        "skills": [],
        "experience": [],
        "education": [],
    }