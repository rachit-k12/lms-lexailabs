# LexAI LMS API Documentation

> **Base URL:** `http://localhost:4000` (dev) | Configured via `FRONTEND_URL` env var
> **API Reference (Scalar):** Available at `/docs` when the server is running
> **Authentication:** JWT-based with httpOnly cookies (`access_token` + `refresh_token`)

---

## Table of Contents

1. [Authentication Model](#authentication-model)
2. [Role-Based Access Control](#role-based-access-control)
3. [Response Wrapper](#response-wrapper)
4. [Rate Limiting](#rate-limiting)
5. [Health Check](#health-check)
6. [Auth Endpoints](#auth-endpoints)
   - [POST /auth/register](#post-authregister)
   - [POST /auth/login](#post-authlogin)
   - [POST /auth/refresh](#post-authrefresh)
   - [POST /auth/logout](#post-authlogout)
   - [POST /auth/logout-all](#post-authlogout-all)
   - [POST /auth/forgot-password](#post-authforgot-password)
   - [POST /auth/reset-password](#post-authreset-password)
   - [GET /auth/verify-email](#get-authverify-email)
   - [GET /auth/me](#get-authme)
   - [GET /auth/google/login](#get-authgooglelogin)
   - [GET /auth/google/callback](#get-authgooglecallback)
   - [POST /auth/verify-institution](#post-authverify-institution)
   - [GET /auth/institution-status](#get-authinstitution-status)
7. [Course Endpoints (Public)](#course-endpoints-public)
   - [GET /courses](#get-courses)
   - [GET /courses/featured](#get-coursesfeatured)
   - [GET /courses/:slug](#get-coursesslug)
   - [GET /courses/my/enrolled](#get-coursesmyenrolled)
8. [Lesson Endpoints](#lesson-endpoints)
   - [GET /courses/:slug/lessons/:lessonId](#get-coursessluglessonslessonid)
   - [POST /courses/:slug/lessons/:lessonId/progress](#post-coursessluglessonslessonidprogress)
   - [GET /courses/:slug/progress](#get-coursesslugprogress)
9. [User Endpoints](#user-endpoints)
   - [GET /user/enrollments](#get-userenrollments)
   - [GET /user/enrollments/:courseId](#get-userenrollmentscourseid)
   - [POST /user/enrollments/:courseId](#post-userenrollmentscourseid)
   - [PUT /user/lessons/:lessonId/progress](#put-userlessonslessonidprogress)
   - [POST /user/lessons/:lessonId/complete](#post-userlessonslessonidcomplete)
10. [Admin Course CRUD](#admin-course-crud)
    - [POST /admin/courses](#post-admincourses)
    - [PATCH /admin/courses/:courseId](#patch-admincoursescourseid)
    - [DELETE /admin/courses/:courseId](#delete-admincoursescourseid)
11. [Admin Module CRUD](#admin-module-crud)
    - [POST /admin/courses/:courseId/modules](#post-admincoursescourseidmodules)
    - [PATCH /admin/courses/:courseId/modules/:moduleId](#patch-admincoursescourseidmodulesmoduleid)
    - [DELETE /admin/courses/:courseId/modules/:moduleId](#delete-admincoursescourseidmodulesmoduleid)
    - [PATCH /admin/courses/:courseId/modules/reorder](#patch-admincoursescourseidmodulesreorder)
12. [Admin Lesson CRUD](#admin-lesson-crud)
    - [POST /admin/courses/:courseId/modules/:moduleId/lessons](#post-admincoursescourseidmodulesmoduleidlessons)
    - [PATCH /admin/courses/:courseId/modules/:moduleId/lessons/:lessonId](#patch-admincoursescourseidmodulesmoduleidlessonslessonid)
    - [DELETE /admin/courses/:courseId/modules/:moduleId/lessons/:lessonId](#delete-admincoursescourseidmodulesmoduleidlessonslessonid)
    - [PATCH /admin/courses/:courseId/modules/:moduleId/lessons/reorder](#patch-admincoursescourseidmodulesmoduleidlessonsreorder)
13. [Admin Organization Management](#admin-organization-management)
    - [GET /admin/organizations](#get-adminorganizations)
    - [GET /admin/organizations/:id](#get-adminorganizationsid)
    - [POST /admin/organizations](#post-adminorganizations)
    - [PATCH /admin/organizations/:id](#patch-adminorganizationsid)
    - [POST /admin/organizations/:orgId/admins](#post-adminorganizationsorgidadmins)
14. [Admin User Management](#admin-user-management)
    - [GET /admin/users](#get-adminusers)
    - [PATCH /admin/users/:id](#patch-adminusersid)
15. [Institution Student Management](#institution-student-management)
    - [GET /institutions/:orgId/students](#get-institutionsorgidstudents)
    - [DELETE /institutions/:orgId/students/:recordId](#delete-institutionsorgidstudentsrecordid)
    - [POST /institutions/:orgId/students/upload](#post-institutionsorgidstudentsupload)
16. [Institution Course Access](#institution-course-access)
    - [GET /institutions/:orgId/courses](#get-institutionsorgidcourses)
    - [POST /institutions/:orgId/courses](#post-institutionsorgidcourses)
    - [DELETE /institutions/:orgId/courses/:courseId](#delete-institutionsorgidcoursescourseid)

---

## Authentication Model

The API uses **JWT-based authentication** with **httpOnly cookies**:

| Cookie | Purpose | Lifetime | Path |
|--------|---------|----------|------|
| `access_token` | JWT containing user identity + role + memberships | 15 minutes | `/` |
| `refresh_token` | Opaque token for obtaining new access tokens | 7 days | `/auth/refresh` |

**Token flow:**
1. Client calls `POST /auth/login` with email + password
2. Server sets both cookies via `Set-Cookie` headers
3. Client includes cookies automatically on subsequent requests (browser handles this)
4. When `access_token` expires, client calls `POST /auth/refresh` to get new tokens
5. Refresh tokens use **rotation** — each use invalidates the old token and issues a new one
6. **Reuse detection:** If a revoked refresh token is used again, ALL user tokens are revoked (security measure)

**JWT payload structure:**
```json
{
  "userId": "cuid_string",
  "email": "user@example.com",
  "role": "STUDENT",
  "memberships": [
    {
      "organizationId": "cuid_string",
      "organizationName": "Acme University",
      "role": "STUDENT",
      "isVerified": true,
      "batchId": "cuid_string | null"
    }
  ]
}
```

---

## Role-Based Access Control

### Application Roles (User.role)

| Role | Access Level |
|------|-------------|
| `PLATFORM_ADMIN` | Full access to all admin endpoints, all org management, all user management |
| `INSTITUTION_ADMIN` | Can manage their own organization's students, CSV uploads, course access |
| `INSTRUCTOR` | Currently same access as STUDENT (reserved for future use) |
| `STUDENT` | Default role. Can browse courses, access enrolled content, track progress |

### Organization Member Roles (OrganizationMember.role)

| Role | Scope |
|------|-------|
| `ADMIN` | Can manage students, upload CSVs, assign course access within their org |
| `STUDENT` | Gets course access through institutional subscription |

### Content Access Model

Two subscription models coexist:

- **B2C (Individual):** User purchases a subscription -> gets `CourseEnrollment` with `accessSource: INDIVIDUAL` for all published courses
- **B2B (Institutional):** User verifies with institution -> gets `CourseEnrollment` with `accessSource: INSTITUTION` for all published courses. Alternatively, any verified org member gets access to ALL courses.

**Free lessons** (`isFree: true`) are accessible to everyone, including unauthenticated users.

---

## Response Wrapper

**Routes prefixed with `/courses` and `/user`** have their responses automatically wrapped:

**Success responses (2xx):**
```json
{
  "success": true,
  "data": {
    // ... original response body
  }
}
```

**Error responses (4xx, 5xx):**
```json
{
  "success": false,
  "error": {
    "code": "Error message string",
    "message": "Error message string",
    "statusCode": 404
  }
}
```

**Routes NOT wrapped** (return raw responses):
- `/auth/*` — all authentication routes
- `/admin/*` — all admin routes
- `/institutions/*` — all institution management routes
- `/health` — health check

> **Frontend note:** When consuming `/courses` or `/user` endpoints, always access data via `response.data.data` (axios) or `body.data` (fetch). For example, the course list is at `response.data.courses` inside the `data` wrapper, so the full path is `response.data.data.courses`.

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /auth/login` | 10 requests | 1 minute |
| `POST /auth/register` | 5 requests | 1 minute |
| `POST /auth/forgot-password` | 3 requests | 1 minute |
| All other endpoints (global) | 100 requests | 1 minute |

When rate limited, the API returns:
```json
HTTP 429 Too Many Requests
Retry-After: <seconds>

{ "error": "Rate limit exceeded" }
```

---

## Health Check

### `GET /health`

Simple health check. No authentication required.

**Response:** `200 OK`
```json
{ "status": "ok" }
```

---

## Auth Endpoints

### `POST /auth/register`

Create a new user account. Sends a verification email.

**Auth:** None
**Rate limit:** 5/minute

**Request body:**
```json
{
  "name": "string (required, 1-100 chars)",
  "email": "string (required, valid email, max 255 chars)",
  "password": "string (required, 8-128 chars)"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `201` | User created. Verification email sent. |
| `400` | Validation failed (short password, invalid email, empty name) |
| `409` | Email already registered |

**201 Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account."
}
```

---

### `POST /auth/login`

Authenticate with email and password. Sets httpOnly cookies.

**Auth:** None
**Rate limit:** 10/minute

**Request body:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required)"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Login successful. `Set-Cookie` headers with `access_token` + `refresh_token`. |
| `401` | Invalid credentials (wrong password, nonexistent user, OAuth-only account) |
| `403` | Email not verified OR account deactivated |

**200 Response:**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "STUDENT",
    "image": "string | null"
  },
  "memberships": [ /* MembershipInfo[] */ ]
}
```

**401 Response:** `{ "error": "Invalid email or password" }`
**403 (unverified):** `{ "error": "Please verify your email before logging in" }`
**403 (deactivated):** `{ "error": "Account is deactivated. Please contact support." }`

> **Security note:** Login returns the same `401` message for both wrong password and nonexistent email, preventing user enumeration.

---

### `POST /auth/refresh`

Exchange a valid refresh token for new access + refresh tokens (token rotation).

**Auth:** Requires `refresh_token` cookie
**Rate limit:** Global

**Request body:** None (uses cookie)

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | New tokens issued. Old refresh token revoked. New cookies set. |
| `401` | No cookie, invalid token, expired token, or revoked token |

**200 Response:**
```json
{
  "success": true
}
```

> **Security note:** If a revoked refresh token is reused (token theft detection), ALL refresh tokens for that user are revoked, forcing re-authentication on all devices.

---

### `POST /auth/logout`

Revoke the current refresh token and clear auth cookies.

**Auth:** Required (`access_token` cookie)

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Refresh token revoked. Cookies cleared. |
| `401` | Not authenticated |

**200 Response:**
```json
{ "success": true }
```

> **Note:** The `access_token` JWT remains valid until its 15-minute expiry (stateless JWT — cannot be revoked server-side). Only the refresh token is revoked.

---

### `POST /auth/logout-all`

Revoke ALL refresh tokens for the current user (logout from all devices).

**Auth:** Required (`access_token` cookie)

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | All refresh tokens revoked for this user. |
| `401` | Not authenticated |

**200 Response:**
```json
{ "success": true }
```

---

### `POST /auth/forgot-password`

Request a password reset email. Always returns success (prevents email enumeration).

**Auth:** None
**Rate limit:** 3/minute

**Request body:**
```json
{
  "email": "string (required, valid email)"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Always returns success, regardless of whether the email exists. |

**200 Response:**
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

---

### `POST /auth/reset-password`

Reset password using a token received via email.

**Auth:** None

**Request body:**
```json
{
  "token": "string (required, the raw token from the email link)",
  "password": "string (required, 8-128 chars)"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Password changed. All refresh tokens revoked (forced re-login on all devices). |
| `400` | Invalid token, expired token, or already-used token |

**200 Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully. Please sign in with your new password."
}
```

---

### `GET /auth/verify-email`

Verify a user's email address via a link. Redirects to the frontend.

**Auth:** None

**Query params:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | Yes | The raw verification token from the email link |

**Responses:**

| Status | Redirect Location |
|--------|------------------|
| `302` | `{FRONTEND_URL}/sign-in?verified=true` — Email verified successfully |
| `302` | `{FRONTEND_URL}/sign-in?error=token_expired` — Token has expired |
| `302` | `{FRONTEND_URL}/sign-in?error=invalid_token` — Token not found or missing |

---

### `GET /auth/me`

Get the currently authenticated user's profile and organization memberships.

**Auth:** Required

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | User profile + memberships |
| `401` | Not authenticated |
| `404` | User not found (deleted while token still valid) |

**200 Response:**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "image": "string | null",
    "role": "STUDENT",
    "emailVerified": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "memberships": [
    {
      "organizationId": "string",
      "organizationName": "Acme University",
      "role": "STUDENT",
      "isVerified": true,
      "batchId": "string | null"
    }
  ]
}
```

---

### `GET /auth/google/login`

Initiate Google OAuth 2.0 login flow. Redirects the user to Google's consent screen.

**Auth:** None

**Response:** `302` redirect to Google OAuth consent page.

Sets temporary cookies: `oauth_state`, `oauth_code_verifier` (used in the callback).

---

### `GET /auth/google/callback`

Handle Google OAuth callback. Exchanges authorization code for tokens, creates or links user account, issues JWT cookies.

**Auth:** None (called by Google redirect)

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `code` | string | Authorization code from Google |
| `state` | string | OAuth state parameter for CSRF protection |

**Responses:**

| Status | Redirect Location |
|--------|------------------|
| `302` | `{FRONTEND_URL}/` — Successful login |
| `302` | `{FRONTEND_URL}/?tab=institution&verify={orgSlug}` — Login successful but institution verification needed |
| `302` | `{FRONTEND_URL}/sign-in?error=oauth_failed` — OAuth error |

**Behavior:**
- If user with matching email exists: links Google account, ensures email verified
- If user doesn't exist: creates new account with Google profile data
- If user's email domain matches an organization: redirects to institution verification page
- Sets `access_token` and `refresh_token` cookies on success

---

### `POST /auth/verify-institution`

Verify institutional affiliation using an enrollment ID. Creates org membership and enrolls in institutional courses.

**Auth:** Required

**Request body:**
```json
{
  "enrollmentId": "string (required)"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Verified successfully. User now has org membership + course access. |
| `400` | Already verified, or enrollment ID not found / already claimed |
| `404` | No institution found for user's email domain |

**200 Response:**
```json
{
  "success": true,
  "organization": "Acme University",
  "message": "Successfully verified with Acme University. You now have access to your institutional courses."
}
```

**How it works:**
1. Checks if user's email domain matches any organization's `emailDomains`
2. Looks for a `StudentRecord` matching the user's email + the provided `enrollmentId`
3. If found and not already claimed: creates `OrganizationMember`, marks record as claimed, auto-enrolls in all published courses

---

### `GET /auth/institution-status`

Check if the current user's email domain matches an institution and their verification status.

**Auth:** Required

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Institution status check result |

**200 Response (no institution):**
```json
{ "hasInstitution": false }
```

**200 Response (has institution):**
```json
{
  "hasInstitution": true,
  "organizationName": "Acme University",
  "organizationSlug": "acme-university",
  "isVerified": false
}
```

---

## Course Endpoints (Public)

> All responses from `/courses` endpoints are wrapped in `{ success: true, data: {...} }`. See [Response Wrapper](#response-wrapper).

### `GET /courses`

List published courses with filtering, search, and pagination.

**Auth:** None (public)

**Query params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | string | — | Filter by category (e.g. `"engineering"`, `"data-science"`) |
| `level` | string | — | Filter by level (e.g. `"Beginner"`, `"Intermediate"`, `"Advanced"`) |
| `featured` | string | — | Set to `"true"` to only return featured courses |
| `search` | string | — | Search by title, description, or shortDescription (case-insensitive) |
| `limit` | integer | `20` | Items per page |
| `offset` | integer | `0` | Number of items to skip |

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Paginated list of published courses |

**200 Response (inside `data` wrapper):**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "intro-to-ai",
        "title": "Introduction to AI",
        "slug": "intro-to-ai",
        "description": "Learn the fundamentals...",
        "shortDescription": "Short summary...",
        "thumbnail": "https://...",
        "price": 49.99,
        "category": "engineering",
        "level": "Beginner",
        "tags": ["AI", "Machine Learning"],
        "studentsCount": 1250,
        "rating": 4.5,
        "reviewsCount": 89,
        "totalModules": 5,
        "totalLessons": 24,
        "totalDurationMinutes": 320,
        "isFeatured": true
      }
    ],
    "pagination": {
      "total": 12,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

**Key field notes:**
- `id` = the course **slug** (not a CUID). Use this as the identifier in all frontend routes.
- `description` = `shortDescription` if available, otherwise the full description.
- `totalDurationMinutes` = computed total of all lesson durations, in minutes.

---

### `GET /courses/featured`

Get up to 3 featured published courses.

**Auth:** None (public)

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Up to 3 featured courses |

**200 Response (inside `data` wrapper):**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "intro-to-ai",
        "title": "Introduction to AI",
        "slug": "intro-to-ai",
        "description": "Short summary or full description...",
        "shortDescription": "Short summary...",
        "thumbnail": "https://...",
        "price": 49.99,
        "category": "engineering",
        "level": "Beginner",
        "tags": ["AI", "Machine Learning"],
        "studentsCount": 1250,
        "rating": 4.5,
        "reviewsCount": 89,
        "totalModules": 5,
        "totalLessons": 24,
        "totalDurationMinutes": 320,
        "isFeatured": true
      }
    ]
  }
}
```

> Same item shape as `GET /courses`, maximum 3 items returned, sorted by creation date (newest first).

---

### `GET /courses/:slug`

Get detailed course information with full module/lesson structure.

**Auth:** Optional (checks access if authenticated)

**Path params:**
| Param | Type | Description |
|-------|------|-------------|
| `slug` | string | Course URL slug (lowercase alphanumeric + hyphens) |

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Course details with modules and lesson metadata |
| `404` | Course not found or not published |

**200 Response (inside `data` wrapper):**
```json
{
  "success": true,
  "data": {
    "course": {
      "id": "intro-to-ai",
      "title": "Introduction to AI",
      "slug": "intro-to-ai",
      "description": "Full long description or fallback to description...",
      "shortDescription": "Short summary...",
      "longDescription": "Full detailed description...",
      "thumbnail": "https://...",
      "introVideoUrl": "https://...",
      "price": 49.99,
      "category": "engineering",
      "level": "Beginner",
      "tags": ["AI", "Machine Learning"],
      "studentsCount": 1250,
      "rating": 4.5,
      "reviewsCount": 89,
      "includes": ["10 hours of video", "5 coding exercises"],
      "whatYouWillLearn": ["Understand neural networks", "Build ML models"],
      "prerequisites": ["Basic Python", "High school math"],
      "isFeatured": true,
      "publishedAt": "2024-06-15T10:00:00.000Z",
      "totalModules": 5,
      "totalLessons": 24,
      "totalDurationMinutes": 320
    },
    "modules": [
      {
        "id": "cuid_string",
        "title": "Getting Started",
        "description": "...",
        "order": 1,
        "totalLessons": 5,
        "lessonCount": 5,
        "videoCount": 3,
        "totalDurationMinutes": 65,
        "lessons": [
          {
            "id": "cuid_string",
            "title": "What is AI?",
            "type": "video",
            "isFree": true,
            "isPreview": true,
            "duration": 600,
            "videoDurationMinutes": 10,
            "order": 1
          }
        ]
      }
    ],
    "hasAccess": false
  }
}
```

**Key field notes:**
- `course.id` = the slug (same as `slug` field)
- `course.description` = `longDescription` if set, otherwise the base `description`
- `modules` is a **separate top-level array** (not nested inside `course`)
- `lesson.type` = **lowercase** (`"video"` / `"article"`)
- `lesson.videoDurationMinutes` = `Math.round(duration / 60)`
- `lesson.isPreview` = whether the lesson is available as a free preview
- `hasAccess` = `true` if the authenticated user has enrollment/org access to this course

**404 Response (inside error wrapper):**
```json
{
  "success": false,
  "error": {
    "code": "Course not found",
    "message": "Course not found",
    "statusCode": 404
  }
}
```

---

### `GET /courses/my/enrolled`

List courses the authenticated user has access to.

**Auth:** Required

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | List of enrolled courses |
| `401` | Not authenticated |

**200 Response (inside `data` wrapper):**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "cuid_string",
        "title": "Introduction to AI",
        "slug": "intro-to-ai",
        "description": "...",
        "accessSource": "INDIVIDUAL"
      }
    ]
  }
}
```

> **Note:** This endpoint returns the raw course CUID as `id` (unlike the public endpoints which use slug). Consider using `GET /user/enrollments` instead for a richer response with progress data.

---

## Lesson Endpoints

> All responses from `/courses` endpoints are wrapped in `{ success: true, data: {...} }`. See [Response Wrapper](#response-wrapper).

### `GET /courses/:slug/lessons/:lessonId`

Get full lesson content including video URL, article content, curriculum navigation, and progress.

**Auth:** Optional for free lessons. Required for paid lessons.

**Path params:**
| Param | Type | Description |
|-------|------|-------------|
| `slug` | string | Course URL slug |
| `lessonId` | string | Lesson CUID |

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Full lesson content with curriculum, navigation, and progress |
| `401` | Paid lesson, user not authenticated |
| `403` | Paid lesson, user has no subscription (`"Subscription required"`) |
| `404` | Lesson not found, course not published, or slug mismatch |

**200 Response (inside `data` wrapper):**
```json
{
  "success": true,
  "data": {
    "lesson": {
      "id": "cuid_string",
      "title": "What is AI?",
      "type": "video",
      "videoUrl": "https://vimeo.com/...",
      "articleContent": "## Lesson Notes\n...",
      "content": "## Lesson Notes\n...",
      "duration": 600,
      "videoDurationMinutes": 10,
      "isFree": false,
      "isPreview": false,
      "notes": "Additional notes for the lesson...",
      "resources": [{ "title": "Slides", "url": "https://..." }],
      "courseId": "intro-to-ai",
      "moduleId": "cuid_string"
    },
    "module": {
      "id": "cuid_string",
      "title": "Getting Started",
      "order": 1
    },
    "course": {
      "id": "intro-to-ai",
      "title": "Introduction to AI",
      "slug": "intro-to-ai"
    },
    "curriculum": [
      {
        "id": "cuid_module_id",
        "title": "Getting Started",
        "order": 1,
        "lessons": [
          {
            "id": "cuid_lesson_id",
            "title": "What is AI?",
            "type": "video",
            "durationMinutes": 10,
            "isPreview": false,
            "completed": true
          }
        ]
      }
    ],
    "progress": {
      "completed": true,
      "watchedSeconds": 580
    },
    "navigation": {
      "previousLesson": null,
      "nextLesson": {
        "id": "cuid_of_next_lesson",
        "title": "History of AI",
        "moduleId": "cuid_module_id"
      },
      "currentModule": {
        "id": "cuid_module_id",
        "title": "Getting Started"
      }
    }
  }
}
```

**Key field notes:**
- `lesson.type` = **lowercase** (`"video"` / `"article"`)
- `lesson.articleContent` = the lesson markdown/HTML content (same value as `content`, provided under both keys for compatibility)
- `lesson.videoDurationMinutes` = `Math.round(duration / 60)`
- `lesson.courseId` = the course **slug** (not CUID)
- `lesson.isPreview` = whether this lesson is available as a free preview
- `lesson.notes` = additional notes text (optional)
- `lesson.resources` = array of resource objects (optional JSON)
- `curriculum` = array of modules with their lessons (replaces the old `sidebar` key)
- `curriculum[].lessons[].durationMinutes` = lesson duration in minutes
- `curriculum[].lessons[].completed` = whether the authenticated user completed this lesson
- `navigation.previousLesson` / `navigation.nextLesson` = objects with `{ id, title, moduleId }` or `null`
- `navigation.currentModule` = `{ id, title }` of the module containing the current lesson
- `progress` = `null` if user is not authenticated

**Content gating rules:**
- `isFree: true` -> accessible to everyone (even unauthenticated)
- `isFree: false` -> requires authentication + one of:
  - Direct `CourseEnrollment` (individual or institutional)
  - Verified membership in any active organization

**Error responses (inside error wrapper):**
```json
{
  "success": false,
  "error": {
    "code": "Subscription required",
    "message": "Subscription required",
    "statusCode": 403
  }
}
```

---

### `POST /courses/:slug/lessons/:lessonId/progress`

Update progress for a lesson (mark completed, update watched time).

**Auth:** Required

**Path params:**
| Param | Type | Description |
|-------|------|-------------|
| `slug` | string | Course URL slug |
| `lessonId` | string | Lesson CUID |

**Request body:**
```json
{
  "completed": "boolean (optional)",
  "watchedSeconds": "integer >= 0 (optional)"
}
```

Both fields are optional. You can send an empty body `{}`.

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Progress updated |
| `400` | Validation error (negative watchedSeconds, wrong types) |
| `401` | Not authenticated |
| `403` | No subscription for paid lesson |
| `404` | Lesson not found or course not published |

**200 Response (inside `data` wrapper):**
```json
{
  "success": true,
  "data": {
    "progress": {
      "completed": true,
      "completedAt": "2024-01-15T10:30:00.000Z",
      "watchedSeconds": 580
    }
  }
}
```

**Behavior notes:**
- `watchedSeconds` only increases (sending a lower value keeps the existing higher value)
- `completedAt` is set only on the first completion (not overwritten on subsequent updates)
- Progress can be tracked on free lessons without a subscription

---

### `GET /courses/:slug/progress`

Get full progress breakdown for a course.

**Auth:** Required

**Path params:**
| Param | Type | Description |
|-------|------|-------------|
| `slug` | string | Course URL slug |

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Course progress with per-lesson breakdown |
| `401` | Not authenticated |
| `404` | Course not found or not published |

**200 Response (inside `data` wrapper):**
```json
{
  "success": true,
  "data": {
    "courseProgress": {
      "totalLessons": 24,
      "completedLessons": 10,
      "percentComplete": 41.7
    },
    "modules": [
      {
        "id": "cuid_string",
        "title": "Getting Started",
        "lessons": [
          {
            "lessonId": "cuid_string",
            "title": "What is AI?",
            "type": "VIDEO",
            "completed": true,
            "watchedSeconds": 580
          }
        ]
      }
    ]
  }
}
```

---

## User Endpoints

> All responses from `/user` endpoints are wrapped in `{ success: true, data: {...} }`. See [Response Wrapper](#response-wrapper).
> All `/user` routes require authentication.

### `GET /user/enrollments`

List all courses the authenticated user is enrolled in, with progress info.

**Auth:** Required

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | User enrollments with progress data |
| `401` | Not authenticated |

**200 Response (inside `data` wrapper):**
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "courseId": "intro-to-ai",
        "title": "Introduction to AI",
        "slug": "intro-to-ai",
        "description": "Short description or fallback...",
        "thumbnail": "https://...",
        "category": "engineering",
        "level": "Beginner",
        "enrolledAt": "2024-06-01T12:00:00.000Z",
        "status": "in-progress",
        "progressPercentage": 42,
        "completedLessons": 10,
        "totalLessons": 24,
        "lastAccessedAt": "2024-06-15T14:30:00.000Z",
        "accessSource": "INDIVIDUAL"
      }
    ]
  }
}
```

**Key field notes:**
- `courseId` = the course **slug** (not CUID)
- `status` = `"not-started"` | `"in-progress"` | `"completed"`
- `progressPercentage` = 0-100 integer
- `accessSource` = `"INDIVIDUAL"` | `"INSTITUTION"`

---

### `GET /user/enrollments/:courseId`

Get detailed progress for a specific enrolled course. Returns per-module and per-lesson progress.

**Auth:** Required

**Path params:**
| Param | Type | Description |
|-------|------|-------------|
| `courseId` | string | Course **slug** (not CUID) |

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Course enrollment progress |
| `404` | Course not found or not enrolled |

**200 Response (inside `data` wrapper):**
```json
{
  "success": true,
  "data": {
    "courseId": "intro-to-ai",
    "title": "Introduction to AI",
    "status": "in-progress",
    "progressPercentage": 42,
    "completedLessons": 10,
    "totalLessons": 24,
    "enrolledAt": "2024-06-01T12:00:00.000Z",
    "lastAccessedAt": "2024-06-15T14:30:00.000Z",
    "modules": [
      {
        "id": "cuid_string",
        "title": "Getting Started",
        "order": 1,
        "lessons": [
          {
            "id": "cuid_string",
            "title": "What is AI?",
            "type": "video",
            "durationMinutes": 10,
            "isCompleted": true,
            "watchedSeconds": 580,
            "completedAt": "2024-06-10T08:00:00.000Z"
          }
        ]
      }
    ]
  }
}
```

**Key field notes:**
- `lesson.type` = **lowercase** (`"video"` / `"article"`)
- `lesson.durationMinutes` = `Math.round(duration / 60)`
- `lesson.isCompleted` = whether this lesson is completed

---

### `POST /user/enrollments/:courseId`

Enroll the authenticated user in a course. Increments the course's `studentsCount`.

**Auth:** Required

**Path params:**
| Param | Type | Description |
|-------|------|-------------|
| `courseId` | string | Course **slug** (not CUID) |

**Request body:** None

**Responses:**

| Status | Description |
|--------|-------------|
| `201` | Successfully enrolled |
| `404` | Course not found or not published |
| `409` | Already enrolled in this course |

**201 Response (inside `data` wrapper):**
```json
{
  "success": true,
  "data": {
    "enrollment": {
      "courseId": "intro-to-ai",
      "title": "Introduction to AI",
      "status": "not-started",
      "enrolledAt": "2024-06-01T12:00:00.000Z",
      "progressPercentage": 0
    }
  }
}
```

**409 Response (inside error wrapper):**
```json
{
  "success": false,
  "error": {
    "code": "Already enrolled in this course",
    "message": "Already enrolled in this course",
    "statusCode": 409
  }
}
```

---

### `PUT /user/lessons/:lessonId/progress`

Update watch progress for a lesson. Also updates the enrollment's `lastAccessedAt`, `currentLessonId`, and sets status to `"in-progress"`.

**Auth:** Required

**Path params:**
| Param | Type | Description |
|-------|------|-------------|
| `lessonId` | string | Lesson CUID |

**Request body:**
```json
{
  "courseId": "string (required, course slug)",
  "watchedSeconds": "integer >= 0 (optional)"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Progress updated |
| `404` | Lesson or course not found |

**200 Response (inside `data` wrapper):**
```json
{
  "success": true,
  "data": {
    "progress": {
      "isCompleted": false,
      "watchedSeconds": 320,
      "completedAt": null
    }
  }
}
```

**Behavior notes:**
- `watchedSeconds` only increases (sending a lower value keeps the existing higher value)
- Automatically updates enrollment's `lastAccessedAt` and `currentLessonId`
- Sets enrollment status to `"in-progress"` if not already

---

### `POST /user/lessons/:lessonId/complete`

Mark a lesson as completed and recompute overall course progress. Updates the enrollment's `progressPercentage` and `status`.

**Auth:** Required

**Path params:**
| Param | Type | Description |
|-------|------|-------------|
| `lessonId` | string | Lesson CUID |

**Request body:**
```json
{
  "courseId": "string (required, course slug)"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Lesson marked as complete, course progress recomputed |
| `404` | Lesson or course not found |

**200 Response (inside `data` wrapper):**
```json
{
  "success": true,
  "data": {
    "progress": {
      "isCompleted": true,
      "completedAt": "2024-06-15T14:30:00.000Z"
    },
    "courseProgress": {
      "progressPercentage": 42,
      "completedLessons": 10,
      "totalLessons": 24,
      "status": "in-progress"
    }
  }
}
```

**Key field notes:**
- `completedAt` preserves the original completion timestamp (not overwritten on repeat calls)
- `courseProgress.status` = `"in-progress"` until 100%, then `"completed"`
- `courseProgress.progressPercentage` = `Math.round((completedLessons / totalLessons) * 100)`

---

## Admin Course CRUD

> All admin course endpoints require `PLATFORM_ADMIN` role.
> Admin routes are **NOT** wrapped in the `{ success, data }` envelope — they return raw responses.

### `POST /admin/courses`

Create a new course.

**Auth:** Required (PLATFORM_ADMIN)

**Request body:**
```json
{
  "title": "string (required, 1-200 chars)",
  "slug": "string (required, 1-100 chars, lowercase alphanumeric + hyphens only, regex: /^[a-z0-9-]+$/)",
  "description": "string (optional, max 5000 chars)",
  "shortDescription": "string (optional, max 150 chars)",
  "longDescription": "string (optional, no max limit)",
  "thumbnail": "string (optional, valid URL)",
  "introVideoUrl": "string (optional, valid URL)",
  "price": "number (optional, >= 0, default 0)",
  "isPublished": "boolean (optional, default false)",
  "category": "string (optional, default 'engineering')",
  "level": "string (optional, default 'Beginner')",
  "tags": "string[] (optional, default [])",
  "studentsCount": "integer (optional, >= 0, default 0)",
  "rating": "number (optional, 0-5, default 0)",
  "reviewsCount": "integer (optional, >= 0, default 0)",
  "includes": "any (optional, JSON array of strings — e.g. ['10 hours of video', '5 exercises'])",
  "whatYouWillLearn": "any (optional, JSON array of strings)",
  "prerequisites": "any (optional, JSON array of strings)",
  "isFeatured": "boolean (optional, default false)",
  "publishedAt": "string (optional, ISO 8601 datetime)"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `201` | Course created |
| `400` | Validation error |
| `401` | Not authenticated |
| `403` | Not PLATFORM_ADMIN |
| `409` | Slug already exists |

**201 Response:**
```json
{
  "course": {
    "id": "cuid_string",
    "title": "string",
    "slug": "string",
    "description": "string | null",
    "shortDescription": "string | null",
    "longDescription": "string | null",
    "thumbnail": "string | null",
    "introVideoUrl": "string | null",
    "price": 0,
    "isPublished": false,
    "category": "engineering",
    "level": "Beginner",
    "tags": [],
    "studentsCount": 0,
    "rating": 0,
    "reviewsCount": 0,
    "includes": null,
    "whatYouWillLearn": null,
    "prerequisites": null,
    "isFeatured": false,
    "publishedAt": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### `PATCH /admin/courses/:courseId`

Update an existing course. All fields are optional (partial update).

**Auth:** Required (PLATFORM_ADMIN)

**Path params:**
| Param | Type | Description |
|-------|------|-------------|
| `courseId` | string | Course CUID |

**Request body:** Same schema as create, but all fields optional.

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Course updated |
| `400` | Validation error |
| `404` | Course not found |
| `409` | New slug already in use |

---

### `DELETE /admin/courses/:courseId`

Delete a course and all its modules, lessons, enrollments, and progress (cascades).

**Auth:** Required (PLATFORM_ADMIN)

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | `{ "message": "Course deleted" }` |
| `404` | Course not found |

---

## Admin Module CRUD

> All admin module endpoints require `PLATFORM_ADMIN` role.

### `POST /admin/courses/:courseId/modules`

Create a module within a course.

**Auth:** Required (PLATFORM_ADMIN)

**Path params:**
| Param | Type | Description |
|-------|------|-------------|
| `courseId` | string | Course CUID |

**Request body:**
```json
{
  "title": "string (required, 1-200 chars)",
  "description": "string (optional, max 2000 chars)",
  "order": "integer (required, >= 1)"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `201` | Module created |
| `400` | Validation error |
| `404` | Course not found |

---

### `PATCH /admin/courses/:courseId/modules/:moduleId`

Update a module. All fields optional.

**Auth:** Required (PLATFORM_ADMIN)

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Module updated |
| `404` | Module not found in this course |

---

### `DELETE /admin/courses/:courseId/modules/:moduleId`

Delete a module and all its lessons (cascades).

**Auth:** Required (PLATFORM_ADMIN)

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | `{ "message": "Module deleted" }` |
| `404` | Module not found in this course |

---

### `PATCH /admin/courses/:courseId/modules/reorder`

Reorder modules within a course (atomically via transaction).

**Auth:** Required (PLATFORM_ADMIN)

**Request body:**
```json
{
  "items": [
    { "id": "module_cuid_1", "order": 1 },
    { "id": "module_cuid_2", "order": 2 },
    { "id": "module_cuid_3", "order": 3 }
  ]
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Returns updated modules list sorted by order |
| `400` | Validation error |
| `404` | Course not found |

---

## Admin Lesson CRUD

> All admin lesson endpoints require `PLATFORM_ADMIN` role.

### `POST /admin/courses/:courseId/modules/:moduleId/lessons`

Create a lesson within a module.

**Auth:** Required (PLATFORM_ADMIN)

**Path params:**
| Param | Type | Description |
|-------|------|-------------|
| `courseId` | string | Course CUID |
| `moduleId` | string | Module CUID |

**Request body:**
```json
{
  "title": "string (required, 1-200 chars)",
  "description": "string (optional, max 2000 chars)",
  "order": "integer (required, >= 1)",
  "type": "\"VIDEO\" | \"ARTICLE\" (optional, default \"ARTICLE\")",
  "isFree": "boolean (optional, default false)",
  "isPreview": "boolean (optional, default false)",
  "videoUrl": "string (optional, valid URL)",
  "content": "string (optional, markdown/HTML text)",
  "duration": "integer (optional, >= 0, seconds)",
  "notes": "string (optional, additional notes text)",
  "resources": "any (optional, JSON — e.g. [{ title: 'Slides', url: 'https://...' }])"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `201` | Lesson created |
| `400` | Validation error |
| `404` | Module not found in this course |

---

### `PATCH /admin/courses/:courseId/modules/:moduleId/lessons/:lessonId`

Update a lesson. All fields optional.

**Auth:** Required (PLATFORM_ADMIN)

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Lesson updated |
| `404` | Lesson not found in this module/course |

---

### `DELETE /admin/courses/:courseId/modules/:moduleId/lessons/:lessonId`

Delete a lesson and its progress records (cascades).

**Auth:** Required (PLATFORM_ADMIN)

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | `{ "message": "Lesson deleted" }` |
| `404` | Lesson not found in this module/course |

---

### `PATCH /admin/courses/:courseId/modules/:moduleId/lessons/reorder`

Reorder lessons within a module (atomically via transaction).

**Auth:** Required (PLATFORM_ADMIN)

**Request body:**
```json
{
  "items": [
    { "id": "lesson_cuid_1", "order": 1 },
    { "id": "lesson_cuid_2", "order": 2 }
  ]
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Returns updated lessons list sorted by order |
| `400` | Validation error |
| `404` | Module not found in this course |

---

## Admin Organization Management

> All endpoints require `PLATFORM_ADMIN` role.

### `GET /admin/organizations`

List all organizations with member/student counts.

**Auth:** Required (PLATFORM_ADMIN)

**200 Response:**
```json
{
  "organizations": [
    {
      "id": "string",
      "name": "Acme University",
      "slug": "acme-university",
      "emailDomains": ["acme.edu"],
      "isActive": true,
      "contractStart": "2024-01-01T00:00:00.000Z",
      "contractEnd": "2025-01-01T00:00:00.000Z",
      "createdAt": "...",
      "updatedAt": "...",
      "_count": {
        "members": 150,
        "studentRecords": 200
      }
    }
  ]
}
```

---

### `GET /admin/organizations/:id`

Get organization details with batches and counts.

**Auth:** Required (PLATFORM_ADMIN)

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Organization details |
| `404` | Organization not found |

**200 Response:**
```json
{
  "organization": {
    "id": "string",
    "name": "Acme University",
    "slug": "acme-university",
    "emailDomains": ["acme.edu"],
    "isActive": true,
    "batches": [
      { "id": "string", "name": "2024 Batch A", "isActive": true }
    ],
    "_count": {
      "members": 150,
      "studentRecords": 200,
      "courseAccess": 5
    }
  }
}
```

---

### `POST /admin/organizations`

Create a new organization.

**Auth:** Required (PLATFORM_ADMIN)

**Request body:**
```json
{
  "name": "string (required, 1-200 chars)",
  "slug": "string (required, 1-100 chars, lowercase alphanumeric + hyphens)",
  "emailDomains": ["string (required, at least 1 domain, e.g. 'acme.edu')"],
  "contractStart": "string (optional, ISO 8601 datetime)",
  "contractEnd": "string (optional, ISO 8601 datetime)"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `201` | Organization created |
| `400` | Validation error |
| `409` | Slug already in use |

---

### `PATCH /admin/organizations/:id`

Update organization. All fields optional.

**Auth:** Required (PLATFORM_ADMIN)

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Organization updated |
| `400` | Validation error |

---

### `POST /admin/organizations/:orgId/admins`

Add an institution admin to an organization. Creates the user account if it doesn't exist. If the user exists and is a STUDENT, promotes to INSTITUTION_ADMIN.

**Auth:** Required (PLATFORM_ADMIN)

**Request body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "password": "string (optional — if provided, sets the password)"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `201` | Admin added (user created or linked) |
| `400` | Missing name or email |
| `404` | Organization not found |

**201 Response:**
```json
{
  "member": {
    "id": "string",
    "userId": "string",
    "organizationId": "string",
    "role": "ADMIN",
    "isVerified": true
  },
  "userId": "string"
}
```

---

## Admin User Management

> All endpoints require `PLATFORM_ADMIN` role.

### `GET /admin/users`

List all users with pagination and search.

**Auth:** Required (PLATFORM_ADMIN)

**Query params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | string | `"1"` | Page number (1-based) |
| `limit` | string | `"20"` | Items per page (1-100) |
| `search` | string | — | Search by name or email (case-insensitive contains) |

**200 Response:**
```json
{
  "users": [
    {
      "id": "string",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT",
      "isActive": true,
      "emailVerified": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "_count": { "organizationMembers": 1 }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### `PATCH /admin/users/:id`

Update a user's role or active status.

**Auth:** Required (PLATFORM_ADMIN)

**Path params:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | string | User CUID |

**Request body:**
```json
{
  "role": "string (optional, one of: PLATFORM_ADMIN, INSTITUTION_ADMIN, INSTRUCTOR, STUDENT)",
  "isActive": "boolean (optional)"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | User updated |

**200 Response:**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "INSTRUCTOR",
    "isActive": true
  }
}
```

---

## Institution Student Management

> All endpoints require authentication + org membership with ADMIN role (or PLATFORM_ADMIN bypass).

### `GET /institutions/:orgId/students`

List student records for an organization with pagination, search, and filters.

**Auth:** Required (Org ADMIN or PLATFORM_ADMIN)

**Path params:**
| Param | Type | Description |
|-------|------|-------------|
| `orgId` | string | Organization CUID |

**Query params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Items per page (1-100) |
| `search` | string | — | Search by name, email, or enrollmentId |
| `batchId` | string | — | Filter by batch |
| `claimed` | `"true"` \| `"false"` | — | Filter by claimed status |

**200 Response:**
```json
{
  "students": [
    {
      "id": "string",
      "organizationId": "string",
      "email": "student@acme.edu",
      "name": "Jane Smith",
      "enrollmentId": "ACM-2024-001",
      "batchId": "string | null",
      "isClaimed": false,
      "claimedByUserId": null,
      "createdAt": "...",
      "batch": { "id": "string", "name": "2024 Batch A" },
      "claimedBy": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 200,
    "totalPages": 10
  }
}
```

---

### `DELETE /institutions/:orgId/students/:recordId`

Delete a student record. If the record was claimed, also removes the org membership and institutional course enrollments.

**Auth:** Required (Org ADMIN or PLATFORM_ADMIN)

**Path params:**
| Param | Type | Description |
|-------|------|-------------|
| `orgId` | string | Organization CUID |
| `recordId` | string | StudentRecord CUID |

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | `{ "success": true }` |
| `404` | Student record not found in this organization |

---

### `POST /institutions/:orgId/students/upload`

Upload a CSV file containing student records. Auto-creates batches and auto-links existing users.

**Auth:** Required (Org ADMIN or PLATFORM_ADMIN)

**Content-Type:** `multipart/form-data`

**File limit:** 5 MB

**CSV format:**
```csv
name,email,enrollmentId,batch
Jane Smith,jane@acme.edu,ACM-2024-001,2024 Batch A
John Doe,john@acme.edu,ACM-2024-002,2024 Batch A
```

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Upload processed with stats |
| `400` | No file uploaded or no valid records |
| `404` | Organization not found |

**200 Response:**
```json
{
  "success": true,
  "stats": {
    "added": 45,
    "updated": 5,
    "alreadyClaimed": 3,
    "autoLinked": 10,
    "totalProcessed": 53,
    "parseErrors": 2
  },
  "errors": [
    { "row": 15, "message": "Missing email field" }
  ]
}
```

**Auto-linking behavior:** If a user with a matching email already exists in the system, the upload automatically:
1. Creates an org membership (verified)
2. Marks the student record as claimed
3. Auto-enrolls the user in all published courses

---

## Institution Course Access

> All endpoints require authentication + org membership with ADMIN role (or PLATFORM_ADMIN bypass).

### `GET /institutions/:orgId/courses`

List all course access assignments for an organization (both org-level and batch-level).

**Auth:** Required (Org ADMIN or PLATFORM_ADMIN)

**200 Response:**
```json
{
  "organizationCourses": [
    {
      "id": "string",
      "organizationId": "string",
      "courseId": "string",
      "course": { "id": "...", "title": "...", "slug": "..." }
    }
  ],
  "batchCourses": [
    {
      "id": "string",
      "batchId": "string",
      "courseId": "string",
      "course": { "id": "...", "title": "...", "slug": "..." },
      "batch": { "id": "...", "name": "2024 Batch A" }
    }
  ]
}
```

---

### `POST /institutions/:orgId/courses`

Assign course access to an organization or a specific batch. Auto-enrolls all verified active members.

**Auth:** Required (Org ADMIN or PLATFORM_ADMIN)

**Request body:**
```json
{
  "courseId": "string (required)",
  "batchId": "string (optional — if provided, assigns to batch instead of org)"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `201` | `{ "success": true }` |
| `400` | Validation error |
| `404` | Course not found, or batch not found in this organization |

---

### `DELETE /institutions/:orgId/courses/:courseId`

Remove course access from an organization or batch.

**Auth:** Required (Org ADMIN or PLATFORM_ADMIN)

**Path params:**
| Param | Type | Description |
|-------|------|-------------|
| `orgId` | string | Organization CUID |
| `courseId` | string | Course CUID |

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `batchId` | string | If provided, removes batch-level access only |

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | `{ "success": true }` |

> **Note:** Removing course access does NOT unenroll existing students. Their `CourseEnrollment` records remain.

---

## Database Schema Reference

### Enums

| Enum | Values |
|------|--------|
| `Role` | `PLATFORM_ADMIN`, `INSTITUTION_ADMIN`, `INSTRUCTOR`, `STUDENT` |
| `OrgMemberRole` | `ADMIN`, `STUDENT` |
| `AccessSource` | `INDIVIDUAL`, `INSTITUTION` |
| `LessonType` | `VIDEO`, `ARTICLE` |

### Key Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts with role, email verification, OAuth |
| `oauth_accounts` | Google OAuth linked accounts |
| `refresh_tokens` | Token rotation with reuse detection |
| `organizations` | B2B institutions with email domain matching |
| `organization_members` | User-org membership with verification status |
| `batches` | Student groups within organizations |
| `student_records` | Pre-uploaded student records for enrollment ID verification |
| `courses` | Course content with publish status, rich metadata, and featured flag |
| `course_enrollments` | User-course access with progress tracking |
| `organization_course_access` | Org-level course assignments |
| `batch_course_access` | Batch-level course assignments |
| `modules` | Course modules (ordered) |
| `lessons` | Module lessons with content gating, preview support, notes, and resources |
| `user_lesson_progress` | Per-user lesson completion + watch time |
| `email_verification_tokens` | Email verification tokens (SHA-256 hashed) |
| `password_reset_tokens` | Password reset tokens (SHA-256 hashed, single-use) |

### Course Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | CUID | auto | Internal identifier |
| `title` | string | — | Course title |
| `slug` | string | — | URL-friendly slug (unique). **Used as `id` in public API responses.** |
| `description` | string? | null | Base course description |
| `shortDescription` | string? | null | Short summary (max 150 chars) |
| `longDescription` | text? | null | Full detailed description |
| `thumbnail` | string? | null | Thumbnail image URL |
| `introVideoUrl` | string? | null | Course intro video URL |
| `price` | float | 0 | Course price |
| `isPublished` | boolean | false | Whether the course appears in the public catalog |
| `category` | string | "engineering" | Course category |
| `level` | string | "Beginner" | Difficulty level |
| `tags` | string[] | [] | Searchable tags |
| `studentsCount` | int | 0 | Number of enrolled students |
| `rating` | float | 0 | Average rating (0-5) |
| `reviewsCount` | int | 0 | Number of reviews |
| `includes` | JSON? | null | What's included (e.g. `["10 hours of video"]`) |
| `whatYouWillLearn` | JSON? | null | Learning outcomes |
| `prerequisites` | JSON? | null | Required prerequisites |
| `isFeatured` | boolean | false | Whether the course appears in featured list |
| `publishedAt` | datetime? | null | When the course was published |

### Lesson Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | CUID | auto | Internal identifier |
| `moduleId` | CUID | — | Parent module |
| `title` | string | — | Lesson title |
| `description` | string? | null | Lesson description |
| `order` | int | — | Display order within module |
| `type` | enum | "ARTICLE" | `VIDEO` or `ARTICLE`. **Returned as lowercase in public APIs.** |
| `isFree` | boolean | false | Whether the lesson is accessible without subscription |
| `isPreview` | boolean | false | Whether the lesson is available as a free preview |
| `videoUrl` | string? | null | Video URL (for VIDEO type) |
| `content` | text? | null | Markdown/HTML content. **Returned as both `content` and `articleContent` in public APIs.** |
| `duration` | int | 0 | Duration in seconds. **Returned as `videoDurationMinutes` in public APIs (rounded minutes).** |
| `notes` | text? | null | Additional notes for the lesson |
| `resources` | JSON? | null | Attached resources (e.g. `[{ title, url }]`) |

### CourseEnrollment Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | CUID | auto | Internal identifier |
| `userId` | CUID | — | Enrolled user |
| `courseId` | CUID | — | Enrolled course |
| `accessSource` | enum | — | `INDIVIDUAL` or `INSTITUTION` |
| `status` | string | "not-started" | `"not-started"` / `"in-progress"` / `"completed"` |
| `progressPercentage` | int | 0 | 0-100 completion percentage |
| `currentLessonId` | string? | null | Last accessed lesson CUID |
| `lastAccessedAt` | datetime? | null | Last activity timestamp |
| `createdAt` | datetime | auto | Enrollment date |

---

## Error Response Format

### Wrapped routes (`/courses/*`, `/user/*`)

Error responses are wrapped:
```json
{
  "success": false,
  "error": {
    "code": "Human-readable error message",
    "message": "Human-readable error message",
    "statusCode": 404
  }
}
```

### Non-wrapped routes (`/auth/*`, `/admin/*`, `/institutions/*`)

Error responses use the simpler format:
```json
{
  "error": "Human-readable error message"
}
```

Validation errors include additional details:
```json
{
  "error": "Invalid input",
  "details": {
    "fieldErrors": {
      "title": ["Title is required"],
      "slug": ["Slug must be lowercase alphanumeric with hyphens"]
    }
  }
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `302` | Redirect (email verification, OAuth) |
| `400` | Bad request / validation error |
| `401` | Not authenticated |
| `403` | Forbidden (wrong role, no subscription, deactivated) |
| `404` | Resource not found |
| `409` | Conflict (duplicate email, slug, already enrolled, etc.) |
| `429` | Rate limited |

---

## Field Transformation Reference

When consuming public APIs (`/courses/*`, `/user/*`), note these transformations from internal database values:

| Database Field | API Response Field | Transformation |
|----------------|-------------------|----------------|
| `course.slug` | `id` | Slug used as identifier in public APIs |
| `course.longDescription` ?? `course.description` | `course.description` | Long description preferred, falls back to base |
| `lesson.type` (`VIDEO` / `ARTICLE`) | `"video"` / `"article"` | Lowercased |
| `lesson.content` | `articleContent` (+ `content`) | Available under both keys |
| `lesson.duration` (seconds) | `videoDurationMinutes` | `Math.round(duration / 60)` |
| `enrollment.createdAt` | `enrolledAt` | Renamed in user endpoints |
| `progress.completed` | `isCompleted` | Renamed in user endpoints |
| n/a | `totalDurationMinutes` | Computed: sum of all lesson durations in minutes |
| n/a | `totalLessons` | Computed: count of all lessons across modules |
| n/a | `totalModules` | Computed: count of modules |
