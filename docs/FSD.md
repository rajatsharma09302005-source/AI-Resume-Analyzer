# Frontend Specification Document (FSD)

## AI Resume Analyzer

**Version:** 1.0
**Status:** MVP
**Frontend:** React.js
**Language:** JavaScript
**Build Tool:** Vite
**HTTP Client:** Axios
**Routing:** React Router
**UI:** Bootstrap 5 / CSS
**Backend:** Django REST Framework

---

# 1. Purpose

This document defines the frontend requirements and implementation specifications for the AI Resume Analyzer.

The frontend will provide a responsive web interface through which users can:

* Register and log in.
* Upload resumes.
* Enter job descriptions.
* Start resume analysis.
* View AI-generated results.
* View matched and missing skills.
* View recommendations.
* View previous analyses.
* Manage their uploaded resumes.

---

# 2. Frontend Goals

The frontend should be:

### Simple

A first-time user should understand how to analyze a resume without training.

### Responsive

The application should work on:

* Desktop
* Tablet
* Mobile

### Fast

The UI should provide loading indicators during API and AI operations.

### Secure

Sensitive information such as the Gemini API key must never exist in the frontend.

### Maintainable

Components and API services should be separated logically.

---

# 3. Target Users

The primary frontend user is a job seeker.

Example:

```text
User
 ↓
Login
 ↓
Dashboard
 ↓
Upload Resume
 ↓
Enter Job Description
 ↓
Analyze
 ↓
View Score
 ↓
View Recommendations
```

---

# 4. Frontend Technology

| Technology   | Purpose              |
| ------------ | -------------------- |
| React.js     | UI                   |
| JavaScript   | Application logic    |
| Vite         | Build/development    |
| React Router | Routing              |
| Axios        | API communication    |
| Bootstrap 5  | UI components        |
| CSS          | Custom styling       |
| Context API  | Authentication state |

---

# 5. Application Routes

The application will have the following routes:

```text
/
├── /login
├── /register
├── /dashboard
├── /resume
├── /analysis/:id
└── /history
```

### Public Routes

```text
/login
/register
```

### Protected Routes

```text
/dashboard
/resume
/analysis/:id
/history
```

Unauthenticated users attempting to access protected routes should be redirected to `/login`.

---

# 6. Page Specifications

# 6.1 Login Page

### Route

```text
/login
```

### Purpose

Allows existing users to authenticate.

### UI

```text
┌─────────────────────────────┐
│      AI Resume Analyzer     │
│                             │
│ Email                       │
│ [_______________________]   │
│                             │
│ Password                    │
│ [_______________________]   │
│                             │
│        [ Login ]            │
│                             │
│ Don't have an account?      │
│ Register                    │
└─────────────────────────────┘
```

### Fields

* Email
* Password

### Validation

Email:

* Required.
* Valid email format.

Password:

* Required.

### API

```text
POST /api/auth/login/
```

### Success

Store authentication information and redirect to:

```text
/dashboard
```

### Failure

Display:

```text
Invalid email or password.
```

---

# 7. Register Page

### Route

```text
/register
```

### Fields

* Name
* Email
* Password
* Confirm Password

### Validation

Name:

* Required.

Email:

* Required.
* Valid email format.

Password:

* Required.
* Minimum length according to backend policy.

Confirm Password:

* Must match password.

### API

```text
POST /api/auth/register/
```

### Success

Redirect to:

```text
/login
```

---

# 8. Dashboard

### Route

```text
/dashboard
```

### Purpose

Main user workspace.

### UI

```text
┌──────────────────────────────────────────┐
│ AI Resume Analyzer        Dashboard      │
│                              Logout      │
├──────────────────────────────────────────┤
│                                          │
│ Analyze Your Resume                      │
│                                          │
│ Resume                                   │
│ [ Select Resume ▼ ]                      │
│                                          │
│ Job Description                          │
│ ┌──────────────────────────────────────┐ │
│ │ Paste job description here...        │ │
│ │                                      │ │
│ └──────────────────────────────────────┘ │
│                                          │
│          [ Analyze Resume ]              │
│                                          │
└──────────────────────────────────────────┘
```

---

# 9. Resume Upload Component

### Component

```text
ResumeUpload.jsx
```

### Requirements

The user should be able to:

