"use client";

import { usePathname, useRouter } from "next/navigation";
import { LmsNavbar, Footer } from "@/components";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
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
              onGetStarted={() => router.push("/signup")}
              onLogin={() => router.push("/login")}
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
              onGetStarted={() => router.push("/signup")}
              onLogin={() => router.push("/login")}
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
