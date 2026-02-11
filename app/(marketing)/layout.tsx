"use client";

import { usePathname, useRouter } from "next/navigation";
import { LmsNavbar, Footer } from "@/components";
import { useAuth } from "@/lib/contexts/auth-context";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const isHomePage = pathname === "/";

  const navItems = [
    { label: "Courses", href: "/courses", isActive: pathname.startsWith("/courses") },
    { label: "About", href: "/about", isActive: pathname === "/about" },
  ];

  return (
    <div className="w-full">
      {isHomePage ? (
        // On homepage, navbar is fixed at top
        <>
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
              variant="transparent"
            />
          </div>
          {children}
        </>
      ) : (
        // On other pages, navbar is fixed at top with background
        <>
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
          <div className="pt-16">
            {children}
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}
