"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Text,
  CourseCard,
  Divider,
} from "@/components";
import { getCourses, getErrorMessage, type CourseListItem } from "@/lib/api";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert category slug to readable title
 * e.g., "artificial-intelligence" -> "Artificial Intelligence"
 */
function formatCategoryTitle(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get category description based on category slug
 */
function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    "artificial-intelligence": "Master AI fundamentals and modern deep learning techniques",
    "engineering": "Technical skills for developers and engineers",
    "computer-vision": "Image processing, object detection, and visual AI",
    "ethics": "Responsible AI development, bias, and governance",
    "machine-learning": "Statistical learning and predictive modeling",
    "data-science": "Data analysis, visualization, and insights",
    "nlp": "Natural language processing and text analytics",
    "deep-learning": "Neural networks and advanced architectures",
  };

  return descriptions[category] || `Explore ${formatCategoryTitle(category)} courses`;
}

// ============================================================================
// Course Section Component
// ============================================================================

interface CourseSectionProps {
  title: string;
  subtitle: string;
  courses: CourseListItem[];
}

function CourseSection({ title, subtitle, courses }: CourseSectionProps) {
  if (courses.length === 0) return null;

  return (
    <div className="mb-16 last:mb-0">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 uppercase tracking-wide mb-2">
          {title}
        </h2>
        <Text variant="body-md" tone="secondary">
          {subtitle}
        </Text>
      </div>

      {/* Course Grid - Max 3 columns */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Link key={course.id} href={`/courses/${course.slug || course.id}`}>
            <CourseCard
              title={course.title}
              description={course.shortDescription || course.description}
              image={course.thumbnail}
              badge={course.level}
              studentsCount={course.studentsCount}
              coursesCount={course.totalModules}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Loading Skeleton
// ============================================================================

function CourseCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="aspect-video bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  );
}

function CourseSectionSkeleton() {
  return (
    <div className="mb-16">
      <div className="mb-8 space-y-2">
        <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-72 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getCourses({ limit: 50 });
        setCourses(data.courses);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
  }, []);

  // Group courses by category dynamically
  const coursesByCategory = useMemo(() => {
    const grouped: Record<string, CourseListItem[]> = {};

    courses.forEach((course) => {
      const category = course.category || "other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(course);
    });

    // Sort categories: featured courses first, then alphabetically
    const sortedCategories = Object.keys(grouped).sort((a, b) => {
      // Put categories with featured courses first
      const aHasFeatured = grouped[a].some((c) => c.isFeatured);
      const bHasFeatured = grouped[b].some((c) => c.isFeatured);
      if (aHasFeatured && !bHasFeatured) return -1;
      if (!aHasFeatured && bHasFeatured) return 1;
      return a.localeCompare(b);
    });

    return { grouped, sortedCategories };
  }, [courses]);

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Explore Our Courses
          </h1>
          <Text variant="body-lg" tone="secondary" className="max-w-7xl">
            Master the skills that matter in today&apos;s AI-driven world. Our comprehensive courses are designed by industry practitioners who understand what it takes to build production-ready systems.
          </Text>
        </div>
      </section>

      {/* Course Sections */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6">
          {/* Error State */}
          {error && (
            <div className="mb-8 rounded-lg bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <>
              <CourseSectionSkeleton />
              <Divider className="my-16" />
              <CourseSectionSkeleton />
            </>
          ) : courses.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-6">
                <svg
                  className="size-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <Text variant="heading-sm" className="mb-2">
                No courses available yet
              </Text>
              <Text variant="body-md" tone="secondary">
                Check back soon for new courses!
              </Text>
            </div>
          ) : (
            <>
              {/* Dynamic Course Sections by Category */}
              {coursesByCategory.sortedCategories.map((category, index) => (
                <div key={category}>
                  {index > 0 && <Divider className="my-16" />}
                  <CourseSection
                    title={`${formatCategoryTitle(category)} Courses`}
                    subtitle={getCategoryDescription(category)}
                    courses={coursesByCategory.grouped[category]}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
