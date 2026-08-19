import io
import pypdf
import docx

def extract_text_from_pdf(file_obj):
    """Extract text from a PDF file object."""
    text = ""
    try:
        reader = pypdf.PdfReader(file_obj)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    except Exception:
        # Catch any parsing errors and return whatever text was extracted, or empty
        return ""
    return text

def extract_text_from_docx(file_obj):
    """Extract text from a DOCX file object."""
    text = ""
    try:
        doc = docx.Document(file_obj)
        for para in doc.paragraphs:
            if para.text:
                text += para.text + "\n"
    except Exception:
        return ""
    return text

def extract_text_from_resume(resume_file):
    """
    Given a Django File object, read its contents, determine the file type
    safely (using magic bytes), and extract the text.
    Returns clean text or empty string if unreadable/empty.
    """
    if not resume_file:
        return ""

    try:
        resume_file.open(mode='rb')
        content = resume_file.read()
    except Exception:
        return ""
    finally:
        resume_file.close()

    if not content:
        return ""

    file_obj = io.BytesIO(content)
    header = content[:10]

    text = ""
    # Check magic bytes rather than just extension for security/robustness
    if header.startswith(b'%PDF-'):
        text = extract_text_from_pdf(file_obj)
    elif header.startswith(b'PK\x03\x04'):
        # ZIP file signature, used by DOCX
        text = extract_text_from_docx(file_obj)
    else:
        # Fallback: try PDF first, then DOCX if PDF fails to extract anything
        # (Some files might have weird headers)
        text = extract_text_from_pdf(file_obj)
        if not text:
            file_obj.seek(0)
            text = extract_text_from_docx(file_obj)

    if not text:
        return ""

    # Clean the text:
    # - preserve meaningful line breaks
    # - remove obviously unnecessary whitespace
    lines = [line.strip() for line in text.split('\n')]
    cleaned_lines = [line for line in lines if line]
    
    return "\n".join(cleaned_lines)
