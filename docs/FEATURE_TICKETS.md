# Feature Ticket List

## AI Resume Analyzer

**Version:** 1.0
**Project Type:** Python Full Stack + AI
**Frontend:** React.js
**Backend:** Django REST Framework
**Database:** PostgreSQL
**AI:** Google Gemini API
**Authentication:** JWT

---

# 1. Ticket Structure

Each ticket contains:

* Ticket ID
* Feature
* Description
* Priority
* Component
* Dependencies
* Acceptance Criteria
* Status

Priority:

```text
P0 = Critical
P1 = High
P2 = Medium
P3 = Low
```

Status:

```text
TODO
IN PROGRESS
BLOCKED
DONE
```

---

# 2. Project Setup Tickets

## TICKET-001 — Initialize Backend

**Priority:** P0
**Component:** Backend
**Status:** TODO

### Description

Create the Django project and configure Django REST Framework.

### Tasks

* Create Django project.
* Install Django REST Framework.
* Configure settings.
* Configure environment variables.
* Configure database.
* Configure CORS.

### Acceptance Criteria

* Django server starts successfully.
* DRF is configured.
* PostgreSQL connection works.
* Environment variables are loaded correctly.

### Dependencies

None.

---

## TICKET-002 — Initialize Frontend

**Priority:** P0
**Component:** Frontend
**Status:** TODO

### Description

Create the React application using Vite.

### Tasks

* Create Vite React project.
* Install Axios.
* Install React Router.
* Configure Bootstrap.
* Create base folder structure.

### Acceptance Criteria

* React application starts.
* Routing works.
* Bootstrap loads successfully.

### Dependencies

None.

---

## TICKET-003 — Configure Git Repository

**Priority:** P0
**Component:** DevOps
**Status:** TODO

### Tasks

* Create Git repository.
* Create `.gitignore`.
* Add README.
* Configure Git branches.
* Ensure `.env` is ignored.

### Acceptance Criteria

* Repository created.
* Sensitive files are excluded.

---

# 3. Authentication Tickets

## TICKET-004 — User Registration

**Priority:** P0
**Component:** Backend
**Status:** TODO

### Description

Implement user registration.

### API

```text
POST /api/auth/register/
```

### Tasks

* Create user model/use Django User.
* Validate email.
* Validate password.
* Hash password.
* Create user.
* Return appropriate response.

### Acceptance Criteria

* Valid user can register.
* Duplicate email is rejected.
* Invalid password is rejected.
* Password is never stored as plain text.

---

## TICKET-005 — Login API

**Priority:** P0
**Component:** Backend
**Status:** TODO

### API

```text
POST /api/auth/login/
```

### Acceptance Criteria

* Valid credentials return JWT.
* Invalid credentials return error.
* Access token is generated.
* Refresh token is generated.

---

## TICKET-006 — Login UI

**Priority:** P0
**Component:** Frontend
**Status:** TODO

### Tasks

* Create Login page.
* Add email field.
* Add password field.
* Add validation.
* Integrate login API.
* Handle errors.
* Redirect to dashboard.

### Acceptance Criteria

User can successfully log in and reach the dashboard.

---

## TICKET-007 — Registration UI

**Priority:** P0
**Component:** Frontend
**Status:** TODO

### Tasks

* Create registration page.
* Add name/email/password fields.
* Validate fields.
* Connect registration API.

### Acceptance Criteria

User can create an account from the frontend.

---

## TICKET-008 — Protected Routes

**Priority:** P0
**Component:** Frontend
**Status:** TODO

### Description

Prevent unauthenticated users from accessing private pages.

### Protected Routes

```text
/dashboard
/resume
/analysis
/history
```

### Acceptance Criteria

Unauthenticated users are redirected to `/login`.

---

## TICKET-009 — Logout

**Priority:** P0
**Component:** Frontend
**Status:** TODO

### Acceptance Criteria

* Token/session information is cleared.
* User is redirected to login.
* Protected pages cannot be accessed afterward.

---

# 4. Resume Management Tickets

## TICKET-010 — Resume Model

**Priority:** P0
**Component:** Backend
**Status:** TODO

### Fields

```text
id
user
file
original_filename
extracted_text
created_at
updated_at
```

### Acceptance Criteria

Resume belongs to exactly one user.

---

## TICKET-011 — Resume Upload API

**Priority:** P0
**Component:** Backend
**Status:** TODO

### API

```text
POST /api/resumes/
```

### Requirements

* JWT authentication.
* PDF/DOCX validation.
* Maximum file size.
* Secure file handling.
* Extract text.
* Save resume.

