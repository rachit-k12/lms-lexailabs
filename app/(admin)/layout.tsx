"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar, Text } from "@/components";
import { useAuth } from "@/lib/contexts/auth-context";
import type { SidebarMenuItem, SidebarMenuGroup } from "@/components";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading, isAdmin, isInstitutionAdmin } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-lms-primary-500 border-t-transparent" />
      </div>
    );
  }

  // Redirect non-admin users
  if (!isAuthenticated || (!isAdmin && !isInstitutionAdmin)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Text variant="heading-md" className="mb-2">Access Denied</Text>
          <Text variant="body-md" tone="secondary" className="mb-6">
            You do not have permission to access this area.
          </Text>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-lms-primary-600 px-4 py-2 text-white hover:bg-lms-primary-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Build menu items based on role
  const menuItems: (SidebarMenuItem | SidebarMenuGroup)[] = [];

  // Dashboard - available to all admins
  menuItems.push({
    label: "Dashboard",
    icon: "home",
    href: "/admin",
  });

  // Platform Admin only items
  if (isAdmin) {
    menuItems.push({
      label: "Content",
      items: [
        {
          label: "Courses",
          icon: "book-open",
          href: "/admin/courses",
        },
      ],
    } as SidebarMenuGroup);

    menuItems.push({
      label: "Platform",
      items: [
        {
          label: "Users",
          icon: "users",
          href: "/admin/users",
        },
        {
          label: "Organizations",
          icon: "building",
          href: "/admin/organizations",
        },
      ],
    } as SidebarMenuGroup);
  }

  // Institution Admin items
  if (isInstitutionAdmin && !isAdmin) {
    menuItems.push({
      label: "Institution",
      items: [
        {
          label: "Students",
          icon: "users",
          href: "/admin/students",
        },
        {
          label: "Course Access",
          icon: "book-open",
          href: "/admin/course-access",
        },
      ],
    } as SidebarMenuGroup);
  }

  const footerMenuItems: SidebarMenuItem[] = [
    {
      label: "Back to LMS",
      icon: "arrow-left",
      href: "/courses",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        header={{
          logo: "/logo.svg",
          logoAlt: "LexAI Labs Admin",
        }}
        menuItems={menuItems}
        footerMenuItems={footerMenuItems}
        activePath={pathname}
        linkComponent={Link}
        profile={{
          name: user?.name || "Admin",
          email: user?.email,
          avatar: user?.image || undefined,
          actions: [
            {
              label: "Logout",
              icon: "log-out",
              onClick: () => {
                logout();
                router.push("/login");
              },
            },
          ],
        }}
        className="border-r border-gray-200"
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
