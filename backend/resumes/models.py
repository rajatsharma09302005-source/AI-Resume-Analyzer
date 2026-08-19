from django.db import models
from django.conf import settings

class ResumeAnalysis(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resume_analyses'
    )
    resume_file = models.FileField(upload_to='resumes/', null=True, blank=True)
    job_description = models.TextField(null=True, blank=True)
    extracted_text = models.TextField(null=True, blank=True)
    analysis_result = models.JSONField(null=True, blank=True)
    score = models.IntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Analysis {self.id} for {self.user.email}"

