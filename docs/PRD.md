# Product Requirements Document (PRD)

## AI Resume Analyzer

### 1. Product Overview

**Product Name:** AI Resume Analyzer

**Product Type:** AI-powered web application

**Technology:** React.js + Django REST Framework + PostgreSQL/MySQL + Gemini/OpenAI API

**Purpose:**

The AI Resume Analyzer helps job seekers analyze their resumes against a specific job description. The system extracts information from the resume, compares it with the job requirements, identifies missing skills, provides an ATS-style score, and generates actionable suggestions for improving the resume.

---

## 2. Problem Statement

Job seekers often don't know:

* Whether their resume matches a particular job.
* Which skills are missing from their resume.
* Whether their resume is ATS-friendly.
* Which sections need improvement.
* Why their resume may be rejected by recruiters.

Manually comparing a resume with every job description is time-consuming.

Therefore, we want to build an AI-powered application that automatically analyzes a resume against a job description and provides useful feedback.

---

## 3. Target Users

### Primary Users

* Freshers looking for jobs.
* Software developers.
* Students.
* Professionals changing jobs.
* Job seekers applying to multiple companies.

### Example User

A Python Full Stack Developer uploads:

**Resume:** `Rajat_Resume.pdf`

**Job Description:**

> Looking for a Python Developer with Django, REST API, PostgreSQL, React, Git and Docker experience.

The application analyzes both documents and provides a compatibility score and recommendations.

---

# 4. Product Goals

The application should:

1. Allow users to upload their resume.
2. Allow users to enter or upload a job description.
3. Extract text from the resume.
4. Analyze resume content using AI.
5. Compare resume skills with job requirements.
6. Generate an ATS-style compatibility score.
7. Identify missing skills.
8. Identify matching skills.
9. Suggest improvements.
10. Provide an improved resume summary or bullet-point suggestions.

---

# 5. MVP Scope

The first version should focus only on the core functionality.

### MVP Features

#### User Authentication

* User registration.
* User login.
* JWT authentication.
* Logout.
* Protected API endpoints.

#### Resume Upload

Supported formats:

* PDF
* DOCX

User uploads a resume.

The backend extracts text from the document.

#### Job Description Input

The user can:

* Paste a job description into a text box.
* Optionally upload a job-description file.

#### AI Analysis

The AI should analyze:

* Skills
* Experience
* Education
* Projects
* Keywords
* Technologies
* Job requirements

#### Resume Score

Generate an overall score from:

**0–100**

Example:

> Resume Match Score: **78/100**

#### Skills Analysis

Example:

**Matched Skills**

* Python
* Django
* REST API
* React
* MySQL
* Git

**Missing Skills**

* Docker
* PostgreSQL
* AWS

#### Recommendations

Example:

> Add Docker experience if you have worked with Docker.

> Add measurable achievements to your project descriptions.

> Mention REST API development in your professional summary.

---

# 6. User Flow

The basic user flow should be:

```text
User
 ↓
Login/Register
 ↓
Dashboard
 ↓
Upload Resume
 ↓
Paste Job Description
 ↓
Click "Analyze Resume"
 ↓
Backend extracts resume text
 ↓
AI analyzes resume + job description
 ↓
Backend calculates/stores result
 ↓
Frontend displays analysis
```

---

# 7. Functional Requirements

## FR-1: User Registration

The system must allow users to create an account.

Required fields:

* Name
* Email
* Password

---

## FR-2: User Login

Users must be able to log in using email and password.

The backend should return a JWT token after successful authentication.

---

## FR-3: Resume Upload

The user must be able to upload a PDF or DOCX resume.

The backend should:

1. Validate the file.
2. Store the file.
3. Extract text.
4. Save the extracted text.

---

## FR-4: Job Description

The user must be able to enter a job description.

Example:

```text
We are looking for a Python Full Stack Developer
with experience in Django, React, REST APIs,
PostgreSQL and Docker.
```

---

## FR-5: Resume Analysis

When the user clicks:

**Analyze Resume**

the backend should send relevant resume and job-description information to the AI service.

The AI should return structured analysis.

Example:

```json
{
    "score": 82,
    "matched_skills": [
        "Python",
        "Django",
        "React",
        "REST API"
    ],
    "missing_skills": [
        "Docker",
        "PostgreSQL"
    ],
    "recommendations": [
        "Add Docker experience",
        "Improve project descriptions"
    ]
}
```

---

# 8. Analysis Categories

The system should analyze the resume in several categories.

### Skills Match

Compare required skills with skills present in the resume.

### Experience Match

Compare required experience with the candidate's experience.

### Education Match

