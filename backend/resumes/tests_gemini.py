import json
from unittest.mock import patch, MagicMock
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
import os
import sys
from .services.gemini_analyzer import analyze_resume, GeminiServiceError
from .models import ResumeAnalysis

User = get_user_model()

class GeminiAnalyzerTests(TestCase):
    def setUp(self):
        self.genai_patcher = patch('google.genai.Client')
        self.mock_client = self.genai_patcher.start()
    
    def tearDown(self):
        self.genai_patcher.stop()

    @patch.dict(os.environ, {"GEMINI_API_KEY": ""}, clear=True)
    def test_missing_api_key(self):
        with self.assertRaisesMessage(GeminiServiceError, "GEMINI_API_KEY is not configured."):
            analyze_resume("Resume Text", "Job Description")

    @patch.dict(os.environ, {"GEMINI_API_KEY": "fake_key"})
    def test_successful_gemini_response_and_deterministic_score(self):
        mock_generate = self.mock_client.return_value.models.generate_content
        mock_response = MagicMock()
        mock_response.text = json.dumps({
            "skills_score": 80,
            "experience_score": 90,
            "keyword_score": 70,
            "project_score": 85,
            "education_score": 100,
            "strengths": ["Python"],
            "missing_skills": ["Java"],
            "recommendations": ["Learn Java"],
            "summary": "Good"
        })
        mock_generate.return_value = mock_response

        result = analyze_resume("Resume Text", "Job Description")
        
        # 80*0.4 + 90*0.2 + 70*0.15 + 85*0.15 + 100*0.1 = 32 + 18 + 10.5 + 12.75 + 10 = 83.25 -> 83
        self.assertEqual(result["overall_score"], 83)
        self.assertEqual(result["skills_score"], 80)
        self.assertIn("Python", result["strengths"])

    @patch.dict(os.environ, {"GEMINI_API_KEY": "fake_key"})
    def test_malformed_json(self):
        mock_generate = self.mock_client.return_value.models.generate_content
        mock_response = MagicMock()
        mock_response.text = "This is not JSON"
        mock_generate.return_value = mock_response

        with self.assertRaisesMessage(GeminiServiceError, "Malformed response from AI service (invalid JSON)."):
            analyze_resume("Resume Text", "Job Description")

    @patch.dict(os.environ, {"GEMINI_API_KEY": "fake_key"})
    def test_missing_required_fields(self):
        mock_generate = self.mock_client.return_value.models.generate_content
        mock_response = MagicMock()
        mock_response.text = json.dumps({
            "skills_score": 80
            # missing other fields
        })
        mock_generate.return_value = mock_response

        with self.assertRaisesMessage(GeminiServiceError, "Invalid AI response structure: Missing required key: experience_score"):
            analyze_resume("Resume Text", "Job Description")

    @patch.dict(os.environ, {"GEMINI_API_KEY": "fake_key"})
    def test_invalid_score_range(self):
        mock_generate = self.mock_client.return_value.models.generate_content
        mock_response = MagicMock()
        mock_response.text = json.dumps({
            "skills_score": 150,  # Invalid
            "experience_score": 90,
            "keyword_score": 70,
            "project_score": 85,
            "education_score": 100,
            "strengths": [],
            "missing_skills": [],
            "recommendations": [],
            "summary": ""
        })
        mock_generate.return_value = mock_response

        with self.assertRaisesMessage(GeminiServiceError, "Invalid AI response structure: Score skills_score out of range: 150"):
            analyze_resume("Resume Text", "Job Description")

    @patch.dict(os.environ, {"GEMINI_API_KEY": "fake_key"})
    def test_gemini_api_failure(self):
        mock_generate = self.mock_client.return_value.models.generate_content
        mock_generate.side_effect = Exception("API is down")

        with self.assertRaisesMessage(GeminiServiceError, "Failed to communicate with AI service or process response."):
            analyze_resume("Resume Text", "Job Description")

class ResumeAnalysisIntegrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='test@example.com', password='password123')
        self.url = reverse('resume-list-create')

    def create_file(self, name, content=b'file_content', content_type='application/pdf'):
        return SimpleUploadedFile(name, content, content_type=content_type)

    @patch.dict(os.environ, {"GEMINI_API_KEY": "fake_key"})
    @patch('resumes.views.extract_text_from_resume', return_value='Dummy extracted text')
    @patch('resumes.views.analyze_resume')
    def test_analysis_result_and_score_saved_correctly(self, mock_analyze, mock_extract):
        self.client.force_authenticate(user=self.user)
        
        mock_analyze.return_value = {
            "overall_score": 88,
            "skills_score": 85,
            "experience_score": 90,
            "keyword_score": 85,
            "project_score": 85,
            "education_score": 100,
            "strengths": ["A"],
            "missing_skills": ["B"],
            "recommendations": ["C"],
            "summary": "D"
        }

        data = {
            'resume_file': self.create_file('resume.pdf'),
            'job_description': 'Looking for a Python developer.'
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        analysis = ResumeAnalysis.objects.get(id=response.data['id'])
        
        self.assertEqual(analysis.score, 88)
        self.assertEqual(analysis.analysis_result["skills_score"], 85)
        self.assertEqual(analysis.analysis_result["strengths"], ["A"])
        # Original job description and text are not overwritten
        self.assertEqual(analysis.job_description, 'Looking for a Python developer.')
        self.assertEqual(analysis.extracted_text, 'Dummy extracted text')
