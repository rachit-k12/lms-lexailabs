import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Text,
  Button,
  Icon,
  CourseBanner,
  CourseContentAccordion,
  InstructorSection,
  WhatYoullLearnSection,
} from "@/components";
import { getCourseById, courses } from "@/lib/data";

// ============================================================================
// Generate Static Params
// ============================================================================

export function generateStaticParams() {
  return courses.map((course) => ({
    id: course.id,
  }));
}

// ============================================================================
// Subscription CTA Card
// ============================================================================

interface SubscriptionCardProps {
  courseId: string;
  firstLessonId: string;
}

function SubscriptionCard({ courseId, firstLessonId }: SubscriptionCardProps) {
  return (
    <div className="sticky top-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <Text variant="body-sm" tone="tertiary" className="mb-1">
          Get full access
        </Text>
        <Text variant="heading-md">Included in subscription</Text>
      </div>

      <div className="mb-3">
        <Link href={`/learn/${courseId}/${firstLessonId}`}>
          <Button variant="primary" width="full" size="lg">
            Start Learning
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <Link href="/signup">
          <Button variant="outline" width="full" size="lg">
            Sign Up for Full Access
          </Button>
        </Link>
      </div>

      <div className="text-center mb-6">
        <Text variant="body-xs" tone="tertiary">
          Preview available - Sign up for certificates & progress tracking
        </Text>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <Text variant="label-sm" tone="tertiary" className="mb-4">
          This subscription includes
        </Text>
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <Icon name="check" size="sm" className="text-green-500" />
            <Text variant="body-sm" tone="secondary">All 8 courses</Text>
          </li>
          <li className="flex items-center gap-3">
            <Icon name="check" size="sm" className="text-green-500" />
            <Text variant="body-sm" tone="secondary">Lifetime access</Text>
          </li>
          <li className="flex items-center gap-3">
            <Icon name="check" size="sm" className="text-green-500" />
            <Text variant="body-sm" tone="secondary">Certificates of completion</Text>
          </li>
          <li className="flex items-center gap-3">
            <Icon name="check" size="sm" className="text-green-500" />
            <Text variant="body-sm" tone="secondary">Hands-on projects</Text>
          </li>
          <li className="flex items-center gap-3">
            <Icon name="check" size="sm" className="text-green-500" />
            <Text variant="body-sm" tone="secondary">Quizzes & assessments</Text>
          </li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// Course Includes Section
// ============================================================================

interface CourseIncludesProps {
  includes: { icon: string; label: string }[];
}

function CourseIncludesSection({ includes }: CourseIncludesProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        <Text variant="heading-md" className="mb-6">
          This course includes
        </Text>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {includes.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-lms-primary-50">
                <Icon name={item.icon as any} size="sm" className="text-lms-primary-600" />
              </div>
              <Text variant="body-sm" tone="secondary">
                {item.label}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  const course = getCourseById(id);

  if (!course) {
    notFound();
  }

  // Calculate total lessons
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  // Get first lesson ID for direct access
  const firstLessonId = course.modules[0]?.lessons[0]?.id || "l-1";

  // Map modules to CourseContentAccordion format
  const accordionModules = course.modules.map((module) => ({
    id: module.id,
    title: module.title,
    description: module.description,
    lessons: module.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      duration: lesson.duration,
      type: lesson.type as "video" | "article" | "quiz",
      isPreview: lesson.isPreview,
    })),
  }));

  return (
    <main>
      {/* Course Banner */}
      <CourseBanner
        title={course.title}
        description={course.longDescription || course.description}
        badge={course.category === "engineering" ? "Engineering" : "Non-Engineering"}
        badgeVariant={course.category === "engineering" ? "brand" : "coral"}
        image={course.thumbnail}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Courses", href: "/courses" },
          { label: course.title },
        ]}
        stats={{
          studentsCount: course.studentsCount,
          duration: course.duration,
          level: course.level,
          modulesCount: course.modules.length,
          lessonsCount: totalLessons,
        }}
      />

      {/* Main Content Area */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Left Column - Course Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* What You'll Learn */}
              <div className="rounded-2xl border border-gray-200 p-8">
                <Text variant="heading-md" className="mb-6">
                  What you&apos;ll learn
                </Text>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {course.learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        <Icon name="check" size="sm" className="text-green-500" />
                      </div>
                      <Text variant="body-sm" tone="secondary">
                        {outcome}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Content Accordion */}
              <CourseContentAccordion
                modules={accordionModules}
                courseId={id}
              />
            </div>

            {/* Right Column - Subscription Card */}
            <div className="lg:col-span-1">
              <SubscriptionCard courseId={id} firstLessonId={firstLessonId} />
            </div>
          </div>
        </div>
      </section>

      {/* Course Includes */}
      <CourseIncludesSection includes={course.includes} />

      {/* Instructor Section */}
      <InstructorSection
        name={course.instructor.name}
        role={course.instructor.role}
        bio={course.instructor.bio}
        avatar={course.instructor.avatar}
        credentials={[
          "Ph.D. in Computer Science from IIT Delhi",
          "Former AI Research Lead at Google",
          "Published 50+ research papers",
          "Trained 10,000+ students globally",
        ]}
        socials={[
          { platform: "linkedin", url: "https://linkedin.com/in/purugovind" },
          { platform: "twitter", url: "https://twitter.com/purugovind" },
          { platform: "github", url: "https://github.com/purugovind" },
        ]}
      />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-lms-primary-600 to-lms-primary-700">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Text variant="heading-lg" className="text-white mb-4">
            Ready to start learning?
          </Text>
          <Text variant="body-lg" className="text-white/80 max-w-2xl mx-auto mb-8">
            Get instant access to {course.title} and all other courses with a single subscription.
          </Text>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-lms-primary-600 shadow-sm hover:bg-gray-100 transition-colors"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </main>
  );
}
