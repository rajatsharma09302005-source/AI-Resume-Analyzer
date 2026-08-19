from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import patch
from .models import ResumeAnalysis

User = get_user_model()

class ResumeAnalysisUploadTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='test@example.com', password='password123')
        self.other_user = User.objects.create_user(email='other@example.com', password='password123')
        self.url = reverse('resume-list-create')
        
        # Patch extract_text_from_resume to return dummy text for upload tests
        self.extractor_patcher = patch('resumes.views.extract_text_from_resume', return_value='Dummy extracted text')
        self.mock_extractor = self.extractor_patcher.start()
        
        # Patch analyze_resume to return a dummy analysis result for upload tests
        self.analyzer_patcher = patch('resumes.views.analyze_resume', return_value={'overall_score': 85})
        self.mock_analyzer = self.analyzer_patcher.start()

    def tearDown(self):
        self.extractor_patcher.stop()
        self.analyzer_patcher.stop()

    def create_file(self, name, content=b'file_content', content_type='application/pdf'):
        return SimpleUploadedFile(name, content, content_type=content_type)

    def test_authenticated_user_pdf_upload(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'resume_file': self.create_file('resume.pdf'),
            'job_description': 'Looking for a Python developer.'
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ResumeAnalysis.objects.count(), 1)
        self.assertEqual(ResumeAnalysis.objects.first().user, self.user)

    def test_authenticated_user_docx_upload(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'resume_file': self.create_file(
                'resume.docx', 
                content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ),
            'job_description': 'Software Engineer role.'
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_unauthenticated_request_rejected(self):
        data = {
            'resume_file': self.create_file('resume.pdf'),
            'job_description': 'Testing.'
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(ResumeAnalysis.objects.count(), 0)

    def test_missing_resume_rejected(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'job_description': 'Missing file test.'
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('resume_file', response.data)

    def test_txt_file_rejected(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'resume_file': self.create_file('resume.txt', content_type='text/plain'),
            'job_description': 'Testing TXT.'
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('resume_file', response.data)

    def test_jpg_file_rejected(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'resume_file': self.create_file('resume.jpg', content_type='image/jpeg'),
            'job_description': 'Testing JPG.'
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('resume_file', response.data)

    def test_empty_job_description_rejected(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'resume_file': self.create_file('resume.pdf'),
            'job_description': ''
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('job_description', response.data)

    def test_uploaded_analysis_belongs_to_request_user(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'resume_file': self.create_file('resume.pdf'),
            'job_description': 'Testing ownership.'
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        analysis = ResumeAnalysis.objects.get(id=response.data['id'])
        self.assertEqual(analysis.user, self.user)

    def test_user_id_cannot_change_ownership(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'resume_file': self.create_file('resume.pdf'),
            'job_description': 'Testing fake user id.',
            'user': self.other_user.id,
            'user_id': self.other_user.id
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        analysis = ResumeAnalysis.objects.get(id=response.data['id'])
        # The owner must still be the authenticated user
        self.assertEqual(analysis.user, self.user)

class ResumeAnalysisListTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(email='user1@example.com', password='password123')
        self.user2 = User.objects.create_user(email='user2@example.com', password='password123')
        self.url = reverse('resume-list-create')
        
        # Create some analyses for user1
        self.analysis1 = ResumeAnalysis.objects.create(user=self.user1, job_description='Job 1')
        self.analysis2 = ResumeAnalysis.objects.create(user=self.user1, job_description='Job 2')
        # Create some analyses for user2
        self.analysis3 = ResumeAnalysis.objects.create(user=self.user2, job_description='Job 3')

    def test_get_resumes_authenticated(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only see their own analyses
        self.assertEqual(len(response.data), 2)
        # Should be ordered newest first
        self.assertEqual(response.data[0]['id'], self.analysis2.id)
        self.assertEqual(response.data[1]['id'], self.analysis1.id)

    def test_cannot_see_other_users_analyses(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.analysis3.id)

    def test_get_resumes_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ResumeAnalysisDetailTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(email='user1@example.com', password='password123')
        self.user2 = User.objects.create_user(email='user2@example.com', password='password123')
        
        self.analysis1 = ResumeAnalysis.objects.create(
            user=self.user1, 
            job_description='Job 1', 
            extracted_text='Text 1',
            score=90
        )
        self.analysis2 = ResumeAnalysis.objects.create(
            user=self.user2, 
            job_description='Job 2'
        )

    def get_url(self, pk):
        return reverse('resume-detail', kwargs={'pk': pk})

    def test_get_resume_detail_authenticated(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(self.get_url(self.analysis1.pk))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.analysis1.id)
        self.assertEqual(response.data['extracted_text'], 'Text 1')
        self.assertEqual(response.data['score'], 90)

    def test_get_resume_detail_unauthenticated(self):
        response = self.client.get(self.get_url(self.analysis1.pk))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_resume_detail_nonexistent_id(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(self.get_url(9999))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_resume_detail_cross_user_access(self):
        self.client.force_authenticate(user=self.user1)
        # Attempt to access user2's analysis
        response = self.client.get(self.get_url(self.analysis2.pk))
        # Should return 404 because get_queryset filters by request.user
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
