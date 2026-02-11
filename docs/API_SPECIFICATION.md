# LexAI Labs LMS - API Specification

## Overview

Core APIs for the LMS platform frontend. Auth is handled separately by the backend.

**Note:** Instructor data is managed on the frontend (single instructor platform).


---

## Data Models

### Course

```typescript
interface Course {
  id: string;                          // Slug identifier (e.g., "ml-fundamentals")
  title: string;                       // "Machine Learning Fundamentals"
  shortDescription: string;            // For cards (max 150 chars)
  longDescription: string;             // Full description for course page (Markdown)
  thumbnail: string;                   // URL to course thumbnail

  // Categorization
  category: "engineering" | "non-engineering";
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];                      // ["Python", "TensorFlow"]

  // Stats
  studentsCount: number;
  rating: number;                      // 0-5
  reviewsCount: number;

  // Duration & Content
  totalDurationMinutes: number;
  totalLessons: number;
  totalModules: number;
  totalArticles: number;

  // Course Includes
  includes: {
    videoHours: number;
    articles: number;
    downloadableResources: number;
    exercises: number;
    certificateOfCompletion: boolean;
    lifetimeAccess: boolean;
  };

  // Learning Outcomes
  whatYouWillLearn: string[];

  // Prerequisites
  prerequisites: string[];

  // Metadata
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: string;
  updatedAt: string;
}
```

### Module

```typescript
interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  totalLessons: number;
  totalDurationMinutes: number;
}
```

### Lesson

```typescript
interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  description?: string;

  // Content Type
  type: "video" | "article";

  // Video fields
  videoUrl?: string;
  videoDurationMinutes?: number;

  // Article fields
  articleContent?: string;             // Markdown

  // Access
  isPreview: boolean;                  // Free preview
  isFree: boolean;

  // Notes below video (Markdown)
  notes?: string;

  // Resources
  resources?: {
    title: string;
    url: string;
    type: "pdf" | "code" | "dataset" | "link";
  }[];

  order: number;
}
```

### UserEnrollment

```typescript
interface UserEnrollment {
  id: string;
  userId: string;
  courseId: string;
  status: "not-started" | "in-progress" | "completed";
  progressPercentage: number;
  completedLessonIds: string[];
  currentLessonId?: string;
  enrolledAt: string;
  lastAccessedAt: string;
}
```

### LessonProgress

```typescript
interface LessonProgress {
  lessonId: string;
  isCompleted: boolean;
  watchedSeconds?: number;
  watchedPercentage?: number;
  completedAt?: string;
}
```

---

## API Endpoints

### 1. Courses

#### GET /courses

