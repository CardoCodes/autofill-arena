class PromptService:
    @staticmethod
    def create_resume_prompt(resume_text: str) -> str:
        """Create a structured prompt for Claude to extract resume information."""
        return f"""Please analyze the following resume text and extract key information into a structured format.
If any information is not found, leave it blank or empty list as appropriate.
Return the information in valid JSON format with the following structure:

{{
    "first_name": "",
    "last_name": "",
    "phone_number": "",
    "email": "",
    "links": [],
    "address": "",
    "education": [
        {{
            "university": "",
            "degree": "",
            "major": "",
            "minor": "",
            "gpa": null,
            "start_date": "",
            "end_date": "",
            "coursework": []
        }}
    ],
    "skills": [],
    "awards": [],
    "experience": [
        {{
            "company": "",
            "title": "",
            "start_date": "",
            "end_date": "",
            "description": []
        }}
    ],
    "projects": [
        {{
            "name": "",
            "description": "",
            "technologies": [],
            "start_date": "",
            "end_date": ""
        }}
    ]
}}

Resume text:
{resume_text}

Extract the information and return only the JSON structure.
"""