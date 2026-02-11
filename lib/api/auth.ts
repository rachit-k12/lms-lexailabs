import apiClient from "./client";
import type {
  AuthResponse,
  User,
  MembershipInfo,
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyInstitutionRequest,
  InstitutionStatus,
} from "./types";

const AUTH_BASE = "/auth";

/**
 * Register a new user account
 */
export async function register(data: RegisterRequest): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post(`${AUTH_BASE}/register`, data);
  return response.data;
}

/**
 * Login with email and password
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post(`${AUTH_BASE}/login`, data);
  return response.data;
}

/**
 * Logout current session
 */
export async function logout(): Promise<void> {
  await apiClient.post(`${AUTH_BASE}/logout`);
}

/**
 * Logout from all devices
 */
export async function logoutAll(): Promise<void> {
  await apiClient.post(`${AUTH_BASE}/logout-all`);
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<void> {
  await apiClient.post(`${AUTH_BASE}/refresh`);
}

/**
 * Request password reset email
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post(`${AUTH_BASE}/forgot-password`, data);
  return response.data;
}

/**
 * Reset password with token
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post(`${AUTH_BASE}/reset-password`, data);
  return response.data;
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<{ user: User; memberships: MembershipInfo[] }> {
  const response = await apiClient.get(`${AUTH_BASE}/me`);
  return response.data;
}

/**
 * Get Google OAuth login URL (redirects browser)
 * Uses relative path to go through Next.js proxy for same-origin cookies
 */
export function getGoogleLoginUrl(): string {
  return `/api${AUTH_BASE}/google/login`;
}

/**
 * Verify institutional affiliation
 */
export async function verifyInstitution(data: VerifyInstitutionRequest): Promise<{
  success: boolean;
  organization: string;
  message: string;
}> {
  const response = await apiClient.post(`${AUTH_BASE}/verify-institution`, data);
  return response.data;
}

/**
 * Check institution status for current user
 */
export async function getInstitutionStatus(): Promise<InstitutionStatus> {
  const response = await apiClient.get(`${AUTH_BASE}/institution-status`);
  return response.data;
}