Get all published courses.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | "engineering" \| "non-engineering" |
| level | string | "Beginner" \| "Intermediate" \| "Advanced" |
| featured | boolean | Get only featured courses |
| limit | number | Limit results (default: 20) |
| offset | number | Pagination offset |
| search | string | Search in title/description |

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "ml-fundamentals",
        "title": "Machine Learning Fundamentals",
        "shortDescription": "Master the foundations of machine learning.",
        "thumbnail": "https://cdn.lexailabs.com/courses/ml-fundamentals.jpg",
        "category": "engineering",
        "level": "Intermediate",
        "tags": ["Python", "TensorFlow"],
        "studentsCount": 8900,
        "rating": 4.8,
        "reviewsCount": 234,
        "totalDurationMinutes": 1440,
        "totalLessons": 42,
        "totalModules": 6,
        "isFeatured": true
      }
    ],
    "pagination": {
      "total": 9,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

---

#### GET /courses/featured

Get featured courses for homepage (max 3).

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      // Same structure as above, max 3 items
    ]
  }
}
```

---

#### GET /courses/:courseId

Get full course details.

**Response:**
```json
{
  "success": true,
  "data": {
    "course": {
      "id": "ml-fundamentals",
      "title": "Machine Learning Fundamentals",
      "shortDescription": "Master the foundations of machine learning.",
      "longDescription": "This comprehensive course covers everything...",
      "thumbnail": "https://cdn.lexailabs.com/courses/ml-fundamentals.jpg",
      "category": "engineering",
      "level": "Intermediate",
      "tags": ["Python", "TensorFlow", "Neural Networks"],
      "studentsCount": 8900,
      "rating": 4.8,
      "reviewsCount": 234,
      "totalDurationMinutes": 1440,
      "totalLessons": 42,
      "totalModules": 6,
      "totalArticles": 8,
      "includes": {
        "videoHours": 24,
        "articles": 8,
        "downloadableResources": 15,
        "exercises": 12,
        "certificateOfCompletion": true,
        "lifetimeAccess": true
      },
      "whatYouWillLearn": [
        "Understand core ML algorithms",
        "Build neural networks from scratch",
        "Implement real-world ML projects"
      ],
      "prerequisites": [
        "Basic Python programming",
        "High school mathematics"
      ],
      "isFeatured": true,
      "isPublished": true,
      "publishedAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-06-20T00:00:00Z"
    },
    "modules": [
      {
        "id": "module-1",
        "title": "Introduction to Machine Learning",
        "description": "Get started with ML basics",
        "order": 1,
        "totalLessons": 5,
        "totalDurationMinutes": 120,
        "lessons": [
          {
            "id": "l-1",
            "title": "Welcome to the Course",
            "type": "video",
            "videoDurationMinutes": 5,
            "isPreview": true,
            "isFree": true,
            "order": 1
          },
          {
            "id": "l-2",
            "title": "What is Machine Learning?",
            "type": "video",
            "videoDurationMinutes": 15,
            "isPreview": true,
            "isFree": false,
            "order": 2
          },
          {
            "id": "l-3",
            "title": "Setting Up Your Environment",
            "type": "article",
            "isPreview": false,
            "isFree": false,
            "order": 3
          }
        ]
      }
    ]
  }
}
```

---

### 2. Lessons

#### GET /courses/:courseId/lessons/:lessonId

Get lesson content for learn page.

**Response:**
```json
{
  "success": true,
  "data": {
    "lesson": {
      "id": "l-1",
      "moduleId": "module-1",
      "courseId": "ml-fundamentals",
      "title": "Welcome to the Course",
      "description": "Introduction to what you'll learn.",
      "type": "video",
      "videoUrl": "https://cdn.lexailabs.com/videos/ml-fundamentals/l-1.mp4",
      "videoDurationMinutes": 5,
      "isPreview": true,
      "isFree": true,
      "notes": "## Welcome\n\nIn this course, you will learn:\n- Core ML concepts\n- Practical implementation\n\n### Resources\n- [GitHub Repo](https://github.com/lexailabs/ml-fundamentals)",
      "resources": [
        {
          "title": "Course Slides",
          "url": "https://cdn.lexailabs.com/resources/intro-slides.pdf",
          "type": "pdf"
        }
      ],
      "order": 1
    },
    "navigation": {
      "previousLesson": null,
      "nextLesson": {
        "id": "l-2",
        "title": "What is Machine Learning?",
        "moduleId": "module-1"
      },
      "currentModule": {
        "id": "module-1",
        "title": "Introduction to Machine Learning"
      }
    },
    "curriculum": [
      {
        "id": "module-1",
        "title": "Introduction to Machine Learning",
        "order": 1,
        "lessons": [
          {
            "id": "l-1",
            "title": "Welcome to the Course",
            "type": "video",
            "durationMinutes": 5,
            "isPreview": true
          }
        ]
      }
    ]
  }
}
```

---

### 3. User Progress

#### GET /user/enrollments

Get user's enrolled courses.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "id": "enroll-123",
        "courseId": "ml-fundamentals",
        "course": {
          "id": "ml-fundamentals",
          "title": "Machine Learning Fundamentals",
          "thumbnail": "https://cdn.lexailabs.com/courses/ml-fundamentals.jpg",
          "totalLessons": 42
        },
        "status": "in-progress",
        "progressPercentage": 35,
        "completedLessonIds": ["l-1", "l-2", "l-3"],
        "currentLessonId": "l-4",
        "enrolledAt": "2024-06-01T00:00:00Z",
        "lastAccessedAt": "2024-06-20T10:30:00Z"
      }
    ]
  }
}
```

---

#### GET /user/enrollments/:courseId

Get user's progress for a specific course.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollment": {
      "id": "enroll-123",
      "courseId": "ml-fundamentals",
      "status": "in-progress",
      "progressPercentage": 35,
      "completedLessonIds": ["l-1", "l-2", "l-3"],
      "currentLessonId": "l-4",
      "enrolledAt": "2024-06-01T00:00:00Z",
      "lastAccessedAt": "2024-06-20T10:30:00Z"
    },
    "lessonProgress": [
      {
        "lessonId": "l-1",
        "isCompleted": true,
        "watchedPercentage": 100,
        "completedAt": "2024-06-01T10:00:00Z"
      },
      {
        "lessonId": "l-4",
        "isCompleted": false,
        "watchedPercentage": 45,
        "watchedSeconds": 324
      }
    ]
  }
}
```

---

#### POST /user/enrollments/:courseId

Enroll user in a course.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollment": {
      "id": "enroll-124",
      "courseId": "deep-learning",
      "status": "not-started",
      "progressPercentage": 0,
      "enrolledAt": "2024-06-21T00:00:00Z"
    }
  }
}
```

