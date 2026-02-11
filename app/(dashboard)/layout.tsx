"use client";

import { usePathname, useRouter } from "next/navigation";
import { LmsNavbar, Footer } from "@/components";
import { useAuth } from "@/lib/contexts/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const navItems = [
    { label: "Courses", href: "/courses", isActive: pathname.startsWith("/courses") },
    { label: "My Learning", href: "/my-learning", isActive: pathname.startsWith("/my-learning") },
  ];

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-lms-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <LmsNavbar
          navItems={navItems}
          isLoggedIn={isAuthenticated}
          user={user ? {
            name: user.name,
            email: user.email,
            avatar: user.image || undefined,
          } : undefined}
          onGetStarted={() => router.push("/signup")}
          onLogin={() => router.push("/login")}
          onLogout={logout}
          variant="default"
        />
      </div>
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
