import apiClient from "./client";
import type {
  ApiResponse,
  GetEnrollmentsResponse,
  EnrollmentWithCourse,
  CourseProgress,
  EnrollmentStatus,
} from "./types";

const USER_BASE = "/user";

/**
 * Get all enrolled courses with progress
 */
export async function getEnrollments(): Promise<GetEnrollmentsResponse> {
  const response = await apiClient.get<ApiResponse<GetEnrollmentsResponse>>(
    `${USER_BASE}/enrollments`
  );
  return response.data.data!;
}

/**
 * Get detailed progress for a specific course enrollment
 */
export async function getEnrollmentProgress(courseSlug: string): Promise<{
  courseId: string;
  title: string;
  status: EnrollmentStatus;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  enrolledAt: string;
  lastAccessedAt: string;
  modules: Array<{
    id: string;
    title: string;
    order: number;
    lessons: Array<{
      id: string;
      title: string;
      type: "video" | "article";
      durationMinutes: number;
      isCompleted: boolean;
      watchedSeconds: number;
      completedAt?: string;
    }>;
  }>;
}> {
  const response = await apiClient.get<
    ApiResponse<{
      courseId: string;
      title: string;
      status: EnrollmentStatus;
      progressPercentage: number;
      completedLessons: number;
      totalLessons: number;
      enrolledAt: string;
      lastAccessedAt: string;
      modules: Array<{
        id: string;
        title: string;
        order: number;
        lessons: Array<{
          id: string;
          title: string;
          type: "video" | "article";
          durationMinutes: number;
          isCompleted: boolean;
          watchedSeconds: number;
          completedAt?: string;
        }>;
      }>;
    }>
  >(`${USER_BASE}/enrollments/${courseSlug}`);
  return response.data.data!;
}

/**
 * Enroll in a course
 */
export async function enrollInCourse(courseSlug: string): Promise<{
  enrollment: {
    courseId: string;
    title: string;
    status: EnrollmentStatus;
    enrolledAt: string;
    progressPercentage: number;
  };
}> {
  const response = await apiClient.post<
    ApiResponse<{
      enrollment: {
        courseId: string;
        title: string;
        status: EnrollmentStatus;
        enrolledAt: string;
        progressPercentage: number;
      };
    }>
  >(`${USER_BASE}/enrollments/${courseSlug}`);
  return response.data.data!;
}

/**
 * Update lesson watch progress (alternative endpoint)
 */
export async function updateLessonWatchProgress(
  lessonId: string,
  data: { courseId: string; watchedSeconds?: number }
): Promise<{
  progress: {
    isCompleted: boolean;
    watchedSeconds: number;
    completedAt: string | null;
  };
}> {
  const response = await apiClient.put<
    ApiResponse<{
      progress: {
        isCompleted: boolean;
        watchedSeconds: number;
        completedAt: string | null;
      };
    }>
  >(`${USER_BASE}/lessons/${lessonId}/progress`, data);
  return response.data.data!;
}

/**
 * Mark lesson as completed
 */
export async function completeLesson(
  lessonId: string,
  data: { courseId: string }
): Promise<{
  progress: {
    isCompleted: boolean;
    completedAt: string;
  };
  courseProgress: CourseProgress;
}> {
  const response = await apiClient.post<
    ApiResponse<{
      progress: {
        isCompleted: boolean;
        completedAt: string;
      };
      courseProgress: CourseProgress;
    }>
  >(`${USER_BASE}/lessons/${lessonId}/complete`, data);
  return response.data.data!;
}
