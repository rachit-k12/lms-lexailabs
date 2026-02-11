/**
 * LexAI Labs LMS - API Type Definitions
 * Based on Backend API Documentation
 */

// =============================================================================
// Enums
// =============================================================================

export type Role = "PLATFORM_ADMIN" | "INSTITUTION_ADMIN" | "INSTRUCTOR" | "STUDENT";
export type OrgMemberRole = "ADMIN" | "STUDENT";
export type AccessSource = "INDIVIDUAL" | "INSTITUTION";
export type LessonType = "video" | "article";
export type EnrollmentStatus = "not-started" | "in-progress" | "completed";

// =============================================================================
// Auth Types
// =============================================================================

export interface MembershipInfo {
  organizationId: string;
  organizationName: string;
  role: OrgMemberRole;
  isVerified: boolean;
  batchId: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  emailVerified?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  memberships: MembershipInfo[];
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyInstitutionRequest {
  enrollmentId: string;
}

export interface InstitutionStatus {
  hasInstitution: boolean;
  organizationName?: string;
  organizationSlug?: string;
  isVerified?: boolean;
}

// =============================================================================
// Course Types
// =============================================================================

export interface CourseIncludes {
  videoHours: number;
  articles: number;
  downloadableResources: number;
  exercises: number;
  certificateOfCompletion: boolean;
  lifetimeAccess: boolean;
}

export interface CourseListItem {
  id: string; // slug
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  price: number;
  category: "engineering" | "non-engineering";
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  totalModules: number;
  totalLessons: number;
  totalDurationMinutes: number;
  isFeatured: boolean;
}

export interface Course extends CourseListItem {
  longDescription: string;
  introVideoUrl?: string;
  includes: string[];
  whatYouWillLearn: string[];
  prerequisites: string[];
  isPublished: boolean;
  publishedAt: string;
  updatedAt?: string;
}

export interface LessonListItem {
  id: string;
  title: string;
  type: LessonType;
  duration?: number;
  videoDurationMinutes?: number;
  isPreview: boolean;
  isFree: boolean;
  order: number;
  completed?: boolean;
}

export interface ModuleWithLessons {
  id: string;
  title: string;
  description?: string;
  order: number;
  totalLessons: number;
  lessonCount: number;
  videoCount: number;
  totalDurationMinutes: number;
  lessons: LessonListItem[];
}

export interface LessonResource {
  title: string;
  url: string;
  type?: "pdf" | "code" | "dataset" | "link";
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  description?: string;
  type: LessonType;
  videoUrl?: string;
  videoDurationMinutes?: number;
  duration?: number;
  articleContent?: string;
  content?: string;
  isPreview: boolean;
  isFree: boolean;
  notes?: string;
  resources?: LessonResource[];
  order: number;
}

export interface LessonNavItem {
  id: string;
  title: string;
  moduleId: string;
}

export interface CurriculumLesson {
  id: string;
  title: string;
  type: LessonType;
  durationMinutes?: number;
  isPreview: boolean;
  completed?: boolean;
}

export interface CurriculumModule {
  id: string;
  title: string;
  order: number;
  lessons: CurriculumLesson[];
}

// =============================================================================
// Progress & Enrollment Types
// =============================================================================

export interface LessonProgress {
  completed: boolean;
  completedAt?: string;
  watchedSeconds?: number;
}

export interface EnrollmentWithCourse {
  courseId: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: "engineering" | "non-engineering";
  level: "Beginner" | "Intermediate" | "Advanced";
  enrolledAt: string;
  status: EnrollmentStatus;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessedAt: string;
  accessSource: AccessSource;
}

export interface CourseProgress {
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  status?: EnrollmentStatus;
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

// Course Responses
export interface GetCoursesResponse {
  courses: CourseListItem[];
  pagination: PaginationInfo;
}

export interface GetCourseDetailResponse {
  course: Course;
  modules: ModuleWithLessons[];
  hasAccess: boolean;
}

export interface GetLessonResponse {
  lesson: Lesson;
  module: {
    id: string;
    title: string;
    order: number;
  };
  course: {
    id: string;
    title: string;
    slug: string;
  };
  curriculum: CurriculumModule[];
  progress: LessonProgress | null;
  navigation: {
    previousLesson: LessonNavItem | null;
    nextLesson: LessonNavItem | null;
    currentModule: {
      id: string;
      title: string;
    };
  };
}

// Enrollment Responses
export interface GetEnrollmentsResponse {
  enrollments: EnrollmentWithCourse[];
}

// Progress Responses
export interface UpdateProgressResponse {
  progress: {
    completed: boolean;
    completedAt?: string;
    watchedSeconds: number;
  };
}

export interface CompleteLessonResponse {
  progress: {
    isCompleted: boolean;
    completedAt: string;
  };
  courseProgress: CourseProgress;
}

// =============================================================================
// Admin Types
// =============================================================================

export interface AdminCourse {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  thumbnail: string | null;
  introVideoUrl: string | null;
  price: number;
  isPublished: boolean;
  category: string;
  level: string;
  tags: string[];
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  includes: string[] | null;
  whatYouWillLearn: string[] | null;
  prerequisites: string[] | null;
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  longDescription?: string;
  thumbnail?: string;
  introVideoUrl?: string;
  price?: number;
  isPublished?: boolean;
  category?: string;
  level?: string;
  tags?: string[];
  studentsCount?: number;
  rating?: number;
  reviewsCount?: number;
  includes?: string[];
  whatYouWillLearn?: string[];
  prerequisites?: string[];
  isFeatured?: boolean;
  publishedAt?: string;
}

export interface CreateModuleRequest {
  title: string;
  description?: string;
  order: number;
}

export interface CreateLessonRequest {
  title: string;
  description?: string;
  order: number;
  type?: "VIDEO" | "ARTICLE";
  isFree?: boolean;
  isPreview?: boolean;
  videoUrl?: string;
  content?: string;
  duration?: number;
  notes?: string;
  resources?: LessonResource[];
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  emailDomains: string[];
  isActive: boolean;
  contractStart: string | null;
  contractEnd: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    members: number;
    studentRecords: number;
    courseAccess?: number;
  };
  batches?: Array<{
    id: string;
    name: string;
    isActive: boolean;
  }>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  emailVerified: string | null;
  createdAt: string;
  _count?: {
    organizationMembers: number;
  };
}

export interface StudentRecord {
  id: string;
  organizationId: string;
  email: string;
  name: string;
  enrollmentId: string;
  batchId: string | null;
  isClaimed: boolean;
  claimedByUserId: string | null;
  createdAt: string;
  batch?: {
    id: string;
    name: string;
  } | null;
  claimedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface AdminPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