Check whether educational requirements are satisfied.

### Keyword Match

Identify important keywords from the job description.

### Project Relevance

Determine whether projects are relevant to the target job.

### Resume Quality

Analyze:

* Formatting
* Clarity
* Action verbs
* Quantifiable achievements
* Section completeness

---

# 9. Score Calculation

The application can initially use a simple scoring model.

Example:

| Category          | Weight |
| ----------------- | -----: |
| Skills Match      |    40% |
| Experience Match  |    20% |
| Keyword Match     |    15% |
| Project Relevance |    15% |
| Education         |    10% |

Total:

**100%**

Example:

```text
Skills Match       = 34/40
Experience Match   = 16/20
Keyword Match      = 12/15
Projects           = 12/15
Education          = 10/10

Total = 84/100
```

The AI can provide qualitative feedback, while deterministic backend logic can handle parts of the scoring where appropriate.

---

# 10. Dashboard Requirements

The dashboard should display:

### Resume

```text
Rajat_Sharma_Resume.pdf
```

### Job

```text
Python Full Stack Developer
```

### Overall Score

```text
84 / 100
```

### Skills

```text
Matched:
✓ Python
✓ Django
✓ React
✓ REST API

Missing:
✗ Docker
✗ PostgreSQL
```

### Recommendations

```text
1. Add Docker experience.
2. Mention PostgreSQL if applicable.
3. Add measurable results to projects.
4. Improve professional summary.
```

---

# 11. Analysis History

Users should be able to see previous analyses.

Example:

```text
Analysis History

Python Developer       84%    12 Aug 2026
Django Developer       76%    10 Aug 2026
Backend Developer       69%     8 Aug 2026
```

The user should be able to click an analysis and view its complete result.

---

# 12. Non-Functional Requirements

### Performance

The analysis should ideally complete within a reasonable time, for example:

**< 30 seconds**

depending on document size and AI API response time.

### Security

* Passwords must never be stored as plain text.
* JWT authentication should be used for protected APIs.
* Uploaded files must be validated.
* Users should only access their own resumes and analyses.
* API keys must be stored in environment variables.
* AI prompts should not expose unnecessary personal information.

### Scalability

The backend should be designed so AI processing can later be moved to background jobs using Celery/Redis if analysis becomes slow.

### Reliability

If the AI API fails, the application should return a meaningful error rather than crashing.

---

# 13. Suggested Technology Stack

## Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Bootstrap/Tailwind
* Axios

## Backend

* Python
* Django
* Django REST Framework

## Database

* PostgreSQL

## Authentication

* JWT

## AI

* Google Gemini API or OpenAI API

## Document Processing

For PDF:

* PyMuPDF

For DOCX:

* python-docx

## Deployment

Frontend:

* Vercel

Backend:

* Render/Railway/AWS

Database:

* PostgreSQL

---

# 14. High-Level Architecture

```text
                 React Frontend
                       |
                       | HTTP / REST API
                       ↓
              Django REST Framework
                       |
          ┌────────────┼────────────┐
          ↓            ↓            ↓
      PostgreSQL    File Storage   AI Service
          |            |            |
          |         PDF/DOCX     Gemini/OpenAI
          |            |
          └────────────┴────────────┘
                       |
                  Analysis Result
                       ↓
                 React Dashboard
```

---

# 15. Suggested Database Models

### User

```text
User
- id
- name
- email
- password
- created_at
```

### Resume

```text
Resume
- id
- user
- file
- extracted_text
- uploaded_at
```

### JobDescription

```text
JobDescription
- id
- user
- title
- description
- created_at
```

### Analysis

```text
Analysis
- id
- user
- resume
- job_description
- score
- matched_skills
- missing_skills
- recommendations
- created_at
```

---

# 16. API Requirements

### Authentication

```text
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/refresh/
```

### Resume

```text
POST /api/resumes/
GET /api/resumes/
GET /api/resumes/{id}/
DELETE /api/resumes/{id}/
```

### Job Description

```text
POST /api/jobs/
GET /api/jobs/
GET /api/jobs/{id}/
DELETE /api/jobs/{id}/
```

### Analysis

```text
POST /api/analyses/
GET /api/analyses/
GET /api/analyses/{id}/
```

Example:

```text
POST /api/analyses/
```

Request:

```json
{
    "resume_id": 12,
    "job_description_id": 5
}
```

Response:

```json
{
    "score": 84,
    "matched_skills": [
        "Python",
        "Django",
        "React",
        "REST API"
    ],
    "missing_skills": [
        "Docker",
        "PostgreSQL"
    ],
    "recommendations": [
        "Add Docker experience",
        "Improve project descriptions"
    ]
}
```