* Select a file.
* See selected filename.
* Upload the file.
* Remove the selected file.
* See upload progress/state.

### Accepted formats

```text
PDF
DOCX
```

### Maximum size

```text
5 MB
```

### UI

```text
┌──────────────────────────────┐
│ Upload Your Resume           │
│                              │
│   Drag & Drop                │
│       OR                     │
│   [ Choose File ]            │
│                              │
│ PDF / DOCX — Max 5 MB        │
└──────────────────────────────┘
```

---

# 10. Resume Upload States

The component should support:

### Empty

```text
Choose your resume
```

### Selected

```text
Rajat_Resume.pdf
[Upload]
```

### Uploading

```text
Uploading...
████████████░░░░
```

### Success

```text
✓ Resume uploaded successfully
```

### Error

```text
Invalid file type.
```

---

# 11. Job Description Component

### Component

```text
JobDescriptionForm.jsx
```

### Input

Large textarea.

Example placeholder:

```text
Paste the job description here...
```

### Validation

* Required.
* Should not contain only whitespace.
* Reasonable maximum length should be enforced.

### Button

```text
[ Save Job Description ]
```

### API

```text
POST /api/jobs/
```

---

# 12. Analyze Button

The Analyze button should remain disabled until:

```text
Resume selected
        +
Job description available
```

Then:

```text
[ Analyze Resume ]
```

When clicked:

```text
[ Analyzing... ]
```

The user should not be able to accidentally submit multiple analysis requests simultaneously.

---

# 13. Analysis Loading State

AI analysis may take several seconds.

Display:

```text
┌─────────────────────────────┐
│                             │
│       Analyzing Resume      │
│                             │
│     ◌ Please wait...        │
│                             │
│ Comparing your resume with  │
│ the job requirements.       │
│                             │
└─────────────────────────────┘
```

The UI must not appear frozen.

---

# 14. Analysis Result Page

### Route

```text
/analysis/:id
```

### Purpose

Display complete analysis results.

---

# 15. Score Card

### Component

```text
ScoreCard.jsx
```

Display:

```text
Resume Match Score

        84 / 100
```

Optional visual representation:

```text
████████████████░░░░
        84%
```

The score should be received from the backend.

The frontend should not independently invent or modify the score.

---

# 16. Matched Skills

### Component

```text
MatchedSkills.jsx
```

Example:

```text
Matched Skills

✓ Python
✓ Django
✓ React
✓ REST API
✓ Git
```

Each skill can be displayed as a badge.

---

# 17. Missing Skills

### Component

```text
MissingSkills.jsx
```

Example:

```text
Skills to Improve

✗ Docker
✗ PostgreSQL
✗ AWS
```

These should be clearly distinguished from matched skills.

---

# 18. Keyword Analysis

### Component

```text
KeywordAnalysis.jsx
```

Example:

```text
Keyword Analysis

Matched Keywords: 14
Missing Keywords: 4

Match Rate: 78%
```

---

# 19. Recommendations

### Component

```text
Recommendations.jsx
```

Example:

```text
AI Recommendations

1. Add Docker experience if applicable.

2. Improve your project descriptions.

3. Add measurable achievements.

4. Mention REST API development in your summary.
```

Recommendations should come from the backend AI analysis.

---

# 20. Analysis Result API

Frontend requests:

```text
GET /api/analyses/{id}/
```

Example response:

```json
{
    "id": 15,
    "score": 84,
    "matched_skills": [
        "Python",
        "Django",
        "React"
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
        "Improve project descriptions",
        "Add measurable achievements"
    ]
}
```

---

# 21. Analysis History

### Route

```text
/history
```

### Purpose

Display previous resume analyses.

Example:

```text
┌───────────────────────────────────────────┐
│ Analysis History                          │
├───────────────────────────────────────────┤
│ Python Developer        84%    Aug 12     │
│ Django Developer        76%    Aug 10     │
│ Backend Developer       69%    Aug 08     │
└───────────────────────────────────────────┘
```

### API

```text
GET /api/analyses/
```

Clicking an analysis should navigate to:

```text
/analysis/:id
```

---

# 22. Navbar

### Component

```text
Navbar.jsx
```

For authenticated users:

```text
AI Resume Analyzer

Dashboard
History

                    Logout
```

For unauthenticated users:

