from django.urls import path
from .views import ResumeAnalysisListCreateView, ResumeAnalysisDetailView

urlpatterns = [
    path('', ResumeAnalysisListCreateView.as_view(), name='resume-list-create'),
    path('<int:pk>/', ResumeAnalysisDetailView.as_view(), name='resume-detail'),
]
