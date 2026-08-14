# Technical Architecture & Design Document (TAD)

## AI Resume Analyzer

**Version:** 1.0
**Status:** MVP
**Backend:** Python + Django REST Framework
**Frontend:** React.js
**Database:** PostgreSQL
**AI:** Google Gemini API
**Authentication:** JWT

---

# 1. Purpose

This document describes the technical architecture and implementation approach for the AI Resume Analyzer.

The system allows a user to:

1. Register/login.
2. Upload a resume.
3. Enter a job description.
4. Extract text from the resume.
5. Send resume and job-description data to an AI model.
6. Analyze compatibility.
7. Generate a score and recommendations.
8. Store the analysis.
9. View previous analyses.

---

# 2. System Architecture

The application follows a three-layer architecture.

```text
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │                     │
                    │ Login               │
                    │ Dashboard           │
                    │ Resume Upload       │
                    │ Analysis Results    │
                    └──────────┬──────────┘
                               │
                         HTTP / REST
                               │
                               ↓
                    ┌─────────────────────┐
                    │ Django REST API     │
                    │                     │
                    │ Authentication      │
                    │ Resume API          │
                    │ Job API             │
                    │ Analysis API        │
                    └──────┬───────┬──────┘
                           │       │
                    ┌──────┘       └──────────┐
                    ↓                         ↓
             ┌──────────────┐        ┌────────────────┐
             │ PostgreSQL   │        │ Gemini API     │
             │              │        │                │
             │ Users        │        │ AI Analysis    │
             │ Resumes      │        │ Recommendations│
             │ Jobs         │        └────────────────┘
             │ Analyses     │
             └──────────────┘
```

---

# 3. Technology Stack

## Frontend

* React.js
* JavaScript
* Axios
* React Router
* Bootstrap/Tailwind CSS

## Backend

* Python
* Django
* Django REST Framework
* Simple JWT

## Database

* PostgreSQL

## AI

* Google Gemini API

## Document Processing

PDF:

* PyMuPDF

DOCX:

* python-docx

## Development Tools

* VS Code
* Git
* GitHub
* Postman

## Deployment

Frontend:

* Vercel

Backend:

* Render

Database:

* PostgreSQL cloud database

---

# 4. Project Structure

## Backend

```text
backend/
│
├── manage.py
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
├── users/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── permissions.py
│
├── resumes/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── services.py
│   └── utils.py
│
├── jobs/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── analyses/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── services.py
│
├── ai/
│   ├── gemini.py
│   ├── prompts.py
│   └── parser.py
│
├── requirements.txt
└── .env
```

---

# 5. Frontend Structure

```text
frontend/
│
├── src/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ResumeUpload.jsx
│   │   ├── JobDescription.jsx
│   │   ├── ScoreCard.jsx
│   │   ├── SkillsList.jsx
│   │   └── RecommendationList.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Analysis.jsx
│   │   └── History.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
└── package.json
```

---

# 6. Backend Applications

The Django project will contain separate applications based on responsibility.

### users

Responsible for:

* Registration
* Login
* JWT authentication
* User management

### resumes

Responsible for:

* Resume upload
* File validation
* Text extraction
* Resume storage

### jobs

Responsible for:

* Job description creation
* Job description storage
* Job management

### analyses

Responsible for:

* Starting analysis
* Storing results
* Retrieving analysis history

### ai

Responsible for:

* Gemini API integration
* Prompt construction
* AI response parsing

---

# 7. Database Design

## User

Django's custom user model should be used.

```text
User
----------------
id
name
email
password
created_at
updated_at
```

Email should be unique.

Passwords must be stored using Django's password hashing mechanism.

---

# 8. Resume Model

```text
Resume
----------------
id
user_id
file
original_filename
extracted_text
created_at
updated_at
```

### Relationships

```text
User 1 ──────── * Resume
```

One user can upload multiple resumes.

---

# 9. Job Description Model

```text
JobDescription
----------------
id
user_id
title
description
created_at
updated_at
```

Relationship:

```text
User 1 ──────── * JobDescription
```

---

# 10. Analysis Model

```text
Analysis
----------------
id
user_id
resume_id
job_description_id
score
matched_skills
missing_skills
keyword_analysis
recommendations
ai_response
created_at
```

Relationships:

```text
User
 │
 ├──── Resume
 │
 ├──── JobDescription
 │
 └──── Analysis
          │
          ├──── Resume
          └──── JobDescription
```

---

# 11. Database Relationship

```text
                 User
                  │
       ┌──────────┼──────────┐
       │          │          │
       ↓          ↓          ↓
    Resume       Job       Analysis
       │          │          │
       └──────────┴──────────┘
```

The `Analysis` record connects a particular resume with a particular job description.

