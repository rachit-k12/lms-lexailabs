import Link from "next/link";
import {
  Text,
  CourseCard,
  Divider,
} from "@/components";
import { getCoursesByCategory } from "@/lib/data";

// ============================================================================
// Course Section Component
// ============================================================================

interface CourseSectionProps {
  title: string;
  subtitle: string;
  courses: ReturnType<typeof getCoursesByCategory>;
}

function CourseSection({ title, subtitle, courses }: CourseSectionProps) {
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
        {courses.map((course, index) => {
            // Hardcode some progress values for demo
            let progress = 0;
            if (course.id === "ml-fundamentals") progress = 45; // In progress
            if (course.id === "python-data-science") progress = 100; // Completed

            return (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <CourseCard
                  title={course.title}
                  description={course.description}
                  image={course.thumbnail}
                  badge={course.level}
                  studentsCount={course.studentsCount}
                  coursesCount={course.modules.length}
                  progress={progress}
                />
              </Link>
            );
          })}
      </div>
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function CoursesPage() {
  const engineeringCourses = getCoursesByCategory("engineering"); // 5 courses
  const nonEngineeringCourses = getCoursesByCategory("non-engineering").slice(0, 3); // 3 courses

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
          {/* Non-Engineering Courses - First */}
          <CourseSection
            title="Non-Engineering Courses"
            subtitle="Business, strategy, and soft skills"
            courses={nonEngineeringCourses}
          />

          {/* Divider */}
          <Divider className="my-16" />

          {/* Engineering Courses */}
          <CourseSection
            title="Engineering Courses"
            subtitle="Technical skills for developers and engineers"
            courses={engineeringCourses}
          />
        </div>
      </section>
    </main>
  );
}
