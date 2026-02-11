"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Text, MetricCard, Button, Badge } from "@/components";
import { useAuth } from "@/lib/contexts/auth-context";
import { getCourses, getUsers, getOrganizations, getErrorMessage } from "@/lib/api";
import type { CourseListItem, AdminUser, Organization } from "@/lib/api";

interface DashboardStats {
  totalCourses: number;
  publishedCourses: number;
  totalUsers: number;
  totalOrganizations: number;
  activeOrganizations: number;
}

export default function AdminDashboard() {
  const { user, isAdmin, isInstitutionAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCourses, setRecentCourses] = useState<CourseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const dashboardStats: DashboardStats = {
          totalCourses: 0,
          publishedCourses: 0,
          totalUsers: 0,
          totalOrganizations: 0,
          activeOrganizations: 0,
        };

        // Fetch courses (for all admins)
        const coursesData = await getCourses({ limit: 5 });
        setRecentCourses(coursesData.courses);
        dashboardStats.totalCourses = coursesData.pagination.total;
        dashboardStats.publishedCourses = coursesData.courses.length;

        // Only platform admins can fetch users and organizations
        if (isAdmin) {
          try {
            const usersData = await getUsers({ limit: 1 });
            dashboardStats.totalUsers = usersData.pagination.total;
          } catch {
            // User might not have permissions
          }

          try {
            const orgsData = await getOrganizations();
            dashboardStats.totalOrganizations = orgsData.organizations.length;
            dashboardStats.activeOrganizations = orgsData.organizations.filter(
              (org) => org.isActive
            ).length;
          } catch {
            // User might not have permissions
          }
        }

        setStats(dashboardStats);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [isAdmin]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Text variant="heading-lg" className="mb-2">
          Welcome back, {user?.name?.split(" ")[0]}
        </Text>
        <Text variant="body-md" tone="secondary">
          {isAdmin
            ? "Manage your platform from here"
            : "Manage your institution from here"}
        </Text>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard heading="Total Courses" value={stats?.totalCourses || 0} />
        {isAdmin && (
          <>
            <MetricCard heading="Total Users" value={stats?.totalUsers || 0} />
            <MetricCard
              heading="Organizations"
              value={stats?.totalOrganizations || 0}
            />
            <MetricCard
              heading="Active Organizations"
              value={stats?.activeOrganizations || 0}
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Text variant="heading-sm" className="mb-4">
          Quick Actions
        </Text>
        <div className="flex flex-wrap gap-4">
          {isAdmin && (
            <>
              <Link href="/admin/courses/new">
                <Button variant="primary" icon="plus">
                  Create Course
                </Button>
              </Link>
              <Link href="/admin/organizations/new">
                <Button variant="secondary" icon="plus">
                  Add Organization
                </Button>
              </Link>
            </>
          )}
          {isInstitutionAdmin && !isAdmin && (
            <Link href="/admin/students/upload">
              <Button variant="primary" icon="upload">
                Upload Students
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Recent Courses */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <Text variant="heading-sm">Recent Courses</Text>
          <Link href="/admin/courses">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          {recentCourses.length === 0 ? (
            <div className="p-8 text-center">
              <Text variant="body-md" tone="secondary">
                No courses yet
              </Text>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/admin/courses/${course.slug}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="size-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="size-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Text variant="body-sm" tone="tertiary">
                          {course.title.charAt(0)}
                        </Text>
                      </div>
                    )}
                    <div>
                      <Text variant="body-md" className="font-medium">
                        {course.title}
                      </Text>
                      <Text variant="body-sm" tone="secondary">
                        {course.totalModules} modules &middot; {course.studentsCount} students
                      </Text>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      type="label"
                      variant={course.category === "engineering" ? "default" : "neutral"}
                      size="sm"
                    >
                      {course.category === "engineering" ? "Engineering" : "Non-Engineering"}
                    </Badge>
                    <Badge
                      type="label"
                      variant="neutral"
                      size="sm"
                    >
                      {course.level}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