---

# 12. API Architecture

The backend will expose REST APIs.

Base URL:

```text
/api/
```

---

# 13. Authentication APIs

### Register

```text
POST /api/auth/register/
```

Request:

```json
{
    "name": "Rajat Sharma",
    "email": "user@example.com",
    "password": "password"
}
```

Response:

```json
{
    "message": "User registered successfully"
}
```

---

### Login

```text
POST /api/auth/login/
```

Response:

```json
{
    "access": "JWT_ACCESS_TOKEN",
    "refresh": "JWT_REFRESH_TOKEN"
}
```

---

### Refresh Token

```text
POST /api/auth/refresh/
```

---

# 14. Resume APIs

### Upload Resume

```text
POST /api/resumes/
```

Content type:

```text
multipart/form-data
```

Request:

```text
file = resume.pdf
```

Response:

```json
{
    "id": 1,
    "filename": "resume.pdf",
    "message": "Resume uploaded successfully"
}
```

---

### Get Resumes

```text
GET /api/resumes/
```

---

### Get Resume

```text
GET /api/resumes/{id}/
```

---

### Delete Resume

```text
DELETE /api/resumes/{id}/
```

---

# 15. Job Description APIs

### Create Job

```text
POST /api/jobs/
```

Request:

```json
{
    "title": "Python Full Stack Developer",
    "description": "We are looking for a Python developer..."
}
```

---

### Get Jobs

```text
GET /api/jobs/
```

---

### Get Job

```text
GET /api/jobs/{id}/
```

---

### Delete Job

```text
DELETE /api/jobs/{id}/
```

---

# 16. Analysis API

The main endpoint is:

```text
POST /api/analyses/
```

Request:

```json
{
    "resume_id": 1,
    "job_description_id": 5
}
```

Backend flow:

```text
Request
   ↓
JWT Authentication
   ↓
Validate resume ownership
   ↓
Validate job ownership
   ↓
Get extracted resume text
   ↓
Get job description
   ↓
Create AI prompt
   ↓
Call Gemini API
   ↓
Validate AI response
   ↓
Calculate/validate score
   ↓
Save Analysis
   ↓
Return JSON
```

---

# 17. Analysis Response

Example:

```json
{
    "id": 15,
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
    "keyword_analysis": {
        "matched": 14,
        "missing": 4
    },
    "recommendations": [
        "Add Docker experience if applicable",
        "Improve project descriptions",
        "Add measurable achievements"
    ]
}
```

---

# 18. Resume Text Extraction

When the user uploads a resume:

```text
             Resume Upload
                    ↓
              File Validation
                    ↓
             Identify File Type
                /       \
              PDF       DOCX
               ↓          ↓
           PyMuPDF    python-docx
                \       /
                 ↓     ↓
               Extract Text
                    ↓
              Save to Database
```

The system should not send the raw file to the AI if extracting text first is sufficient.

---

# 19. File Validation

The backend should validate:

### File extension

Allowed:

```text
.pdf
.docx
```

### File size

For example:

```text
Maximum = 5 MB
```

### Empty document

Reject documents from which no meaningful text can be extracted.

### Security

Uploaded files should not be treated as executable content.

---

# 20. AI Integration Architecture

The AI integration should be isolated inside the `ai` application.

```text
analyses/services.py
        ↓
ai/gemini.py
        ↓
Google Gemini API
        ↓
Structured JSON
        ↓
parser.py
        ↓
Analysis Service
        ↓
Database
```

This separation prevents AI-specific code from being scattered throughout Django views.

---

# 21. AI Prompt Design

The AI should receive structured information.

Conceptually:

```text
SYSTEM:

You are an expert resume analyzer.

Analyze the candidate resume against the job description.

Return only valid JSON.

RESUME:

{resume_text}

JOB DESCRIPTION:

{job_description}
```

The expected output should follow a fixed schema.

```json
{
    "score": 84,
    "matched_skills": [],
    "missing_skills": [],
    "keyword_analysis": {},
    "recommendations": []
}
```

The backend should validate the response before saving it.

---

# 22. AI Response Validation

AI output cannot be blindly trusted.

The backend should check:

```text
AI Response
     ↓
Is valid JSON?
     ↓
Required fields present?
     ↓
Score between 0 and 100?
     ↓
Correct data types?
     ↓
Save result
```

If validation fails:

```text
AI Response Invalid
        ↓
Retry / Return Error
```

---

# 23. Score Calculation

For the MVP, the system can use a hybrid approach.

### AI

AI identifies:

* Skills
* Requirements
* Missing skills
* Relevant experience
* Recommendations

### Backend

Backend validates and calculates deterministic parts of the score.

Example:

```text
Skills Match       40%
Experience Match   20%
Keywords           15%
Projects           15%
Education          10%
```

This approach is preferable to allowing the AI to arbitrarily generate the entire score.

---

# 24. Frontend Architecture

React will consume Django REST APIs.

```text
React Component
      ↓
Axios
      ↓
Django REST API
      ↓
JSON Response
      ↓
React State
      ↓
UI
```

---

# 25. Authentication Flow

```text
User
 ↓
Login Form
 ↓
POST /auth/login/
 ↓
Django
 ↓
Verify Credentials
 ↓
JWT Access + Refresh Token
 ↓
Frontend
 ↓
Store token securely
 ↓
Future API requests
 ↓
Authorization: Bearer <token>
```

Protected APIs should verify the JWT before returning user-specific data.

---

# 26. Resume Upload Flow

```text
React
 ↓
User selects PDF
 ↓
FormData
 ↓
Axios POST
 ↓
Django REST API
 ↓
Authentication
 ↓
File validation
 ↓
Save file
 ↓
Extract text
 ↓
Save Resume
 ↓
Return Resume ID
```

---

# 27. Complete Analysis Flow

```text
User
 ↓
Select Resume
 ↓
Select Job Description
 ↓
Click Analyze
 ↓
React
 ↓
POST /api/analyses/
 ↓
Django
 ↓
Validate JWT
 ↓
Validate ownership
 ↓
Get resume text
 ↓
Get job description
 ↓
Build prompt
 ↓
Gemini API
 ↓
AI JSON response
 ↓
Validate response
 ↓
Store Analysis
 ↓
Return JSON
 ↓
React
 ↓
Display Score
 ↓
Display Skills
 ↓
Display Recommendations
```

---

# 28. Security Design

### Authentication

Use JWT authentication.

### Authorization

Every resource must belong to the authenticated user.

For example:

```text
User A
   ↓
Resume 1

User B
   ↓
Resume 2
```

User A must never be able to request:

```text
/api/resumes/2/
```

and receive User B's resume.

### API Keys

Gemini API key must never be placed inside React.

Incorrect:

```text
React → Gemini API
```

Correct:

```text
React → Django → Gemini
```

The Gemini API key stays on the backend.

---

# 29. Error Handling

The API should return meaningful HTTP status codes.

### 400

Invalid request.

Example:

```json
{
    "error": "Invalid resume file"
}
```

### 401

Authentication required.

### 403

User doesn't have permission.

### 404

Resource doesn't exist.

### 413

File too large.

### 500

Unexpected server error.

### AI Failure

If Gemini is unavailable:

```json
{
    "error": "AI analysis is temporarily unavailable. Please try again."
}
```

The application should not expose internal API keys or stack traces.

---

# 30. API Security

Implement:

* JWT authentication
* Permission classes
* CORS configuration
* File validation
* Request validation
* Environment variables
* Rate limiting if required
* HTTPS in production

Environment variables:

```text
SECRET_KEY=
DEBUG=
DATABASE_URL=
GEMINI_API_KEY=
ALLOWED_HOSTS=
```

---

# 31. Frontend Pages

## Login

```text
Email
Password

[ Login ]

Don't have an account?
Register
```

## Register

```text
Name
Email
Password
Confirm Password

[ Register ]
```

## Dashboard

```text
Welcome, Rajat

Upload Resume
Enter Job Description

[ Analyze Resume ]

Recent Analyses
```

## Analysis Page

```text
Resume Match Score

       84 / 100

Matched Skills
✓ Python
✓ Django
✓ React

Missing Skills
✗ Docker
✗ PostgreSQL

Recommendations
1. Improve project descriptions.
2. Add measurable achievements.
```

## History

```text
Previous Analyses

Python Developer        84%
Django Developer        76%
Backend Developer       69%
```

---

# 32. API Authentication in Axios

The frontend should attach the access token to protected requests.

Conceptually:

```text
Authorization: Bearer <access_token>
```

Axios interceptors can be used so that the token is automatically attached to API requests.

---

# 33. State Management

For the MVP, React Context can handle authentication state.

Example:

```text
AuthContext
    │
    ├── user
    ├── accessToken
    ├── login()
    ├── logout()
    └── register()
```

More advanced state-management libraries are not necessary for the MVP.

---

# 34. Testing Strategy

## Backend

Test:

* Registration
* Login
* JWT authentication
* Resume upload
* File validation
* Text extraction
* Job creation
* Analysis creation
* Authorization
* AI response validation

## API Testing

Use Postman.

Example:

```text
Register
 ↓
Login
 ↓
Copy JWT
 ↓
Upload Resume
 ↓
Create Job
 ↓
Analyze
 ↓
Get Analysis
```

