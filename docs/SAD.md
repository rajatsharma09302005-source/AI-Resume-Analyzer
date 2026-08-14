# Security and Access Document (SAD)

## AI Resume Analyzer

**Version:** 1.0
**Status:** MVP
**Application:** AI Resume Analyzer
**Backend:** Django + Django REST Framework
**Frontend:** React.js
**Database:** PostgreSQL
**Authentication:** JWT
**AI Provider:** Google Gemini API

---

# 1. Purpose

This document defines the security and access-control requirements for the AI Resume Analyzer.

The primary security objectives are:

* Protect user accounts.
* Protect uploaded resumes.
* Prevent unauthorized access to user data.
* Secure API endpoints.
* Protect AI API credentials.
* Secure sensitive database information.
* Validate uploaded files.
* Prevent common web security attacks.
* Maintain privacy of resume and job-description data.

---

# 2. Security Principles

The application follows these principles:

### Authentication

Verify who the user is.

### Authorization

Verify what the authenticated user is allowed to access.

### Least Privilege

Users should receive only the permissions they need.

### Data Protection

Sensitive user data should be protected during storage and transmission.

### Defense in Depth

Security should exist at multiple layers rather than relying on a single mechanism.

### Secure by Default

Resources should be inaccessible unless access is explicitly granted.

---

# 3. User Roles

For the MVP, the system has two roles:

```text
USER
ADMIN
```

## User

A normal user can:

* Register.
* Login.
* Upload resumes.
* View their own resumes.
* Delete their own resumes.
* Create job descriptions.
* Analyze their resumes.
* View their own analysis results.
* Delete their own analysis history.

## Admin

An administrator can:

* Manage users.
* View system-level information.
* Manage application data when required.
* Monitor application activity.
* Handle administrative issues.

The admin should not automatically receive access to private resume content unless the business/security policy explicitly allows it.

---

# 4. Authentication

The application uses **JWT authentication**.

Authentication flow:

```text
User
 ↓
Login
 ↓
Django
 ↓
Verify email + password
 ↓
Generate JWT
 ↓
React
 ↓
Access protected APIs
```

The client sends:

```text
Authorization: Bearer <access_token>
```

---

# 5. Registration Security

During registration:

1. Validate the email.
2. Validate password requirements.
3. Check whether the email already exists.
4. Hash the password using Django's password hashing system.
5. Never store plain-text passwords.

Example:

```text
User enters:
password123

Database stores:
hashed password
```

The original password must never be stored in the database.

---

# 6. Password Requirements

The application should enforce a reasonable password policy.

Example:

* Minimum 8 characters.
* Should not be an extremely common password.
* Password should not contain obvious personal information.

Django's built-in password validation should be used rather than implementing password hashing manually.

---

# 7. JWT Security

The application uses:

### Access Token

Short-lived token used to access protected APIs.

### Refresh Token

Used to obtain a new access token after the access token expires.

Conceptually:

```text
Login
 ↓
Access Token + Refresh Token
 ↓
Access Token expires
 ↓
Refresh Token
 ↓
New Access Token
```

Access tokens should have a relatively short lifetime.

---

# 8. Authorization

Authentication alone is not sufficient.

After identifying the user, the backend must verify resource ownership.

Example:

```text
User A
 ├── Resume A
 ├── Job A
 └── Analysis A

User B
 ├── Resume B
 ├── Job B
 └── Analysis B
```

User A must not be able to access:

```text
Resume B
Job B
Analysis B
```

even if User A knows the resource ID.

---

# 9. Object-Level Access Control

Every user-specific API must perform an ownership check.

Example:

```text
GET /api/resumes/15/
```

Backend logic:

```text
1. Authenticate user.
2. Find Resume 15.
3. Check resume.user == request.user.
4. If yes → allow.
5. If no → return 403/404.
```

This protects against **Insecure Direct Object Reference (IDOR)** vulnerabilities.

---

# 10. Access Control Matrix

| Resource            | User               | Admin               |
| ------------------- | ------------------ | ------------------- |
| Own Profile         | Read/Update        | Manage              |
| Own Resume          | Create/Read/Delete | Controlled access   |
| Other User Resume   | ❌                  | According to policy |
| Own Job Description | Create/Read/Delete | Manage              |
| Other User Job      | ❌                  | According to policy |
| Own Analysis        | Read/Create/Delete | Manage              |
| Other User Analysis | ❌                  | According to policy |
| System Settings     | ❌                  | Manage              |

The default should be **deny access unless explicitly permitted**.

