import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Use /api prefix to go through Next.js rewrites proxy
// This avoids CORS/cookie issues with cross-origin HTTP requests
const API_BASE_URL = "/api";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for httpOnly cookies
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
  },
});

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Endpoints that should NOT trigger token refresh on 401
const NO_REFRESH_ENDPOINTS = [
  "/auth/me",
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
];

// Response interceptor for handling token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry auth endpoints - just reject
      const isAuthEndpoint = NO_REFRESH_ENDPOINTS.some(
        (endpoint) => originalRequest.url?.includes(endpoint)
      );
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        await apiClient.post("/auth/refresh");
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        // Don't auto-redirect - let the auth context handle it
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helper to extract error message from API response
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    // Handle wrapped error format
    if (data?.error?.message) {
      return data.error.message;
    }
    // Handle simple error format
    if (data?.error) {
      return typeof data.error === "string" ? data.error : "An error occurred";
    }
    if (data?.message) {
      return data.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

export default apiClient;
