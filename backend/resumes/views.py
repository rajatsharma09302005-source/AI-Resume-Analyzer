from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import ValidationError
from .models import ResumeAnalysis
from .serializers import ResumeAnalysisSerializer
from .services.text_extractor import extract_text_from_resume
from .services.gemini_analyzer import analyze_resume

class ResumeAnalysisListCreateView(generics.ListCreateAPIView):
    serializer_class = ResumeAnalysisSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return ResumeAnalysis.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        analysis = serializer.save(user=self.request.user)
        
        # Extract text from the uploaded document
        extracted_text = extract_text_from_resume(analysis.resume_file)
        
        if not extracted_text:
            # Revert creation if the document is completely empty or unreadable
            analysis.delete()
            raise ValidationError({"resume_file": "The uploaded document contains no extractable text."})
            
        analysis.extracted_text = extracted_text
        
        # Perform Gemini AI analysis
        analysis_data = analyze_resume(extracted_text, analysis.job_description)
        
        analysis.analysis_result = analysis_data
        analysis.score = analysis_data.get('overall_score')
        
        analysis.save(update_fields=['extracted_text', 'analysis_result', 'score'])


class ResumeAnalysisDetailView(generics.RetrieveAPIView):
    serializer_class = ResumeAnalysisSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ResumeAnalysis.objects.filter(user=self.request.user)
