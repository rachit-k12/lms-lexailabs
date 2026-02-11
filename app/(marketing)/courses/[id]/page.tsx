"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import {
  Text,
  Button,
  Icon,
  CourseBanner,
  CourseContentAccordion,
  InstructorSection,
  PaymentButton,
} from "@/components";
import { getCourseBySlug, getErrorMessage, type GetCourseDetailResponse } from "@/lib/api";
import { enrollInCourse } from "@/lib/api/user";
import { useAuth } from "@/lib/contexts/auth-context";
import { usePaymentStatus } from "@/lib/hooks";
import { instructor } from "@/lib/data";
import { toast } from "sonner";

// ============================================================================
// Subscription CTA Card
// ============================================================================

interface PaymentStatusData {
  hasAccess: boolean;
  accessType: "premium" | "institution" | null;
  isPremium: boolean;
  organization: string | null;
}

interface SubscriptionCardProps {
  courseSlug: string;
  firstLessonId: string | null;
  hasAccess: boolean;
  isAuthenticated: boolean;
  paymentStatus: PaymentStatusData | null;
  paymentLoading: boolean;
  onEnroll: () => void;
  isEnrolling: boolean;
  onPaymentSuccess: () => void;
}

function SubscriptionCard({
  courseSlug,
  firstLessonId,
  hasAccess,
  isAuthenticated,
  paymentStatus,
  paymentLoading,
  onEnroll,
  isEnrolling,
  onPaymentSuccess,
}: SubscriptionCardProps) {
  // User has premium access (paid or via institution)
  const hasPremiumAccess = paymentStatus?.hasAccess;

  return (
    <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <Text variant="body-sm" tone="tertiary" className="mb-1">
          Get full access
        </Text>
        <Text variant="heading-md">
          {hasPremiumAccess
            ? paymentStatus?.accessType === "institution"
              ? `Via ${paymentStatus.organization}`
              : "Premium Active"
            : "One-time payment"}
        </Text>
        {!hasPremiumAccess && (
          <Text variant="heading-lg" className="mt-2">
            ₹499
          </Text>
        )}
      </div>

      {/* User has access - show continue button */}
      {hasAccess && firstLessonId ? (
        <div className="mb-4">
          <Link href={`/learn/${courseSlug}/${firstLessonId}`}>
            <Button variant="primary" width="full" size="lg">
              Continue Learning
            </Button>
          </Link>
        </div>
      ) : hasPremiumAccess && firstLessonId ? (
        // Has premium but not enrolled in this specific course yet
        <div className="mb-4">
          <Button
            variant="primary"
            width="full"
            size="lg"
            onClick={onEnroll}
            disabled={isEnrolling}
          >
            {isEnrolling ? "Enrolling..." : "Start Course"}
          </Button>
        </div>
      ) : isAuthenticated ? (
        // Authenticated but no premium - show payment button
        <div className="mb-4">
          <PaymentButton
            variant="button"
            size="lg"
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={(error) => toast.error(error)}
            className="w-full"
          />
        </div>
      ) : (
        // Not authenticated - show preview/signup options
        <>
          {firstLessonId && (
            <div className="mb-3">
              <Link href={`/learn/${courseSlug}/${firstLessonId}`}>
                <Button variant="primary" width="full" size="lg">
                  Preview Course
                </Button>
              </Link>
            </div>
          )}
          <div className="mb-4">
            <Link href="/signup">
              <Button variant="outline" width="full" size="lg">
                Sign Up for Full Access
              </Button>
            </Link>
          </div>
        </>
      )}

      <div className="text-center mb-6">
        <Text variant="body-xs" tone="tertiary">
          {hasPremiumAccess
            ? "You have full access to all courses"
            : hasAccess
              ? "You have access to this course"
              : "One-time payment for lifetime access"}
        </Text>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <Text variant="label-sm" tone="tertiary" className="mb-4">
          Premium includes
        </Text>
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <Icon name="check" size="sm" className="text-green-500" />
            <Text variant="body-sm" tone="secondary">All courses</Text>
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

interface CourseIncludesObject {
  articles?: number;
  exercises?: number;
  resources?: number;
  videoHours?: number;
  certificate?: boolean;
  lifetimeAccess?: boolean;
}

interface CourseIncludesProps {
  includes: CourseIncludesObject | string[] | null | undefined;
}

function CourseIncludesSection({ includes }: CourseIncludesProps) {
  if (!includes) return null;

  const iconMap: Record<string, string> = {
    video: "play",
    article: "docs",
    exercise: "code",
    resource: "download",
    certificate: "certificate",
    lifetime: "infinity",
    default: "check",
  };

  // Transform object format to display items
  let displayItems: { label: string; icon: string }[] = [];

  if (Array.isArray(includes)) {
    // Handle legacy array format
    displayItems = includes.map((item) => {
      const iconKey = Object.keys(iconMap).find((key) =>
        item.toLowerCase().includes(key)
      ) || "default";
      return { label: item, icon: iconMap[iconKey] };
    });
  } else {
    // Handle object format from API
    if (includes.videoHours && includes.videoHours > 0) {
      displayItems.push({ label: `${includes.videoHours} hours of video`, icon: iconMap.video });
    }
    if (includes.articles && includes.articles > 0) {
      displayItems.push({ label: `${includes.articles} articles`, icon: iconMap.article });
    }
    if (includes.exercises && includes.exercises > 0) {
      displayItems.push({ label: `${includes.exercises} exercises`, icon: iconMap.exercise });
    }
    if (includes.resources && includes.resources > 0) {
      displayItems.push({ label: `${includes.resources} resources`, icon: iconMap.resource });
    }
    if (includes.certificate) {
      displayItems.push({ label: "Certificate of completion", icon: iconMap.certificate });
    }
    if (includes.lifetimeAccess) {
      displayItems.push({ label: "Lifetime access", icon: iconMap.lifetime });
    }
  }

  if (displayItems.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        <Text variant="heading-md" className="mb-6">
          This course includes
        </Text>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {displayItems.map((item, index) => (
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
// Loading Skeleton
// ============================================================================

function CourseDetailSkeleton() {
  return (
    <main>
      <div className="bg-gradient-to-br from-gray-100 to-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-48 rounded bg-gray-200" />
            <div className="h-8 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-full max-w-2xl rounded bg-gray-200" />
            <div className="h-4 w-1/2 rounded bg-gray-200" />
          </div>
        </div>
      </div>
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
              <div className="h-96 animate-pulse rounded-xl bg-gray-100" />
            </div>
            <div className="h-96 animate-pulse rounded-xl bg-gray-100" />
          </div>
        </div>
      </section>
    </main>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id: slug } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { status: paymentStatus, loading: paymentLoading, refetch: refetchPayment } = usePaymentStatus();

  const [courseData, setCourseData] = useState<GetCourseDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const fetchCourse = async () => {
    try {
      const data = await getCourseBySlug(slug);
      setCourseData(data);
    } catch (err) {
      const message = getErrorMessage(err);
      if (message.includes("not found")) {
        setError("Course not found");
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/courses/${slug}`)}`);
      return;
    }

    setIsEnrolling(true);
    try {
      await enrollInCourse(slug);
      toast.success("Enrolled successfully!");
      // Refresh course data to get updated hasAccess
      const data = await getCourseBySlug(slug);
      setCourseData(data);
    } catch (err) {
      const message = getErrorMessage(err);
      if (message.includes("Already enrolled")) {
        toast.info("You're already enrolled in this course");
      } else if (message.includes("Payment required")) {
        // User needs to pay - this shouldn't happen if UI is correct
        toast.error("Premium access required. Please upgrade to continue.");
      } else {
        toast.error(message);
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const handlePaymentSuccess = async () => {
    toast.success("Payment successful! You now have premium access.");
    await refetchPayment();
    await fetchCourse();
  };

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (error === "Course not found" || !courseData) {
    notFound();
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Text variant="heading-md" className="mb-2">Something went wrong</Text>
          <Text variant="body-md" tone="secondary">{error}</Text>
        </div>
      </div>
    );
  }

  const { course, modules, hasAccess } = courseData;

  // Calculate total lessons
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  // Get first lesson ID for direct access
  const firstLessonId = modules[0]?.lessons[0]?.id || null;

  // Map modules to CourseContentAccordion format
  const accordionModules = modules.map((module) => ({
    id: module.id,
    title: module.title,
    description: module.description,
    lessons: module.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      duration: lesson.videoDurationMinutes ? `${lesson.videoDurationMinutes} min` : undefined,
      type: lesson.type as "video" | "article" | "quiz",
      isPreview: lesson.isPreview,
    })),
  }));

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

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
          duration: formatDuration(course.totalDurationMinutes),
          level: course.level,
          modulesCount: course.totalModules,
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
              {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                <div className="rounded-2xl border border-gray-200 p-8">
                  <Text variant="heading-md" className="mb-6">
                    What you&apos;ll learn
                  </Text>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {course.whatYouWillLearn.map((outcome, index) => (
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
              )}

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="rounded-2xl border border-gray-200 p-8">
                  <Text variant="heading-md" className="mb-6">
                    Prerequisites
                  </Text>
                  <ul className="space-y-3">
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          <Icon name="arrow-right" size="sm" className="text-gray-400" />
                        </div>
                        <Text variant="body-sm" tone="secondary">
                          {prereq}
                        </Text>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Course Content Accordion */}
              <CourseContentAccordion
                modules={accordionModules}
                courseId={slug}
              />
            </div>

            {/* Right Column - Subscription Card */}
            <div className="lg:col-span-1">
              <SubscriptionCard
                courseSlug={slug}
                firstLessonId={firstLessonId}
                hasAccess={hasAccess}
                isAuthenticated={isAuthenticated}
                paymentStatus={paymentStatus}
                paymentLoading={paymentLoading}
                onEnroll={handleEnroll}
                isEnrolling={isEnrolling}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Course Includes */}
      <CourseIncludesSection includes={course.includes} />

      {/* Instructor Section - Use static instructor data */}
      <InstructorSection
        name={instructor.name}
        role={instructor.role}
        bio={instructor.bio}
        avatar={instructor.avatar}
        credentials={instructor.credentials}
        bioPoints={instructor.bioPoints}
        socials={instructor.socials}
      />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-lms-primary-600 to-lms-primary-700">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Text variant="heading-lg" className="text-white mb-4">
            Ready to start learning?
          </Text>
          <Text variant="body-lg" className="text-white/80 max-w-2xl mx-auto mb-8">
            Get instant access to {course.title} and all other courses with a one-time payment.
          </Text>
          {hasAccess && firstLessonId ? (
            <Link
              href={`/learn/${slug}/${firstLessonId}`}
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-lms-primary-600 shadow-sm hover:bg-gray-100 transition-colors"
            >
              Continue Learning
            </Link>
          ) : paymentStatus?.hasAccess && firstLessonId ? (
            <button
              onClick={handleEnroll}
              disabled={isEnrolling}
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-lms-primary-600 shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isEnrolling ? "Enrolling..." : "Start Course"}
            </button>
          ) : isAuthenticated ? (
            <PaymentButton
              variant="button"
              size="lg"
              onPaymentSuccess={handlePaymentSuccess}
              className="!bg-white !text-lms-primary-600 hover:!bg-gray-100"
            />
          ) : (
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-lms-primary-600 shadow-sm hover:bg-gray-100 transition-colors"
            >
              Sign Up to Get Premium
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