### Acceptance Criteria

Valid PDF/DOCX files are successfully uploaded.

---

## TICKET-012 — PDF Text Extraction

**Priority:** P0
**Component:** Backend
**Status:** TODO

### Technology

```text
PyMuPDF
```

### Acceptance Criteria

Text can be extracted from supported PDF resumes.

---

## TICKET-013 — DOCX Text Extraction

**Priority:** P0
**Component:** Backend
**Status:** TODO

### Technology

```text
python-docx
```

### Acceptance Criteria

Text can be extracted from supported DOCX resumes.

---

## TICKET-014 — Resume Upload UI

**Priority:** P0
**Component:** Frontend
**Status:** TODO

### Features

* File selection.
* File validation.
* Upload button.
* Loading state.
* Success message.
* Error message.

### Acceptance Criteria

User can upload a valid resume from the dashboard.

---

## TICKET-015 — Resume List API

**Priority:** P1
**Component:** Backend
**Status:** TODO

### API

```text
GET /api/resumes/
```

### Acceptance Criteria

Only the authenticated user's resumes are returned.

---

## TICKET-016 — Delete Resume

**Priority:** P1
**Component:** Backend + Frontend
**Status:** TODO

### API

```text
DELETE /api/resumes/{id}/
```

### Acceptance Criteria

* User can delete their own resume.
* User cannot delete another user's resume.
* Associated data follows the defined deletion policy.

---

# 5. Job Description Tickets

## TICKET-017 — Job Description Model

**Priority:** P0
**Component:** Backend
**Status:** TODO

### Fields

```text
id
user
title
description
created_at
updated_at
```

---

## TICKET-018 — Create Job Description API

**Priority:** P0
**Component:** Backend
**Status:** TODO

### API

```text
POST /api/jobs/
```

### Acceptance Criteria

Authenticated user can create a job description.

---

## TICKET-019 — Job Description UI

**Priority:** P0
**Component:** Frontend
**Status:** TODO

### Features

* Job title.
* Description textarea.
* Validation.
* Save button.

---

## TICKET-020 — Job Description List

**Priority:** P1
**Component:** Backend + Frontend
**Status:** TODO

### API

```text
GET /api/jobs/
```

### Acceptance Criteria

User sees only their own job descriptions.

---

# 6. AI Analysis Tickets

## TICKET-021 — Analysis Model

**Priority:** P0
**Component:** Backend
**Status:** TODO

### Fields

```text
id
user
resume
job_description
score
matched_skills
missing_skills
keyword_analysis
recommendations
ai_response
created_at
```

---

## TICKET-022 — Gemini Integration

**Priority:** P0
**Component:** Backend
**Status:** TODO

### Description

Integrate Gemini API into the Django backend.

### Requirements

* Store API key in environment variables.
* Create dedicated AI service.
* Send resume/job data.
* Receive AI response.
* Handle API errors.

### Acceptance Criteria

Backend can successfully communicate with Gemini.

---

## TICKET-023 — Resume Analysis Prompt

**Priority:** P0
**Component:** AI
**Status:** TODO

### Description

Create structured prompt for resume analysis.

The prompt should ask Gemini to evaluate:

```text
Resume
+
Job Description
```

and return:

```text
Match Score
Matched Skills
Missing Skills
Keywords
Recommendations
```

---

## TICKET-024 — Structured AI Response

**Priority:** P0
**Component:** Backend
**Status:** TODO

### Description

Ensure AI output follows a predefined JSON structure.

### Acceptance Criteria

Backend validates:

* Score.
* Skills.
* Keywords.
* Recommendations.

Invalid AI responses should not be stored blindly.

---

## TICKET-025 — Analysis API

**Priority:** P0
**Component:** Backend
**Status:** TODO

### API

```text
POST /api/analyses/
```

### Flow

```text
Request
 ↓
Authenticate
 ↓
Validate resume ownership
 ↓
Validate job ownership
 ↓
Get resume text
 ↓
Get job description
 ↓
Call AI Service
 ↓
Validate AI response
 ↓
Save Analysis
 ↓
Return result
```

### Acceptance Criteria

Authenticated users can analyze their own resume against their own job description.

---

# 7. Analysis UI Tickets

## TICKET-026 — Analyze Resume Button

**Priority:** P0
**Component:** Frontend
**Status:** TODO

### Acceptance Criteria

Button is disabled until:

```text
Resume selected
+
Job description entered
```

---

## TICKET-027 — Analysis Loading State

**Priority:** P0
**Component:** Frontend
**Status:** TODO

### UI

```text
Analyzing your resume...

Please wait.
```