```text
AI Resume Analyzer

Login
Register
```

---

# 23. Protected Routes

Create:

```text
ProtectedRoute.jsx
```

Behavior:

```text
User opens /dashboard
        ↓
Is authenticated?
    ┌───┴───┐
   Yes      No
    ↓        ↓
Dashboard   /login
```

---

# 24. Authentication State

Use React Context.

```text
AuthContext
│
├── user
├── accessToken
├── login()
├── logout()
├── register()
└── isAuthenticated
```

Components can access authentication state through the context.

---

# 25. API Service

Create:

```text
services/api.js
```

Responsibilities:

* Configure Axios.
* Set backend base URL.
* Attach access token.
* Handle common API errors.

Example architecture:

```text
React Component
      ↓
API Service
      ↓
Axios
      ↓
Django REST API
```

Components should not repeatedly define the API base URL.

---

# 26. API Endpoints Used by Frontend

## Authentication

```text
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/refresh/
```

## Resume

```text
GET    /api/resumes/
POST   /api/resumes/
GET    /api/resumes/{id}/
DELETE /api/resumes/{id}/
```

## Job

```text
GET    /api/jobs/
POST   /api/jobs/
GET    /api/jobs/{id}/
DELETE /api/jobs/{id}/
```

## Analysis

```text
GET    /api/analyses/
POST   /api/analyses/
GET    /api/analyses/{id}/
DELETE /api/analyses/{id}/
```

---

# 27. Frontend State Management

For MVP, React Context + local component state is sufficient.

### Global State

```text
Authentication
User
Access token
```

### Local State

```text
Resume selection
Job description
Loading states
Analysis result
Form errors
```

A dedicated state-management library is not required for the MVP.

---

# 28. Form Validation

Validation should happen on the frontend for good user experience.

Example:

```text
Email
 ↓
Required?
 ↓
Valid format?
 ↓
Submit
```

However, frontend validation is not a security mechanism.

The backend must validate everything again.

---

# 29. Error States

Every major API operation should have an error state.

### Login Error

```text
Invalid email or password.
```

### Upload Error

```text
Please upload a valid PDF or DOCX file.
```

### Analysis Error

```text
Unable to analyze your resume.
Please try again.
```

### Network Error

```text
Unable to connect to the server.
Please check your internet connection.
```

---

# 30. Empty States

### No Resumes

```text
You haven't uploaded a resume yet.

[ Upload Resume ]
```

### No Analysis History

```text
No analyses found.

Upload your resume and analyze it
against a job description.
```

### No Missing Skills

```text
Great!

No major missing skills were identified.
```

---

# 31. Responsive Design

The application must support:

### Desktop

```text
≥ 1024px
```

### Tablet

```text
768px – 1023px
```

### Mobile

```text
< 768px
```

On mobile:

* Navbar should collapse.
* Cards should become single-column.
* Textareas should use full width.
* Buttons should remain easy to tap.
* Score should remain clearly visible.

---

# 32. UI Component Structure

Recommended component hierarchy:

```text
App
│
├── Navbar
│
├── Routes
│   │
│   ├── Login
│   ├── Register
│   │
│   └── ProtectedRoute
│       │
│       ├── Dashboard
│       │   ├── ResumeUpload
│       │   └── JobDescriptionForm
│       │
│       ├── Analysis
│       │   ├── ScoreCard
│       │   ├── MatchedSkills
│       │   ├── MissingSkills
│       │   ├── KeywordAnalysis
│       │   └── Recommendations
│       │
│       └── History
```

---

# 33. Frontend Folder Structure

```text
src/
│
├── components/
│   ├── Navbar.jsx
│   ├── ResumeUpload.jsx
│   ├── JobDescriptionForm.jsx
│   ├── ScoreCard.jsx
│   ├── MatchedSkills.jsx
│   ├── MissingSkills.jsx
│   ├── KeywordAnalysis.jsx
│   └── Recommendations.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Analysis.jsx
│   └── History.jsx
│
├── services/
│   └── api.js
│
├── context/
│   └── AuthContext.jsx
│
├── routes/
│   └── ProtectedRoute.jsx
│
├── utils/
│   └── validation.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# 34. User Journey

Complete frontend journey:

```text
                 Landing/Login
                       ↓
                    Login
                       ↓
                  Dashboard
                       ↓
                Upload Resume
                       ↓
             Enter Job Description
                       ↓
                Analyze Resume
                       ↓
                  Loading UI
                       ↓
                Analysis Result
                       ↓
       ┌───────────────┼───────────────┐
       ↓               ↓               ↓
   Score Card      Skills          Recommendations
                       │
                       ↓
                    History
