import apiClient from "./client";
import type {
  AdminCourse,
  CreateCourseRequest,
  CreateModuleRequest,
  CreateLessonRequest,
  Organization,
  AdminUser,
  StudentRecord,
  AdminPagination,
  ModuleWithLessons,
  Lesson,
} from "./types";

const ADMIN_BASE = "/admin";
const INSTITUTIONS_BASE = "/institutions";

// =============================================================================
// Course CRUD
// =============================================================================

/**
 * Create a new course
 */
export async function createCourse(data: CreateCourseRequest): Promise<{ course: AdminCourse }> {
  const response = await apiClient.post(`${ADMIN_BASE}/courses`, data);
  return response.data;
}

/**
 * Update a course
 */
export async function updateCourse(
  courseId: string,
  data: Partial<CreateCourseRequest>
): Promise<{ course: AdminCourse }> {
  const response = await apiClient.patch(`${ADMIN_BASE}/courses/${courseId}`, data);
  return response.data;
}

/**
 * Delete a course
 */
export async function deleteCourse(courseId: string): Promise<{ message: string }> {
  const response = await apiClient.delete(`${ADMIN_BASE}/courses/${courseId}`);
  return response.data;
}

// =============================================================================
// Module CRUD
// =============================================================================

/**
 * Create a module
 */
export async function createModule(
  courseId: string,
  data: CreateModuleRequest
): Promise<{ module: ModuleWithLessons }> {
  const response = await apiClient.post(`${ADMIN_BASE}/courses/${courseId}/modules`, data);
  return response.data;
}

/**
 * Update a module
 */
export async function updateModule(
  courseId: string,
  moduleId: string,
  data: Partial<CreateModuleRequest>
): Promise<{ module: ModuleWithLessons }> {
  const response = await apiClient.patch(
    `${ADMIN_BASE}/courses/${courseId}/modules/${moduleId}`,
    data
  );
  return response.data;
}

/**
 * Delete a module
 */
export async function deleteModule(courseId: string, moduleId: string): Promise<{ message: string }> {
  const response = await apiClient.delete(`${ADMIN_BASE}/courses/${courseId}/modules/${moduleId}`);
  return response.data;
}

/**
 * Reorder modules
 */
export async function reorderModules(
  courseId: string,
  items: Array<{ id: string; order: number }>
): Promise<{ modules: ModuleWithLessons[] }> {
  const response = await apiClient.patch(`${ADMIN_BASE}/courses/${courseId}/modules/reorder`, {
    items,
  });
  return response.data;
}

// =============================================================================
// Lesson CRUD
// =============================================================================

/**
 * Create a lesson
 */
export async function createLesson(
  courseId: string,
  moduleId: string,
  data: CreateLessonRequest
): Promise<{ lesson: Lesson }> {
  const response = await apiClient.post(
    `${ADMIN_BASE}/courses/${courseId}/modules/${moduleId}/lessons`,
    data
  );
  return response.data;
}

/**
 * Update a lesson
 */