### Acceptance Criteria

User receives clear feedback while analysis is running.

---

## TICKET-028 — Score Card

**Priority:** P0
**Component:** Frontend
**Status:** TODO

### Example

```text
Resume Match Score

84 / 100
```

---

## TICKET-029 — Matched Skills UI

**Priority:** P0
**Component:** Frontend
**Status:** TODO

Display matched skills received from backend.

---

## TICKET-030 — Missing Skills UI

**Priority:** P0
**Component:** Frontend
**Status:** TODO

Display skills missing from the resume.

---

## TICKET-031 — Keyword Analysis UI

**Priority:** P1
**Component:** Frontend
**Status:** TODO

Display:

```text
Matched Keywords
Missing Keywords
Match Rate
```

---

## TICKET-032 — AI Recommendations UI

**Priority:** P0
**Component:** Frontend
**Status:** TODO

Display actionable recommendations generated by AI.

---

# 8. Analysis History Tickets

## TICKET-033 — Analysis History API

**Priority:** P1
**Component:** Backend
**Status:** TODO

### API

```text
GET /api/analyses/
```

### Acceptance Criteria

Only the authenticated user's analyses are returned.

---

## TICKET-034 — Analysis History UI

**Priority:** P1
**Component:** Frontend
**Status:** TODO

Display:

```text
Job
Score
Date
View
```

---

## TICKET-035 — Analysis Details API

**Priority:** P1
**Component:** Backend
**Status:** TODO

### API

```text
GET /api/analyses/{id}/
```

---

## TICKET-036 — Analysis Details UI

**Priority:** P1
**Component:** Frontend
**Status:** TODO

Display the complete analysis.

---

# 9. Security Tickets

## TICKET-037 — Object-Level Authorization

**Priority:** P0
**Component:** Backend
**Status:** TODO

Ensure users cannot access another user's:

```text
Resume
Job
Analysis
```

### Acceptance Criteria

Unauthorized resource access is rejected.

---

## TICKET-038 — Secure Gemini API Key

**Priority:** P0
**Component:** Backend
**Status:** TODO

### Requirements

* API key stored in environment variable.
* API key never sent to React.
* API key never committed to Git.

---

## TICKET-039 — CORS Configuration

**Priority:** P0
**Component:** Backend
**Status:** TODO

Allow only trusted frontend origins.

---

## TICKET-040 — File Upload Security

**Priority:** P0
**Component:** Backend
**Status:** TODO

Implement:

* File type validation.
* File size validation.
* Safe file handling.

---

## TICKET-041 — Rate Limiting

**Priority:** P1
**Component:** Backend
**Status:** TODO

Protect AI analysis endpoints from excessive requests.

---

# 10. Error Handling Tickets

## TICKET-042 — Backend Error Handling

**Priority:** P1
**Component:** Backend
**Status:** TODO

Create consistent API error responses.

Example:

```json
{
    "error": "Unable to process resume."
}
```

---

## TICKET-043 — Frontend Error Handling

**Priority:** P1
**Component:** Frontend
**Status:** TODO

Display user-friendly errors for:

* Login failures.
* Upload failures.
* Network failures.
* AI failures.
* Authorization failures.

---

# 11. UI/UX Tickets

## TICKET-044 — Responsive Dashboard

**Priority:** P1
**Component:** Frontend
**Status:** TODO

Dashboard should work on:

```text
Desktop
Tablet
Mobile
```

---

## TICKET-045 — Navbar

**Priority:** P1
**Component:** Frontend
**Status:** TODO

Include:

```text
Dashboard
History
Logout
```

---

## TICKET-046 — Empty States

**Priority:** P2
**Component:** Frontend
**Status:** TODO

Create empty states for:

* No resumes.
* No jobs.
* No analysis history.

---

## TICKET-047 — Loading States

**Priority:** P1
**Component:** Frontend
**Status:** TODO

Implement loading indicators for all important API operations.

---

# 12. Testing Tickets

## TICKET-048 — Authentication Testing

**Priority:** P0
**Component:** Testing
**Status:** TODO

Test:

* Registration.
* Login.
* Invalid credentials.
* Expired token.
* Logout.

---

## TICKET-049 — Authorization Testing

**Priority:** P0
**Component:** Testing
**Status:** TODO

Verify:

```text
User A → User A data     ✅
User A → User B data     ❌
```

---

## TICKET-050 — Resume Upload Testing

**Priority:** P0
**Component:** Testing
**Status:** TODO

Test:

* Valid PDF.
* Valid DOCX.
* Invalid file.
* Oversized file.
* Corrupt file.

