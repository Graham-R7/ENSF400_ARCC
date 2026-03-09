def parse_resume(file):

    #placeholder

    text_content = file.read().decode("utf-8", errors="ignore")

    parsed = {
        "skills": [],
        "experience": [],
        "education": [],
        "raw_text": text_content
    }

    return parsed