---

# 11. API Security

Protected endpoints:

```text
/api/resumes/
/api/jobs/
/api/analyses/
```

must require authentication.

Public endpoints can include:

```text
/api/auth/register/
/api/auth/login/
/api/auth/refresh/
```

Protected endpoint example:

```text
POST /api/analyses/
Authorization: Bearer <token>
```

Requests without valid authentication should be rejected.

---

# 12. API Permission Design

Django REST Framework permissions should be used.

Conceptually:

```text
IsAuthenticated
        +
Object Ownership
        ↓
Access Granted
```

For example:

```text
class IsOwner:
    user must own the object
```

Avoid relying only on frontend restrictions.

The backend must always enforce permissions.

---

# 13. Frontend Access Control

React should hide protected pages from unauthenticated users.

Example:

```text
User not logged in
        ↓
Dashboard requested
        ↓
ProtectedRoute
        ↓
Redirect → Login
```

However, frontend protection is **not the actual security boundary**.

A user can bypass frontend code and directly call an API.

Therefore:

```text
Frontend protection
       +
Backend authorization
       ↓
Secure application
```

---

# 14. Resume File Security

Resume files are user-provided files and must be treated as untrusted input.

The backend should validate:

### File type

Allow:

```text
.pdf
.docx
```

Reject unexpected formats.

### File size

Example:

```text
Maximum file size = 5 MB
```

### File content

The application should verify that the uploaded file is actually a valid document rather than trusting only the filename extension.

---

# 15. Malicious File Protection

The application should not execute uploaded files.

Uploaded files should be:

* Stored safely.
* Processed using trusted libraries.
* Given controlled filenames/paths.
* Served with appropriate content types.
* Kept separate from executable application code.

If the application grows to production scale, malware scanning can also be introduced.

---

# 16. Resume Privacy

Resumes can contain sensitive personal information such as:

* Name
* Email
* Phone number
* Address
* Employment history
* Education
* Skills

Therefore:

> A resume must be accessible only to its owner unless explicitly authorized.

The application should avoid unnecessarily logging complete resume contents.

---

# 17. AI Data Security

Resume information is sent to the external AI provider for analysis.

The application should:

1. Send only the information necessary for analysis.
2. Avoid sending unnecessary user/account information.
3. Never send passwords or authentication tokens to the AI.
4. Never expose the Gemini API key to the frontend.
5. Handle AI responses securely.
6. Clearly define the application's data-retention policy.

Architecture:

```text
React
  ↓
Django
  ↓
Prepare required resume/job data
  ↓
Gemini API
  ↓
Analysis
  ↓
Django
  ↓
Database
```

---

# 18. Gemini API Key Security

The Gemini API key must remain on the backend.

Correct:

```text
React
  ↓
Django
  ↓
Gemini
```

Incorrect:

```text
React
  ↓
Gemini API
```

The key should be stored in an environment variable:

```text
GEMINI_API_KEY=********
```

Never hard-code it in source code.

Never commit it to GitHub.

---

# 19. Environment Variable Security

Sensitive configuration should be stored in environment variables.

Example:

```text
SECRET_KEY=
DATABASE_URL=
GEMINI_API_KEY=
DEBUG=
ALLOWED_HOSTS=
```

The `.env` file should be included in:

```text
.gitignore
```

and should never be committed to the repository.

---

# 20. Database Security

PostgreSQL access should be protected using:

* Strong database credentials.
* Restricted database access.
* Encrypted connections in production.
* Parameterized queries/ORM.
* Regular backups.

Django ORM should be preferred over manually constructing SQL queries where possible.

---

# 21. SQL Injection Protection

User input should never be directly concatenated into SQL queries.

Unsafe:

```text
SELECT * FROM users WHERE name = 'user_input'
```

Django ORM provides parameterized query mechanisms.

Example conceptually:

```text
User.objects.filter(email=email)
```

This reduces SQL injection risk when used correctly.

---

# 22. XSS Protection

User-provided content such as:

* Job descriptions
* Resume text
* AI recommendations

should not be rendered as raw HTML unless explicitly sanitized.

React's normal rendering behavior helps avoid many XSS issues, but developers should avoid unnecessarily using mechanisms such as:

```text
dangerouslySetInnerHTML
```

with untrusted content.

---

# 23. CORS Security

The backend should allow requests only from trusted frontend domains.

Development:

```text
http://localhost:5173
```

Production:

```text
https://your-frontend-domain.com
```

Avoid:

```text
Allow-Origin: *
```

