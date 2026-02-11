"use client";

import { useState, useMemo, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Text,
  Icon,
  ModuleTimeline,
  VideoPlayer,
  TableOfContents,
  LessonNavigation,
  MarkdownContent,
  PaymentButton,
} from "@/components";
import {
  getLesson,
  getErrorMessage,
  type GetLessonResponse,
} from "@/lib/api";
import { updateLessonProgress } from "@/lib/api/courses";
import { useAuth } from "@/lib/contexts/auth-context";
import { usePaymentStatus } from "@/lib/hooks";
import { toast } from "@/components";
import type { TocItem } from "@/components";

// ============================================================================
// Types
// ============================================================================

interface LearningViewProps {
  params: Promise<{ courseId: string; lessonId: string }>;
}

// ============================================================================
// Helper to extract TOC from markdown
// ============================================================================

function extractTocFromMarkdown(content: string): TocItem[] {
  const lines = content.split("\n");
  const toc: TocItem[] = [];

  for (const line of lines) {
    const h1Match = line.match(/^# (.+)$/);
    const h2Match = line.match(/^## (.+)$/);
    const h3Match = line.match(/^### (.+)$/);

    if (h1Match) {
      const title = h1Match[1];
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      toc.push({ id, title, level: 1 });
    } else if (h2Match) {
      const title = h2Match[1];
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      toc.push({ id, title, level: 2 });
    } else if (h3Match) {
      const title = h3Match[1];
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      toc.push({ id, title, level: 3 });
    }
  }

  return toc;
}

// ============================================================================
// Loading Skeleton
// ============================================================================

function LessonSkeleton() {
  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar Skeleton */}
      <div className="hidden md:flex md:w-[25%] flex-col border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Center Content Skeleton */}
      <div className="flex-1 md:w-[50%] p-8">
        <div className="space-y-4 mb-8">
          <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="aspect-video animate-pulse rounded-xl bg-gray-200 mb-8" />
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      {/* Right Sidebar Skeleton */}
      <div className="hidden lg:block lg:w-[25%] border-l border-gray-200 p-6">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 w-full animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function LearningView({ params }: LearningViewProps) {
  const { courseId, lessonId } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { status: paymentStatus, refetch: refetchPayment } = usePaymentStatus();

  const [lessonData, setLessonData] = useState<GetLessonResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  const handlePaymentSuccess = async () => {
    toast.success({ title: "Payment Successful!", description: "You now have premium access to all courses" });
    await refetchPayment();
    // Retry fetching the lesson
    setError(null);
    setIsLoading(true);
    try {
      const data = await getLesson(courseId, lessonId);
      setLessonData(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Track video progress
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedProgressRef = useRef<number>(0);

  // Fetch lesson data
  useEffect(() => {
    async function fetchLesson() {
      setIsLoading(true);
      try {
        const data = await getLesson(courseId, lessonId);
        setLessonData(data);

        // Initialize completed lessons from curriculum
        const completed = new Set<string>();
        data.curriculum.forEach((module) => {
          module.lessons.forEach((lesson) => {
            if (lesson.completed) {
              completed.add(lesson.id);
            }
          });
        });
        if (data.progress?.completed) {
          completed.add(lessonId);
        }
        setCompletedLessons(completed);
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLesson();

    // Cleanup progress tracking on unmount
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [courseId, lessonId]);

  // Handle video progress tracking
  const handleVideoProgress = (currentTime: number) => {
    if (!isAuthenticated) return;

    const seconds = Math.floor(currentTime);
    // Only save if progress increased by at least 10 seconds
    if (seconds - lastSavedProgressRef.current >= 10) {
      lastSavedProgressRef.current = seconds;
      // Fire and forget - don't await
      updateLessonProgress(courseId, lessonId, { watchedSeconds: seconds }).catch(() => {
        // Silently fail - progress tracking is best effort
      });
    }
  };

  // Handle lesson navigation
  const handleLessonClick = (targetLessonId: string) => {
    router.push(`/learn/${courseId}/${targetLessonId}`);
  };

  const handlePreviousClick = () => {
    if (lessonData?.navigation.previousLesson) {
      router.push(`/learn/${courseId}/${lessonData.navigation.previousLesson.id}`);
    }
  };

  const handleNextClick = () => {
    if (lessonData?.navigation.nextLesson) {
      router.push(`/learn/${courseId}/${lessonData.navigation.nextLesson.id}`);
    }
  };

  const handleMarkComplete = async () => {
    if (!isAuthenticated) {
      toast.error({ title: "Sign in required", description: "Please sign in to track your progress" });
      return;
    }

    setIsMarkingComplete(true);
    try {
      const isCurrentlyCompleted = completedLessons.has(lessonId);

      if (!isCurrentlyCompleted) {
        await updateLessonProgress(courseId, lessonId, { completed: true });
        setCompletedLessons((prev) => new Set([...prev, lessonId]));
        toast.success({ title: "Lesson Complete!", description: "Great progress! Keep it up" });
      }
    } catch (err) {
      toast.error({ title: "Failed to update progress", description: getErrorMessage(err) });
    } finally {
      setIsMarkingComplete(false);
    }
  };

  // Derived data
  const { content, tocItems, timelineModules, progress } = useMemo(() => {
    if (!lessonData) {
      return { content: "", tocItems: [] as TocItem[], timelineModules: [] as any[], progress: 0 };
    }

    const content = lessonData.lesson.articleContent || lessonData.lesson.content ||
      `# ${lessonData.lesson.title}\n\nContent for this lesson is coming soon.`;
    const tocItems = extractTocFromMarkdown(content);

    // Transform curriculum for timeline
    const timelineModules = lessonData.curriculum.map((module) => ({
      id: module.id,
      title: module.title,
      lessons: module.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        duration: l.durationMinutes ? `${l.durationMinutes} min` : undefined,
        type: l.type as "video" | "article" | "quiz",
        isCompleted: completedLessons.has(l.id),
        isLocked: false,
      })),
    }));

    // Calculate progress
    const totalLessons = lessonData.curriculum.reduce((acc, m) => acc + m.lessons.length, 0);
    const progress = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;

    return { content, tocItems, timelineModules, progress };
  }, [lessonData, completedLessons]);

  // Loading state
  if (isLoading) {
    return <LessonSkeleton />;
  }

  // Error state
  if (error || !lessonData) {
    const isPaymentError = error?.includes("Payment required") || error?.includes("premium");
    const isSubscriptionError = error === "Subscription required" || error?.includes("access") || error?.includes("subscription") || isPaymentError;

    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Icon name="alert-circle" size="lg" className="mx-auto mb-4 text-red-500" />
          <Text variant="heading-md" className="mb-2">
            {isPaymentError ? "Premium Access Required" : isSubscriptionError ? "Access Required" : "Unable to load lesson"}
          </Text>
          <Text variant="body-md" tone="secondary" className="mb-6">
            {isPaymentError
              ? "This lesson requires premium access. Unlock all courses with a one-time payment."
              : isSubscriptionError
                ? isAuthenticated
                  ? "You don't have access to this lesson. Please get premium access to continue."
                  : "This lesson requires enrollment. Please sign up or log in to access."
                : error || "Something went wrong. Please try again."}
          </Text>

          {/* Payment CTA for authenticated users */}
          {isSubscriptionError && isAuthenticated && !paymentStatus?.hasAccess && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-lms-primary-50 to-indigo-50 border border-lms-primary-200">
              <Text variant="heading-sm" className="mb-2">Unlock All Courses</Text>
              <Text variant="body-sm" tone="secondary" className="mb-4">
                One-time payment of ₹499 for lifetime access
              </Text>
              <PaymentButton
                variant="button"
                size="lg"
                onPaymentSuccess={handlePaymentSuccess}
                className="w-full"
              />
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Link href={`/courses/${courseId}`}>
              <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                Back to Course
              </button>
            </Link>
            {isSubscriptionError && !isAuthenticated && (
              <Link href="/signup">
                <button className="px-4 py-2 rounded-lg bg-lms-primary-600 text-white hover:bg-lms-primary-700 transition-colors">
                  Sign Up
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const { lesson, course, navigation } = lessonData;
  const isCurrentLessonCompleted = completedLessons.has(lessonId);
  const isVideoLesson = lesson.type === "video";

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Module Timeline (25%) - Hidden on mobile */}
      <div className="hidden md:flex md:w-[25%] flex-col border-r border-gray-200 bg-white">
        {/* Back to course header */}
        <div className="p-4 border-b border-gray-200">
          <Link
            href={`/courses/${courseId}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Icon name="chevron-left" size="sm" />
            <Text variant="label-sm">Back to course</Text>
          </Link>
        </div>

        {/* Module Timeline */}
        <div className="flex-1 overflow-y-auto">
          <ModuleTimeline
            modules={timelineModules}
            courseTitle={course.title}
            activeLessonId={lessonId}
            onLessonClick={handleLessonClick}
            progress={progress}
            collapsed={false}
            className="border-none w-full"
          />
        </div>
      </div>

      {/* Center Content (50%) */}
      <div className="flex-1 md:w-[50%] overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
          <Link
            href={`/courses/${courseId}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Icon name="chevron-left" size="sm" />
            <Text variant="label-sm">Back to course</Text>
          </Link>
        </div>

        <div className="px-6 py-8">
          {/* Lesson Header */}
          <div className="mb-6">
            <Text variant="display-sm" className="mb-2">{lesson.title}</Text>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                lesson.type === "video" ? "bg-lms-primary-50 text-lms-primary-600" :
                "bg-lms-coral-50 text-lms-coral-600"
              }`}>
                {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
              </span>
              {lesson.videoDurationMinutes && (
                <Text variant="body-sm" tone="tertiary">{lesson.videoDurationMinutes} min</Text>
              )}
            </div>
          </div>

          {/* Video Player (for video lessons) */}
          {isVideoLesson && lesson.videoUrl && (
            <div className="mb-8">
              <VideoPlayer
                src={lesson.videoUrl}
                title={lesson.title}
                onProgress={handleVideoProgress}
                onEnded={() => {
                  if (!isCurrentLessonCompleted) {
                    handleMarkComplete();
                  }
                }}
              />
            </div>
          )}

          {/* Lesson Notes */}
          {lesson.notes && (
            <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <Text variant="label-md" className="mb-3">Lesson Notes</Text>
              <div className="prose prose-sm max-w-none">
                <MarkdownContent content={lesson.notes} />
              </div>
            </div>
          )}

          {/* Resources */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="mb-8 rounded-xl border border-gray-200 p-6">
              <Text variant="label-md" className="mb-3">Resources</Text>
              <ul className="space-y-2">
                {lesson.resources.map((resource, index) => (
                  <li key={index}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-lms-primary-600 hover:underline"
                    >
                      <Icon name="download" size="sm" />
                      <span>{resource.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Markdown Content (for article lessons or additional content) */}
          {content && (
            <div className="prose prose-lg max-w-none mb-8">
              <MarkdownContent content={content} />
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <LessonNavigation
              previousLesson={navigation.previousLesson ? {
                id: navigation.previousLesson.id,
                title: navigation.previousLesson.title,
                type: "video" as const,
              } : undefined}
              nextLesson={navigation.nextLesson ? {
                id: navigation.nextLesson.id,
                title: navigation.nextLesson.title,
                type: "video" as const,
              } : undefined}
              onPreviousClick={handlePreviousClick}
              onNextClick={handleNextClick}
              onMarkComplete={handleMarkComplete}
              isCompleted={isCurrentLessonCompleted}
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Table of Contents (25%) - Hidden on smaller screens */}
      {tocItems.length > 0 && (
        <div className="hidden lg:block lg:w-[25%] shrink-0 border-l border-gray-200 bg-white p-6 overflow-y-auto">
          <TableOfContents items={tocItems} title="On this page" />
        </div>
      )}
    </div>
  );
}