## Frontend

Test:

* Login
* Registration
* File upload
* Form validation
* Loading state
* Error state
* Analysis result rendering

---

# 35. AI Testing

AI responses can vary, so test cases should include:

### Case 1

Strong resume match.

Expected:

```text
High score
```

### Case 2

Poor resume match.

Expected:

```text
Low score
```

### Case 3

Resume missing required skills.

Expected:

```text
Missing skills identified
```

### Case 4

Invalid/empty AI response.

Expected:

```text
Graceful error handling
```

---

# 36. Performance Considerations

For MVP:

```text
React
  ↓
Django
  ↓
Gemini
```

For larger scale:

```text
React
  ↓
Django API
  ↓
Task Queue
  ↓
Celery
  ↓
Redis
  ↓
AI Processing
  ↓
Database
```

This prevents long-running AI processing from blocking API requests.

---

# 37. Deployment Architecture

Production architecture:

```text
                   Internet
                      │
             ┌────────┴────────┐
             ↓                 ↓
          Vercel             Render
        React App          Django API
                               │
                  ┌────────────┼────────────┐
                  ↓            ↓            ↓
              PostgreSQL    Gemini API   File Storage
```

Environment-specific configuration should be used for development and production.

---

# 38. Git Workflow

Recommended structure:

```text
main
 │
 ├── develop
 │
 ├── feature/auth
 ├── feature/resume-upload
 ├── feature/job-description
 ├── feature/ai-analysis
 └── feature/dashboard
```

Each feature should be developed separately and merged after testing.

---

# 39. Development Order

Do not start by writing the Gemini integration.

Build in this order:

```text
1. Project Setup
       ↓
2. Database Models
       ↓
3. Authentication
       ↓
4. Resume Upload
       ↓
5. Text Extraction
       ↓
6. Job Description APIs
       ↓
7. Analysis API
       ↓
8. Gemini Integration
       ↓
9. Analysis Dashboard
       ↓
10. History
       ↓
11. Testing
       ↓
12. Deployment
```

---

# 40. MVP Technical Definition of Done

The technical implementation is complete when:

* Django project is configured.
* PostgreSQL is connected.
* Custom user/authentication is working.
* JWT authentication is working.
* Resume upload works.
* PDF/DOCX text extraction works.
* Job descriptions can be stored.
* Analysis API works.
* Gemini integration works.
* AI response is validated.
* Analysis is stored in PostgreSQL.
* Users can only access their own data.
* React dashboard displays analysis.
* Analysis history works.
* Error handling is implemented.
* APIs are tested using Postman.
* Frontend and backend are deployed.

---

# 41. Final Architecture

```text
                         USER
                           │
                           ↓
                    ┌─────────────┐
                    │ React.js    │
                    │ Frontend    │
                    └──────┬──────┘
                           │
                       Axios/REST
                           │
                           ↓
              ┌─────────────────────────┐
              │ Django REST Framework   │
              │                         │
              │ Authentication          │
              │ Resume APIs             │
              │ Job APIs                │
              │ Analysis APIs           │
              └───────┬─────────┬───────┘
                      │         │
                      ↓         ↓
             ┌────────────┐  ┌─────────────┐
             │ PostgreSQL │  │ AI Service  │
             │            │  │ Gemini API  │
             └────────────┘  └──────┬──────┘
                                    │
                                    ↓
                              AI Analysis
                                    │
                                    ↓
                              Django Backend
                                    │
                                    ↓
                               PostgreSQL
                                    │
                                    ↓
                              React Dashboard
                                    │
                                    ↓
                              User Results
```

# 42. PRD → TAD → Implementation Mapping

The important professional workflow is:

```text
PRD
 │
 │ Defines WHAT
 ↓
Technical Design / TAD
 │
 │ Defines HOW
 ↓
Database Design
 │
 ↓
API Design
 │
 ↓
Backend Implementation
 │
 ↓
Frontend Implementation
 │
 ↓
AI Integration
 │
 ↓
Testing
 │
 ↓
Deployment
```

For example:

**PRD requirement:**

> User should be able to upload a resume.

**TAD decision:**

> React uses `multipart/form-data` to send the file to `POST /api/resumes/`. Django validates the file, stores it, extracts text using PyMuPDF/python-docx, and stores the extracted text in PostgreSQL.

**Implementation:**

```text
React
  ↓
ResumeUpload.jsx
  ↓
Axios
  ↓
POST /api/resumes/
  ↓
ResumeViewSet
  ↓
ResumeSerializer
  ↓
ResumeService
  ↓
PyMuPDF
  ↓
PostgreSQL
```

That is the key difference: **the PRD tells you what the product needs; the TAD tells you how your engineering team will implement those requirements.**