export async function updateLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
  data: Partial<CreateLessonRequest>
): Promise<{ lesson: Lesson }> {
  const response = await apiClient.patch(
    `${ADMIN_BASE}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
    data
  );
  return response.data;
}

/**
 * Delete a lesson
 */
export async function deleteLesson(
  courseId: string,
  moduleId: string,
  lessonId: string
): Promise<{ message: string }> {
  const response = await apiClient.delete(
    `${ADMIN_BASE}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`
  );
  return response.data;
}

/**
 * Reorder lessons
 */
export async function reorderLessons(
  courseId: string,
  moduleId: string,
  items: Array<{ id: string; order: number }>
): Promise<{ lessons: Lesson[] }> {
  const response = await apiClient.patch(
    `${ADMIN_BASE}/courses/${courseId}/modules/${moduleId}/lessons/reorder`,
    { items }
  );
  return response.data;
}

// =============================================================================
// Organization Management
// =============================================================================

/**
 * Get all organizations
 */
export async function getOrganizations(): Promise<{ organizations: Organization[] }> {
  const response = await apiClient.get(`${ADMIN_BASE}/organizations`);
  return response.data;
}

/**
 * Get organization details
 */
export async function getOrganization(orgId: string): Promise<{ organization: Organization }> {
  const response = await apiClient.get(`${ADMIN_BASE}/organizations/${orgId}`);
  return response.data;
}

/**
 * Create an organization
 */
export async function createOrganization(data: {
  name: string;
  slug: string;
  emailDomains: string[];
  contractStart?: string;
  contractEnd?: string;
}): Promise<{ organization: Organization }> {
  const response = await apiClient.post(`${ADMIN_BASE}/organizations`, data);
  return response.data;
}

/**
 * Update an organization
 */
export async function updateOrganization(
  orgId: string,
  data: Partial<{
    name: string;
    slug: string;
    emailDomains: string[];
    isActive: boolean;
    contractStart: string;
    contractEnd: string;
  }>
): Promise<{ organization: Organization }> {
  const response = await apiClient.patch(`${ADMIN_BASE}/organizations/${orgId}`, data);
  return response.data;
}

/**
 * Add an institution admin
 */
export async function addInstitutionAdmin(
  orgId: string,
  data: { name: string; email: string; password?: string }
): Promise<{
  member: {
    id: string;
    userId: string;
    organizationId: string;
    role: "ADMIN";
    isVerified: boolean;
  };
  userId: string;
}> {
  const response = await apiClient.post(`${ADMIN_BASE}/organizations/${orgId}/admins`, data);
  return response.data;
}

// =============================================================================
// User Management
// =============================================================================

/**
 * Get all users with pagination
 */
export async function getUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ users: AdminUser[]; pagination: AdminPagination }> {
  const response = await apiClient.get(`${ADMIN_BASE}/users`, { params });
  return response.data;
}

/**
 * Update a user
 */
export async function updateUser(
  userId: string,
  data: { role?: string; isActive?: boolean }
): Promise<{ user: AdminUser }> {
  const response = await apiClient.patch(`${ADMIN_BASE}/users/${userId}`, data);
  return response.data;
}

// =============================================================================
// Institution Student Management
// =============================================================================

/**
 * Get students for an organization
 */
export async function getInstitutionStudents(
  orgId: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    batchId?: string;
    claimed?: "true" | "false";
  }
): Promise<{ students: StudentRecord[]; pagination: AdminPagination }> {
  const response = await apiClient.get(`${INSTITUTIONS_BASE}/${orgId}/students`, { params });
  return response.data;
}

/**
 * Delete a student record
 */
export async function deleteStudentRecord(
  orgId: string,
  recordId: string
): Promise<{ success: boolean }> {
  const response = await apiClient.delete(`${INSTITUTIONS_BASE}/${orgId}/students/${recordId}`);
  return response.data;
}

/**
 * Upload student CSV
 */
export async function uploadStudentCSV(
  orgId: string,
  file: File
): Promise<{
  success: boolean;
  stats: {
    added: number;
    updated: number;
    alreadyClaimed: number;
    autoLinked: number;
    totalProcessed: number;
    parseErrors: number;
  };
  errors: Array<{ row: number; message: string }>;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post(`${INSTITUTIONS_BASE}/${orgId}/students/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

// =============================================================================
// Institution Course Access
// =============================================================================

/**
 * Get course access for an organization
 */
export async function getInstitutionCourses(orgId: string): Promise<{
  organizationCourses: Array<{
    id: string;
    organizationId: string;
    courseId: string;
    course: { id: string; title: string; slug: string };
  }>;
  batchCourses: Array<{
    id: string;
    batchId: string;
    courseId: string;
    course: { id: string; title: string; slug: string };
    batch: { id: string; name: string };
  }>;
}> {
  const response = await apiClient.get(`${INSTITUTIONS_BASE}/${orgId}/courses`);
  return response.data;
}

/**
 * Assign course access to organization or batch
 */
export async function assignCourseAccess(
  orgId: string,
  data: { courseId: string; batchId?: string }
): Promise<{ success: boolean }> {
  const response = await apiClient.post(`${INSTITUTIONS_BASE}/${orgId}/courses`, data);
  return response.data;
}

/**
 * Remove course access
 */
export async function removeCourseAccess(
  orgId: string,
  courseId: string,
  batchId?: string
): Promise<{ success: boolean }> {
  const response = await apiClient.delete(`${INSTITUTIONS_BASE}/${orgId}/courses/${courseId}`, {
    params: batchId ? { batchId } : undefined,
  });
  return response.data;
}