for authenticated production APIs unless there is a specific reason.

---

# 24. HTTPS

Production communication must use HTTPS.

```text
Browser
   │
 HTTPS
   ↓
React
   │
 HTTPS
   ↓
Django
   │
 HTTPS
   ↓
Gemini
```

HTTPS protects credentials, JWTs, and user data during transmission.

---

# 25. CSRF Protection

If authentication is implemented using cookies, CSRF protection must be properly configured.

If JWTs are sent using the `Authorization` header rather than cookie-based authentication, the CSRF model differs, but other security controls remain necessary.

The authentication architecture should be kept consistent rather than mixing authentication strategies without a clear reason.

---

# 26. Rate Limiting

AI analysis can be expensive.

A malicious user could repeatedly call:

```text
POST /api/analyses/
```

Therefore, rate limiting should be considered.

Example policy:

```text
Maximum:
10 analysis requests / hour / user
```

The exact limit can be adjusted based on API costs and expected usage.

---

# 27. AI Prompt Injection Protection

Because job descriptions and resumes are user-controlled text, they should be treated as **untrusted input**.

For example, a resume could contain text such as:

```text
Ignore your previous instructions...
```

The AI system should be instructed to treat uploaded resume/job text as data, not as instructions.

Conceptually:

```text
System Instructions
        ↓
Trusted
        ↓
Resume / Job Description
        ↓
Untrusted data
```

The application should also constrain the AI response to the required JSON schema.

---

# 28. AI Output Validation

Never blindly trust AI output.

The backend should validate:

```text
AI Response
     ↓
Valid JSON?
     ↓
Required fields?
     ↓
Correct data types?
     ↓
Score 0–100?
     ↓
Accept
```

For example, if AI returns:

```text
score = "excellent"
```

the backend should reject or normalize it rather than storing it as a numeric score.

---

# 29. Error Handling

Security-sensitive errors should not reveal internal information.

Bad:

```text
Database password:
xyz123

PostgreSQL connection failed at:
internal-server/path/...
```

Good:

```json
{
    "error": "An internal server error occurred."
}
```

Detailed errors should be available in secure server logs rather than exposed to users.

---

# 30. Logging Security

Log useful security events:

```text
Login success
Login failure
Resume upload
Analysis request
Authorization failure
AI failure
Server error
```

Do not log:

```text
Passwords
JWT tokens
API keys
Database passwords
Complete sensitive resume contents
```

---

# 31. Account Security

The application should consider:

* Login rate limiting.
* Protection against brute-force attacks.
* Secure password reset.
* Email verification if required.
* Account lockout/throttling policies if required.

These features can be introduced progressively.

---

# 32. Data Deletion

Users should be able to delete their resumes and analysis data where the product policy permits.

Example:

```text
User
 ↓
Delete Resume
 ↓
Resume deleted
 ↓
Associated analysis handling
```

The application must define whether associated analyses are:

* Deleted automatically.
* Retained without the file.
* Soft-deleted.

For the MVP, deleting associated analysis records can be the simplest approach.

---

# 33. Data Retention

The application should define how long uploaded resumes and analysis results are retained.

Example policy:

```text
Active account:
Keep user's data.

User deletes resume:
Delete associated resume data.

User deletes account:
Delete/anonymize associated personal data
according to the application's retention policy.
```

The exact retention period should be decided based on the product's legal and business requirements.

---

# 34. Backup Security

Production database backups should:

* Be encrypted.
* Have restricted access.
* Be stored separately from the primary database.
* Be periodically tested for restoration.

Backups should receive the same security considerations as production data.

---

# 35. Dependency Security

The project depends on packages such as:

```text
Django
Django REST Framework
PyMuPDF
python-docx
Google AI SDK
```

Dependencies should be:

* Kept reasonably up to date.
* Audited for known vulnerabilities.
* Pinned/controlled where appropriate.

Example:

```text
requirements.txt
```

should specify controlled package versions for reproducible deployments.

---

# 36. Security Testing

The following tests should be performed.

### Authentication

* Invalid login.
* Expired JWT.
* Missing JWT.
* Invalid JWT.

### Authorization

* User accessing own resume → allowed.
* User accessing another user's resume → denied.
* User accessing another user's analysis → denied.

### File Security

* Valid PDF → allowed.
* Valid DOCX → allowed.
* Unsupported extension → rejected.
* Oversized file → rejected.
* Invalid/corrupt file → rejected.

### API Security

* Missing authentication → rejected.
* Invalid request → rejected.
* Unauthorized object access → rejected.

