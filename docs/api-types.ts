/**
 * LexAI Labs LMS - API Type Definitions
 *
 * Use these as reference for backend model definitions.
 * Note: Instructor & testimonials are managed on frontend.
 */

// =============================================================================
// Core Models
// =============================================================================

export interface Course {
  id: string;                          // Slug identifier
  title: string;
  shortDescription: string;            // For cards (max 150 chars)
  longDescription: string;             // Markdown
  thumbnail: string;

  category: "engineering" | "non-engineering";
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];

  studentsCount: number;
  rating: number;
  reviewsCount: number;

  totalDurationMinutes: number;
  totalLessons: number;
  totalModules: number;
  totalArticles: number;

  includes: CourseIncludes;
  whatYouWillLearn: string[];
  prerequisites: string[];

  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: string;
  updatedAt: string;
}

export interface CourseIncludes {
  videoHours: number;
  articles: number;
  downloadableResources: number;
  exercises: number;
  certificateOfCompletion: boolean;
  lifetimeAccess: boolean;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  totalLessons: number;
  totalDurationMinutes: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  description?: string;

  type: "video" | "article";

  videoUrl?: string;
  videoDurationMinutes?: number;
  articleContent?: string;

  isPreview: boolean;
  isFree: boolean;

  notes?: string;
  resources?: LessonResource[];

  order: number;
}

export interface LessonResource {
  title: string;
  url: string;
  type: "pdf" | "code" | "dataset" | "link";
}

export interface UserEnrollment {
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

export interface LessonProgress {
  lessonId: string;
  isCompleted: boolean;
  watchedSeconds?: number;
  watchedPercentage?: number;
  completedAt?: string;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    statusCode: number;
  };
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// =============================================================================
// GET /courses
// =============================================================================

export interface GetCoursesParams {
  category?: "engineering" | "non-engineering";
  level?: "Beginner" | "Intermediate" | "Advanced";
  featured?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
}

export interface CourseListItem {
  id: string;
  title: string;
  shortDescription: string;
  thumbnail: string;
  category: "engineering" | "non-engineering";
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  totalDurationMinutes: number;
  totalLessons: number;
  totalModules: number;
  isFeatured: boolean;
}

export interface GetCoursesResponse {
  courses: CourseListItem[];
  pagination: PaginationInfo;
}

// =============================================================================
// GET /courses/:courseId
// =============================================================================

export interface ModuleWithLessons {
  id: string;
  title: string;
  description?: string;
  order: number;
  totalLessons: number;
  totalDurationMinutes: number;
  lessons: LessonListItem[];
}

export interface LessonListItem {
  id: string;
  title: string;
  type: "video" | "article";
  videoDurationMinutes?: number;
  isPreview: boolean;
  isFree: boolean;
  order: number;
}

export interface GetCourseDetailResponse {
  course: Course;
  modules: ModuleWithLessons[];
}

// =============================================================================
// GET /courses/:courseId/lessons/:lessonId
// =============================================================================

export interface LessonNavItem {
  id: string;
  title: string;
  moduleId: string;
}

export interface CurriculumLesson {
  id: string;
  title: string;
  type: "video" | "article";
  durationMinutes?: number;
  isPreview: boolean;
}

export interface CurriculumModule {
  id: string;
  title: string;
  order: number;
  lessons: CurriculumLesson[];
}

export interface GetLessonResponse {
  lesson: Lesson;
  navigation: {
    previousLesson: LessonNavItem | null;
    nextLesson: LessonNavItem | null;
    currentModule: {
      id: string;
      title: string;
    };
  };
  curriculum: CurriculumModule[];
}

// =============================================================================
// GET /user/enrollments
// =============================================================================

export interface EnrollmentWithCourse {
  id: string;
  courseId: string;
  course: {
    id: string;
    title: string;
    thumbnail: string;
    totalLessons: number;
  };
  status: "not-started" | "in-progress" | "completed";
  progressPercentage: number;
  completedLessonIds: string[];
  currentLessonId?: string;
  enrolledAt: string;
  lastAccessedAt: string;
}

export interface GetEnrollmentsResponse {
  enrollments: EnrollmentWithCourse[];
}

// =============================================================================
// GET /user/enrollments/:courseId
// =============================================================================

export interface GetCourseProgressResponse {
  enrollment: UserEnrollment;
  lessonProgress: LessonProgress[];
}

// =============================================================================
// PUT /user/lessons/:lessonId/progress
// =============================================================================

export interface UpdateProgressRequest {
  courseId: string;
  watchedSeconds: number;
}

export interface UpdateProgressResponse {
  lessonProgress: {
    lessonId: string;
    isCompleted: boolean;
    watchedSeconds: number;
    watchedPercentage: number;
  };
  courseProgress: {
    progressPercentage: number;
    completedLessons: number;
    totalLessons: number;
  };
}

// =============================================================================
// POST /user/lessons/:lessonId/complete
// =============================================================================

export interface CompleteLessonRequest {
  courseId: string;
}

export interface CompleteLessonResponse {
  lessonProgress: {
    lessonId: string;
    isCompleted: true;
    completedAt: string;
  };
  courseProgress: {
    progressPercentage: number;
    completedLessons: number;
    totalLessons: number;
    status: "not-started" | "in-progress" | "completed";
  };
}
