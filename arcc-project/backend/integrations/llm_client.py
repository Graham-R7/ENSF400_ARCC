import requests

def get_resume_suggestions(resume_text, job_description):

    #placeholder LLM call

    prompt = f"""
    Compare this resume with the job description and suggest improvements.

    Resume:
    {resume_text}

    Job Description:
    {job_description}
    """

    #future Gemini call

    return {
        "suggestions": [
            "Add more detail about leadership experience",
            "Highlight Python experience",
            "Quantify achievements where possible"
        ]
    }