---

## TICKET-051 — AI Analysis Testing

**Priority:** P0
**Component:** Testing
**Status:** TODO

Test:

* Valid analysis.
* Invalid AI response.
* Gemini unavailable.
* Missing resume.
* Missing job description.

---

## TICKET-052 — Frontend Testing

**Priority:** P1
**Component:** Testing
**Status:** TODO

Test:

* Login.
* Registration.
* Upload.
* Dashboard.
* Analysis.
* History.
* Protected routes.

---

# 13. Deployment Tickets

## TICKET-053 — Backend Deployment

**Priority:** P0
**Component:** DevOps
**Status:** TODO

Deploy Django backend.

### Requirements

* Production settings.
* Environment variables.
* PostgreSQL.
* HTTPS.
* Gunicorn.

---

## TICKET-054 — Frontend Deployment

**Priority:** P0
**Component:** DevOps
**Status:** TODO

Deploy React frontend.

---

## TICKET-055 — Production CORS

**Priority:** P0
**Component:** DevOps
**Status:** TODO

Configure production frontend domain in Django CORS settings.

---

## TICKET-056 — Production Environment Variables

**Priority:** P0
**Component:** DevOps
**Status:** TODO

Configure:

```text
SECRET_KEY
DATABASE_URL
GEMINI_API_KEY
ALLOWED_HOSTS
CORS_ALLOWED_ORIGINS
```

---

# 14. Recommended Development Order

Do not randomly pick tickets.

Use this order:

```text
PHASE 1 — Foundation
│
├── TICKET-001 Backend setup
├── TICKET-002 Frontend setup
└── TICKET-003 Git setup
        ↓
PHASE 2 — Authentication
│
├── TICKET-004 Registration
├── TICKET-005 Login API
├── TICKET-006 Login UI
├── TICKET-007 Registration UI
├── TICKET-008 Protected Routes
└── TICKET-009 Logout
        ↓
PHASE 3 — Resume
│
├── TICKET-010 Resume Model
├── TICKET-011 Upload API
├── TICKET-012 PDF extraction
├── TICKET-013 DOCX extraction
└── TICKET-014 Upload UI
        ↓
PHASE 4 — Job Description
│
├── TICKET-017 Job Model
├── TICKET-018 Job API
└── TICKET-019 Job UI
        ↓
PHASE 5 — AI
│
├── TICKET-021 Analysis Model
├── TICKET-022 Gemini Integration
├── TICKET-023 Prompt
├── TICKET-024 AI Response
└── TICKET-025 Analysis API
        ↓
PHASE 6 — Results
│
├── TICKET-026 Analyze Button
├── TICKET-027 Loading
├── TICKET-028 Score
├── TICKET-029 Matched Skills
├── TICKET-030 Missing Skills
├── TICKET-031 Keywords
└── TICKET-032 Recommendations
        ↓
PHASE 7 — History
│
├── TICKET-033 History API
├── TICKET-034 History UI
├── TICKET-035 Details API
└── TICKET-036 Details UI
        ↓
PHASE 8 — Security
│
├── TICKET-037 Authorization
├── TICKET-038 API Key
├── TICKET-039 CORS
├── TICKET-040 File Security
└── TICKET-041 Rate Limiting
        ↓
PHASE 9 — Testing
        ↓
PHASE 10 — Deployment
```

# 15. MVP Ticket Priority

If your goal is to build the project quickly for your **Python Full Stack Developer portfolio**, focus first on these:

```text
P0 — MUST HAVE

Authentication
Resume Upload
PDF/DOCX Extraction
Job Description
Gemini Integration
Resume Analysis
Score
Matched Skills
Missing Skills
Recommendations
Authorization
Basic Error Handling
Deployment
```

Then add:

```text
P1 — IMPORTANT

Analysis History
Better UI
Rate Limiting
Advanced validation
Testing
```

Then:

```text
P2 — NICE TO HAVE

Advanced analytics
Resume improvement
Cover letter generation
Job recommendations
Interview questions
```

# 16. Definition of a Completed Feature Ticket

A ticket should not be marked **DONE** simply because the code has been written.

A ticket is complete when:

```text
Requirement understood
        ↓
Code implemented
        ↓
Frontend/backend integrated
        ↓
Validation added
        ↓
Error handling added
        ↓
Security considered
        ↓
Tested
        ↓
Acceptance criteria passed
        ↓
DONE
```

This ticket list can now act as your **actual development backlog**. You can take one ticket at a time—for example, `TICKET-004 — User Registration`—implement it, test it, and then move to the next ticket.