```

---

# 35. Accessibility

The frontend should follow basic accessibility practices:

* Use labels for form fields.
* Provide meaningful button text.
* Ensure keyboard navigation.
* Provide visible focus states.
* Use appropriate heading hierarchy.
* Provide alternative text for meaningful images.
* Do not rely only on color to communicate information.
* Display readable error messages.

---

# 36. Performance Requirements

The frontend should:

* Avoid unnecessary API calls.
* Display loading indicators.
* Lazy-load non-critical pages when useful.
* Avoid rendering unnecessarily large datasets.
* Compress/optimize static assets.
* Avoid sending resume files directly to Gemini.

The frontend should send files only to the Django backend.

---

# 37. Security Requirements

The frontend must:

* Never contain the Gemini API key.
* Never contain database credentials.
* Use HTTPS in production.
* Use protected routes.
* Avoid rendering untrusted HTML.
* Handle expired authentication tokens.
* Clear authentication state on logout.

---

# 38. Token Expiration Flow

```text
API Request
     ↓
JWT valid?
  ┌──┴──┐
 Yes    No
  ↓      ↓
Success  Refresh Token
          ↓
       Success?
       ┌──┴──┐
      Yes    No
       ↓      ↓
 New Token  Logout
```

If token refresh fails, redirect the user to login.

---

# 39. Frontend Testing

### Login

* Valid credentials.
* Invalid credentials.
* Empty fields.

### Registration

* Valid registration.
* Duplicate email.
* Password mismatch.

### Resume Upload

* PDF.
* DOCX.
* Invalid file.
* File too large.
* Upload failure.

### Analysis

* Resume + job description.
* Missing resume.
* Missing job description.
* Loading state.
* API failure.
* Successful analysis.

### Routing

* Protected route without login.
* Valid authenticated route.
* Logout behavior.

---

# 40. Frontend Definition of Done

The frontend is complete when:

* [ ] Login page implemented.
* [ ] Registration page implemented.
* [ ] JWT authentication integrated.
* [ ] Protected routes implemented.
* [ ] Dashboard implemented.
* [ ] Resume upload implemented.
* [ ] PDF/DOCX validation implemented.
* [ ] Job description form implemented.
* [ ] Analysis API integrated.
* [ ] Loading states implemented.
* [ ] Error states implemented.
* [ ] Score displayed.
* [ ] Matched skills displayed.
* [ ] Missing skills displayed.
* [ ] Recommendations displayed.
* [ ] Analysis history implemented.
* [ ] Logout implemented.
* [ ] Responsive design implemented.
* [ ] Basic accessibility implemented.
* [ ] Frontend deployed.

---

# 41. Frontend-to-Backend Architecture

```text
┌──────────────────────────────────────────────┐
│                 React Frontend               │
│                                              │
│ Login → Dashboard → Upload → Analysis        │
│                                              │
└─────────────────────┬────────────────────────┘
                      │
                    Axios
                      │
                HTTPS + JWT
                      │
                      ↓
┌──────────────────────────────────────────────┐
│              Django REST API                │
│                                              │
│ Auth | Resume | Jobs | Analysis              │
└─────────────────────┬────────────────────────┘
                      │
             ┌────────┴────────┐
             ↓                 ↓
       PostgreSQL          Gemini API
```

# 42. Final Frontend Specification

The frontend should provide a simple workflow:

```text
1. Login
      ↓
2. Dashboard
      ↓
3. Upload Resume
      ↓
4. Enter Job Description
      ↓
5. Click Analyze
      ↓
6. Show Loading
      ↓
7. Display Score
      ↓
8. Display Matched Skills
      ↓
9. Display Missing Skills
      ↓
10. Display Recommendations
      ↓
11. Save/View Analysis History
```

The frontend should remain responsible for **presentation, user interaction, client-side validation, and API communication**.

Business rules, authentication enforcement, authorization, AI API keys, score validation, file processing, and database operations remain on the **Django backend**.
