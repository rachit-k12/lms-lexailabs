import apiClient from "./client";
import type {
  ApiResponse,
  GetCoursesResponse,
  GetCourseDetailResponse,
  GetLessonResponse,
  CourseListItem,
} from "./types";

const COURSES_BASE = "/courses";

export interface GetCoursesParams {
  category?: "engineering" | "non-engineering";
  level?: "Beginner" | "Intermediate" | "Advanced";
  featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Get all published courses with filtering and pagination
 */
export async function getCourses(params?: GetCoursesParams): Promise<GetCoursesResponse> {
  const response = await apiClient.get<ApiResponse<GetCoursesResponse>>(COURSES_BASE, {
    params: {
      ...params,
      featured: params?.featured ? "true" : undefined,
    },
  });
  return response.data.data!;
}

/**
 * Get featured courses (max 3)
 */
export async function getFeaturedCourses(): Promise<{ courses: CourseListItem[] }> {
  const response = await apiClient.get<ApiResponse<{ courses: CourseListItem[] }>>(
    `${COURSES_BASE}/featured`
  );
  return response.data.data!;
}

/**
 * Get detailed course information
 */
export async function getCourseBySlug(slug: string): Promise<GetCourseDetailResponse> {
  const response = await apiClient.get<ApiResponse<GetCourseDetailResponse>>(
    `${COURSES_BASE}/${slug}`
  );
  return response.data.data!;
}

/**
 * Get lesson content with navigation and progress
 */
export async function getLesson(courseSlug: string, lessonId: string): Promise<GetLessonResponse> {
  const response = await apiClient.get<ApiResponse<GetLessonResponse>>(
    `${COURSES_BASE}/${courseSlug}/lessons/${lessonId}`
  );
  return response.data.data!;
}

/**
 * Update lesson progress (call during video playback)
 */
export async function updateLessonProgress(
  courseSlug: string,
  lessonId: string,
  data: { completed?: boolean; watchedSeconds?: number }
): Promise<{ progress: { completed: boolean; completedAt?: string; watchedSeconds: number } }> {
  const response = await apiClient.post<
    ApiResponse<{ progress: { completed: boolean; completedAt?: string; watchedSeconds: number } }>
  >(`${COURSES_BASE}/${courseSlug}/lessons/${lessonId}/progress`, data);
  return response.data.data!;
}

/**
 * Get course progress summary
 */
export async function getCourseProgress(courseSlug: string): Promise<{
  courseProgress: {
    totalLessons: number;
    completedLessons: number;
    percentComplete: number;
  };
  modules: Array<{
    id: string;
    title: string;
    lessons: Array<{
      lessonId: string;
      title: string;
      type: string;
      completed: boolean;
      watchedSeconds?: number;
    }>;
  }>;
}> {
  const response = await apiClient.get<
    ApiResponse<{
      courseProgress: {
        totalLessons: number;
        completedLessons: number;
        percentComplete: number;
      };
      modules: Array<{
        id: string;
        title: string;
        lessons: Array<{
          lessonId: string;
          title: string;
          type: string;
          completed: boolean;
          watchedSeconds?: number;
        }>;
      }>;
    }>
  >(`${COURSES_BASE}/${courseSlug}/progress`);
  return response.data.data!;
}

/**
 * Get enrolled courses for current user
 */
export async function getMyEnrolledCourses(): Promise<{
  courses: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    accessSource: "INDIVIDUAL" | "INSTITUTION";
  }>;
}> {
  const response = await apiClient.get<
    ApiResponse<{
      courses: Array<{
        id: string;
        title: string;
        slug: string;
        description: string;
        accessSource: "INDIVIDUAL" | "INSTITUTION";
      }>;
    }>
  >(`${COURSES_BASE}/my/enrolled`);
  return response.data.data!;
}