### AI Security

* Gemini API key not exposed to frontend.
* Malicious prompt content handled as data.
* Invalid AI response rejected.

---

# 37. Security Checklist

Before production deployment:

* [ ] JWT authentication implemented.
* [ ] Password hashing enabled.
* [ ] Protected APIs require authentication.
* [ ] Object-level authorization implemented.
* [ ] Users cannot access other users' resumes.
* [ ] Users cannot access other users' analyses.
* [ ] File type validation implemented.
* [ ] File size validation implemented.
* [ ] Uploaded files treated as untrusted.
* [ ] Gemini API key stored in environment variables.
* [ ] `.env` excluded from Git.
* [ ] HTTPS enabled.
* [ ] CORS restricted.
* [ ] Production `DEBUG=False`.
* [ ] Strong Django `SECRET_KEY`.
* [ ] Database credentials protected.
* [ ] Rate limiting considered.
* [ ] AI output validation implemented.
* [ ] Sensitive information excluded from logs.
* [ ] Database backups secured.
* [ ] Dependencies reviewed for vulnerabilities.

---

# 38. Security Access Flow

The overall security flow is:

```text
                    USER
                      │
                      ↓
                React Frontend
                      │
                      ↓
                JWT Authentication
                      │
              ┌───────┴────────┐
              │                │
          Authenticated?    No
              │                │
             Yes               ↓
              │              Reject
              ↓
       Authorization Check
              │
       ┌──────┴──────┐
       │             │
     Owner        Not Owner
       │             │
       ↓             ↓
    Allow          Reject
       │
       ↓
   Business Logic
       │
       ↓
 ┌─────┴───────────┐
 ↓                 ↓
Database        Gemini API
```

---

# 39. Security Responsibilities

| Component    | Security Responsibility            |
| ------------ | ---------------------------------- |
| React        | UI access control, safe rendering  |
| Django API   | Authentication and authorization   |
| DRF          | Request validation and permissions |
| PostgreSQL   | Data storage security              |
| File Storage | Resume protection                  |
| Gemini API   | AI processing                      |
| Environment  | Secret management                  |
| Deployment   | HTTPS and infrastructure security  |

---

# 40. Final Security Architecture

```text
                         USER
                           │
                         HTTPS
                           ↓
                    ┌─────────────┐
                    │   React     │
                    └──────┬──────┘
                           │
                         HTTPS
                           ↓
               ┌──────────────────────┐
               │ Django REST API      │
               │                      │
               │ JWT Authentication   │
               │ Authorization        │
               │ Validation           │
               │ Rate Limiting        │
               └──────┬─────────┬─────┘
                      │         │
                Secure│         │Secure
                      ↓         ↓
               ┌──────────┐  ┌─────────────┐
               │PostgreSQL│  │ Gemini API  │
               └──────────┘  └─────────────┘
                      │
                      ↓
                User's Data
                - Resume
                - Jobs
                - Analysis
```

# 41. Security Definition of Done

The security implementation is considered complete for the MVP when:

1. Users can securely register and log in.
2. Passwords are never stored in plain text.
3. JWT authentication protects private APIs.
4. Object-level authorization prevents cross-user access.
5. Resume files are validated before processing.
6. Gemini credentials remain exclusively on the backend.
7. Sensitive environment variables are not committed to Git.
8. Production communication uses HTTPS.
9. CORS is restricted appropriately.
10. AI responses are validated before storage.
11. Sensitive information is not unnecessarily logged.
12. Rate limiting is implemented or planned for AI endpoints.
13. Security tests cover authentication and authorization.
14. Database and backup access is restricted.

# 42. Relationship With PRD and TAD

For your AI Resume Analyzer, the three documents now connect like this:

```text
                         PRD
                          │
                 WHAT + WHY
                          │
                          ↓
                         TAD
                          │
                   TECHNICAL HOW
                          │
                          ↓
                         SAD
                          │
              SECURITY + ACCESS HOW
                          │
                          ↓
                     DEVELOPMENT
                          │
                          ↓
                      TESTING
                          │
                          ↓
                     DEPLOYMENT
```

### Example

**PRD:**

> User should be able to upload a resume.

**TAD:**

> React sends the resume as `multipart/form-data` to Django. Django validates it, extracts text using PyMuPDF/python-docx, and stores the resume.

**SAD:**

> Only authenticated users can upload resumes, file types and sizes are validated, uploaded files are treated as untrusted, and users can access only their own resumes.

That is the key difference between the three documents.