---

# 17. User Stories

### User Story 1

**As a job seeker, I want to upload my resume so that the application can analyze it.**

### User Story 2

**As a job seeker, I want to enter a job description so that I can compare my resume against it.**

### User Story 3

**As a job seeker, I want to see a match score so that I can understand how well my resume matches the job.**

### User Story 4

**As a job seeker, I want to see missing skills so that I know what skills I should improve.**

### User Story 5

**As a job seeker, I want recommendations so that I can improve my resume before applying.**

---

# 18. Acceptance Criteria

The feature is considered complete when:

### Resume Upload

* PDF/DOCX files can be uploaded.
* Invalid files are rejected.
* Resume text is successfully extracted.

### Analysis

* User can select a resume.
* User can select/enter a job description.
* User can start analysis.
* AI analysis is successfully generated.
* Score is displayed.

### Results

The result page displays:

* Overall score
* Matched skills
* Missing skills
* Keyword analysis
* Recommendations

### Security

* Unauthorized users cannot access another user's resume.
* Protected APIs require authentication.

---

# 19. Out of Scope for MVP

The following features will NOT be included in the first version:

* Automatic job application.
* LinkedIn integration.
* Automatic emailing recruiters.
* Interview preparation.
* Video interview analysis.
* Resume template marketplace.
* Multi-language resume generation.

These can be added in future versions.

---

# 20. Future Features

### Version 2

* AI resume rewriting.
* Multiple resume versions.
* Resume templates.
* Cover letter generation.
* Job recommendation system.

### Version 3

* LinkedIn profile analysis.
* Job-board integration.
* Interview question generation.
* Personalized learning roadmap.

---

# 21. Success Metrics

The product can be considered successful if:

* Users successfully upload resumes.
* Analysis completes successfully.
* Users return to analyze multiple jobs.
* Users download/improve their resumes after analysis.
* Analysis results are considered useful by users.

Example MVP targets:

```text
Resume processing success rate > 95%

AI analysis success rate > 95%

Average analysis time < 30 seconds

User satisfaction > 4/5
```

---

# 22. MVP Development Plan

### Phase 1 — Foundation

* Create Django project.
* Configure PostgreSQL.
* Create React application.
* Setup JWT authentication.
* Configure Git/GitHub.

### Phase 2 — Resume Management

* Resume upload API.
* PDF/DOCX text extraction.
* Resume database model.
* Resume dashboard.

### Phase 3 — Job Description

* Job description model.
* Create job description API.
* Job description UI.

### Phase 4 — AI Integration

* Integrate Gemini/OpenAI API.
* Design structured prompt.
* Parse AI response.
* Store analysis.

### Phase 5 — Analysis Dashboard

* Score visualization.
* Matched skills.
* Missing skills.
* Recommendations.
* Keyword analysis.

### Phase 6 — Testing

* Django unit tests.
* API testing using Postman.
* Frontend testing.
* Authentication testing.
* File-upload testing.
* AI failure handling.

### Phase 7 — Deployment

```text
React → Vercel
Django → Render
PostgreSQL → Cloud Database
```

---

# 23. Definition of Done

The MVP is considered complete when:

* User can register/login.
* User can upload a resume.
* Resume text is extracted.
* User can enter a job description.
* Backend sends relevant data to the AI.
* AI returns structured analysis.
* Match score is generated.
* Matched/missing skills are displayed.
* Recommendations are displayed.
* Analysis is stored in the database.
* User can view previous analyses.
* APIs are authenticated.
* Application is deployed.
* Basic tests are passing.

---

## Final Product

The final user experience should look approximately like:

```text
             AI RESUME ANALYZER

     Upload your resume
              ↓
       Resume.pdf ✓

     Enter Job Description
              ↓
       Python Developer
              ↓
        [ ANALYZE ]

              ↓

       Resume Score
          84 / 100

    ┌─────────────────────┐
    │ Matched Skills      │
    │ ✓ Python            │
    │ ✓ Django            │
    │ ✓ React             │
    │ ✓ REST API          │
    └─────────────────────┘

    ┌─────────────────────┐
    │ Missing Skills      │
    │ ✗ Docker            │
    │ ✗ PostgreSQL        │
    └─────────────────────┘

    ┌─────────────────────┐
    │ AI Recommendations  │
    │ • Add Docker        │
    │ • Improve summary   │
    │ • Add metrics       │
    └─────────────────────┘
```

This PRD becomes your **source of truth before development**. From it, you can derive your database models, API endpoints, React pages, Django apps, AI prompts, test cases, and development tasks.
