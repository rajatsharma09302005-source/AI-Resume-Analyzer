from rest_framework import serializers
from .models import ResumeAnalysis
import os

ALLOWED_EXTENSIONS = ['.pdf', '.docx']
ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
]

class ResumeAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeAnalysis
        fields = ('id', 'resume_file', 'job_description', 'extracted_text', 'analysis_result', 'score', 'created_at', 'updated_at')
        read_only_fields = ('id', 'extracted_text', 'analysis_result', 'score', 'created_at', 'updated_at')
        extra_kwargs = {
            'resume_file': {'required': True, 'allow_null': False}
        }

    def validate_job_description(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Job description cannot be empty.")
        return value

    def validate_resume_file(self, value):
        if not value:
            raise serializers.ValidationError("Resume file is required.")

        ext = os.path.splitext(value.name)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError(f"Unsupported file extension. Allowed: {', '.join(ALLOWED_EXTENSIONS)}")

        if hasattr(value, 'content_type') and value.content_type:
            # Some clients might send generic application/octet-stream, 
            # so we only strictly reject if we have a type and it doesn't match
            # But since we want to validate MIME type where practical:
            if value.content_type not in ALLOWED_MIME_TYPES and value.content_type != 'application/octet-stream':
                 raise serializers.ValidationError("Unsupported file type. Allowed: PDF or DOCX.")

        return value
