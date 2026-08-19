from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import patch
from resumes.services.text_extractor import extract_text_from_resume

class TextExtractorTests(TestCase):
    
    @patch('resumes.services.text_extractor.extract_text_from_pdf')
    def test_pdf_magic_bytes_calls_pdf_extractor(self, mock_pdf_extractor):
        mock_pdf_extractor.return_value = "PDF text content\nLine 2"
        
        content = b"%PDF-1.4 \n..."
        file_obj = SimpleUploadedFile("test.pdf", content, content_type="application/pdf")
        
        text = extract_text_from_resume(file_obj)
        self.assertEqual(text, "PDF text content\nLine 2")
        mock_pdf_extractor.assert_called_once()
        
    @patch('resumes.services.text_extractor.extract_text_from_docx')
    def test_docx_magic_bytes_calls_docx_extractor(self, mock_docx_extractor):
        mock_docx_extractor.return_value = "DOCX text content"
        
        content = b"PK\x03\x04..."
        file_obj = SimpleUploadedFile("test.docx", content, content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        
        text = extract_text_from_resume(file_obj)
        self.assertEqual(text, "DOCX text content")
        mock_docx_extractor.assert_called_once()

    @patch('resumes.services.text_extractor.extract_text_from_pdf', return_value='')
    @patch('resumes.services.text_extractor.extract_text_from_docx', return_value='')
    def test_empty_or_unreadable_document_returns_empty_string(self, mock_docx, mock_pdf):
        content = b"Not a pdf or docx, just garbage bytes"
        file_obj = SimpleUploadedFile("test.pdf", content, content_type="application/pdf")
        
        text = extract_text_from_resume(file_obj)
        self.assertEqual(text, "")
        
    @patch('resumes.services.text_extractor.extract_text_from_pdf')
    def test_fallback_when_magic_bytes_dont_match(self, mock_pdf_extractor):
        mock_pdf_extractor.return_value = "Recovered text"
        
        content = b"GARBAGE HEADER but maybe extractable"
        file_obj = SimpleUploadedFile("test.pdf", content, content_type="application/pdf")
        
        text = extract_text_from_resume(file_obj)
        self.assertEqual(text, "Recovered text")
        mock_pdf_extractor.assert_called_once()
