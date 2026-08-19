import os
import json
from rest_framework.exceptions import APIException

class GeminiServiceError(APIException):
    status_code = 503
    default_detail = 'AI Analysis Service Unavailable.'
    default_code = 'service_unavailable'

def analyze_resume(extracted_text, job_description):
    try:
        from google import genai
        from google.genai import types
    except ImportError:
        raise GeminiServiceError("google-genai is not installed.")

    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        raise GeminiServiceError("GEMINI_API_KEY is not configured.")

    client = genai.Client(api_key=api_key, http_options={'timeout': 45000}) 

    prompt = f"""
    Analyze the following resume text against the provided job description.
    
    Resume Text:
    {extracted_text}
    
    Job Description:
    {job_description}
    
    Return ONLY a JSON object with this exact structure:
    {{
        "skills_score": <int 0-100>,
        "experience_score": <int 0-100>,
        "keyword_score": <int 0-100>,
        "project_score": <int 0-100>,
        "education_score": <int 0-100>,
        "strengths": ["string", "string"],
        "missing_skills": ["string", "string"],
        "recommendations": ["string", "string"],
        "summary": "string"
    }}
    """

    try:
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        result_text = response.text
        if result_text.startswith("```json"):
            result_text = result_text.replace("```json", "").replace("```", "").strip()
            
        data = json.loads(result_text)
        
        required_keys = [
            "skills_score", "experience_score", "keyword_score", 
            "project_score", "education_score", 
            "strengths", "missing_skills", "recommendations", "summary"
        ]
        
        for key in required_keys:
            if key not in data:
                raise ValueError(f"Missing required key: {key}")
                
        for score_key in ["skills_score", "experience_score", "keyword_score", "project_score", "education_score"]:
            val = int(data[score_key])
            if not (0 <= val <= 100):
                raise ValueError(f"Score {score_key} out of range: {val}")
            data[score_key] = val

        overall_score = (
            data["skills_score"] * 0.40 +
            data["experience_score"] * 0.20 +
            data["keyword_score"] * 0.15 +
            data["project_score"] * 0.15 +
            data["education_score"] * 0.10
        )
        data["overall_score"] = int(round(overall_score))
        
        return data

    except json.JSONDecodeError:
        raise GeminiServiceError("Malformed response from AI service (invalid JSON).")
    except ValueError as e:
        raise GeminiServiceError(f"Invalid AI response structure: {str(e)}")
    except Exception as e:
        raise GeminiServiceError("Failed to communicate with AI service or process response.")
