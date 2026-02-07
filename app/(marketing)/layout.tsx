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
    <div className="mx-auto max-w-[1920px]">
      {isHomePage ? (
        // On homepage, navbar is absolutely positioned over hero
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 z-50">
            <LmsNavbar
              navItems={navItems}
              onGetStarted={() => router.push("/signup")}
              onLogin={() => router.push("/login")}
              variant="transparent"
            />
          </div>
          {children}
        </div>
      ) : (
        // On other pages, navbar is in normal flow
        <>
          <LmsNavbar
            navItems={navItems}
            onGetStarted={() => router.push("/signup")}
            onLogin={() => router.push("/login")}
            variant="default"
          />
          {children}
        </>
      )}
      <Footer />
    </div>
  );
}
