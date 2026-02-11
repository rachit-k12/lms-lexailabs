"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  getCurrentUser,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
  type User,
  type MembershipInfo,
  type LoginRequest,
  type RegisterRequest,
  getErrorMessage,
} from "@/lib/api";

interface AuthState {
  user: User | null;
  memberships: MembershipInfo[];
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
  isInstitutionAdmin: boolean;
  hasInstitutionalAccess: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/about",
  "/courses",
  "/contact",
  "/terms",
  "/privacy",
  "/refund-policy",
  "/help",
  "/faq",
];

// Routes that require authentication
const PROTECTED_ROUTES = ["/my-learning", "/learn"];

// Admin routes
const ADMIN_ROUTES = ["/admin"];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    memberships: [],
    isLoading: true,
    isAuthenticated: false,
  });

  const router = useRouter();
  const pathname = usePathname();

  // Check if user is platform admin
  const isAdmin = state.user?.role === "PLATFORM_ADMIN";

  // Check if user is institution admin
  const isInstitutionAdmin =
    state.user?.role === "INSTITUTION_ADMIN" ||
    (state.memberships?.some((m) => m.role === "ADMIN" && m.isVerified) ?? false);

  // Check if user has institutional access
  const hasInstitutionalAccess = state.memberships?.some(
    (m) => m.isVerified
  ) ?? false;

  // Fetch current user
  const refreshUser = useCallback(async () => {
    try {
      const { user, memberships } = await getCurrentUser();
      setState({
        user,
        memberships: memberships ?? [],
        isLoading: false,
        isAuthenticated: true,
      });
    } catch {
      setState({
        user: null,
        memberships: [],
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  // Login handler
  const login = async (data: LoginRequest) => {
    // Login API sets httpOnly cookies but doesn't return user data
    await loginApi(data);

    // Fetch user data after login (cookies are now set)
    const { user, memberships } = await getCurrentUser();

    setState({
      user,
      memberships: memberships ?? [],
      isLoading: false,
      isAuthenticated: true,
    });

    // Redirect based on role - use hard navigation to ensure fresh state
    if (user?.role === "PLATFORM_ADMIN") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/my-learning";
    }
  };

  // Register handler
  const register = async (data: RegisterRequest) => {
    const response = await registerApi(data);
    return response;
  };

  // Logout handler
  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore errors on logout
    }
    setState({
      user: null,
      memberships: [],
      isLoading: false,
      isAuthenticated: false,
    });
    // Use hard navigation to ensure cookies are properly cleared and page fully reloads
    window.location.href = "/login";
  };

  // Check authentication on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Route protection
  useEffect(() => {
    if (state.isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    const isProtectedRoute = PROTECTED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    const isAdminRoute = ADMIN_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    // Redirect to login if trying to access protected route while not authenticated
    if (!state.isAuthenticated && isProtectedRoute) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Redirect to home if trying to access admin route without admin role
    if (isAdminRoute && !isAdmin && !isInstitutionAdmin) {
      if (!state.isAuthenticated) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        router.push("/");
      }
      return;
    }

    // Redirect to my-learning if authenticated user tries to access login/signup
    if (state.isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
      if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/my-learning");
      }
    }
  }, [state.isLoading, state.isAuthenticated, pathname, router, isAdmin, isInstitutionAdmin]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshUser,
        isAdmin,
        isInstitutionAdmin,
        hasInstitutionalAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for checking if a user can access content
export function useContentAccess() {
  const { isAuthenticated, hasInstitutionalAccess } = useAuth();

  return {
    canAccessFreeContent: true,
    canAccessPaidContent: isAuthenticated && hasInstitutionalAccess,
    isAuthenticated,
  };
}