---

#### PUT /user/lessons/:lessonId/progress

Update lesson progress (call every 30s while watching video).

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "courseId": "ml-fundamentals",
  "watchedSeconds": 450
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "lessonProgress": {
      "lessonId": "l-4",
      "isCompleted": false,
      "watchedSeconds": 450,
      "watchedPercentage": 75
    },
    "courseProgress": {
      "progressPercentage": 38,
      "completedLessons": 3,
      "totalLessons": 42
    }
  }
}
```

---

#### POST /user/lessons/:lessonId/complete

Mark lesson as completed.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "courseId": "ml-fundamentals"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "lessonProgress": {
      "lessonId": "l-4",
      "isCompleted": true,
      "completedAt": "2024-06-21T10:00:00Z"
    },
    "courseProgress": {
      "progressPercentage": 40,
      "completedLessons": 4,
      "totalLessons": 42,
      "status": "in-progress"
    }
  }
}
```

---

## Database Schema

```sql
-- Courses
CREATE TABLE courses (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  short_description TEXT,
  long_description TEXT,
  thumbnail VARCHAR(500),
  category VARCHAR(50),
  level VARCHAR(50),
  tags JSONB,
  includes JSONB,
  what_you_will_learn JSONB,
  prerequisites JSONB,
  students_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Modules
CREATE TABLE modules (
  id VARCHAR(100) PRIMARY KEY,
  course_id VARCHAR(100) REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Lessons
CREATE TABLE lessons (
  id VARCHAR(100) PRIMARY KEY,
  module_id VARCHAR(100) REFERENCES modules(id) ON DELETE CASCADE,
  course_id VARCHAR(100) REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL,          -- 'video' | 'article'
  video_url VARCHAR(500),
  video_duration_minutes INTEGER,
  article_content TEXT,
  notes TEXT,
  resources JSONB,
  is_preview BOOLEAN DEFAULT FALSE,
  is_free BOOLEAN DEFAULT FALSE,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Enrollments
CREATE TABLE user_enrollments (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  course_id VARCHAR(100) REFERENCES courses(id),
  status VARCHAR(20) DEFAULT 'not-started',
  progress_percentage INTEGER DEFAULT 0,
  current_lesson_id VARCHAR(100),
  enrolled_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  last_accessed_at TIMESTAMP,
  UNIQUE(user_id, course_id)
);

-- Lesson Progress
CREATE TABLE lesson_progress (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  lesson_id VARCHAR(100) REFERENCES lessons(id) ON DELETE CASCADE,
  course_id VARCHAR(100) REFERENCES courses(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  watched_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  last_accessed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Indexes
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_featured ON courses(is_featured, is_published);
CREATE INDEX idx_modules_course ON modules(course_id, sort_order);
CREATE INDEX idx_lessons_module ON lessons(module_id, sort_order);
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_enrollments_user ON user_enrollments(user_id);
CREATE INDEX idx_progress_user_course ON lesson_progress(user_id, course_id);
```

---

## Error Responses

```json
{
  "success": false,
  "error": {
    "code": "COURSE_NOT_FOUND",
    "message": "The requested course does not exist",
    "statusCode": 404
  }
}
```

| Code | Status | Description |
|------|--------|-------------|
| UNAUTHORIZED | 401 | Invalid auth token |
| FORBIDDEN | 403 | No permission |
| NOT_FOUND | 404 | Resource not found |
| ALREADY_ENROLLED | 409 | Already enrolled |
| INTERNAL_ERROR | 500 | Server error |

---

## Frontend Notes

1. **Instructor data** is stored in `lib/data.ts` on frontend
2. **Testimonials** are static on frontend
3. **Markdown rendering**: Use react-markdown for `notes` and `articleContent`
4. **Progress sync**: Call `PUT /user/lessons/:id/progress` every 30s during video playback
5. **Course stats** (totalLessons, duration) can be calculated from modules/lessons
