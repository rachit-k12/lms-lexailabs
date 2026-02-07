"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Text,
  Icon,
  Button,
  ModuleTimeline,
  VideoPlayer,
  TableOfContents,
  LessonNavigation,
  MarkdownContent,
} from "@/components";
import {
  getCourseById,
  getLessonById,
  getAdjacentLessons,
  lessonContent,
} from "@/lib/data";
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
// Main Component
// ============================================================================

export default function LearningView({ params }: LearningViewProps) {
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<{ courseId: string; lessonId: string } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  // Resolve params
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Get course and lesson data
  const { course, lesson, adjacentLessons, content, tocItems, timelineModules, progress } = useMemo(() => {
    if (!resolvedParams) return { course: null, lesson: null, adjacentLessons: { prev: undefined, next: undefined }, content: "", tocItems: [] as TocItem[], timelineModules: [] as any[], progress: 0 };

    const { courseId, lessonId } = resolvedParams;
    const course = getCourseById(courseId);
    const lesson = getLessonById(courseId, lessonId);
    const adjacentLessons = getAdjacentLessons(courseId, lessonId);
    const content = lessonContent[lessonId] || `# ${lesson?.title || "Lesson"}\n\nContent for this lesson is coming soon.`;
    const tocItems = extractTocFromMarkdown(content);

    // Transform modules for timeline
    const timelineModules = course?.modules.map((module) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      lessons: module.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        duration: l.duration,
        type: l.type as "video" | "article" | "quiz",
        isCompleted: completedLessons.has(l.id),
        isLocked: false,
      })),
    })) || [];

    // Calculate progress
    const totalLessons = course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0;
    const progress = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;

    return { course, lesson, adjacentLessons, content, tocItems, timelineModules, progress };
  }, [resolvedParams, completedLessons]);

  // Handle lesson navigation
  const handleLessonClick = (lessonId: string) => {
    if (resolvedParams) {
      router.push(`/learn/${resolvedParams.courseId}/${lessonId}`);
    }
  };

  const handlePreviousClick = () => {
    if (adjacentLessons.prev && resolvedParams) {
      router.push(`/learn/${resolvedParams.courseId}/${adjacentLessons.prev.id}`);
    }
  };

  const handleNextClick = () => {
    if (adjacentLessons.next && resolvedParams) {
      router.push(`/learn/${resolvedParams.courseId}/${adjacentLessons.next.id}`);
    }
  };

  const handleMarkComplete = () => {
    if (resolvedParams) {
      setCompletedLessons((prev) => {
        const next = new Set(prev);
        if (next.has(resolvedParams.lessonId)) {
          next.delete(resolvedParams.lessonId);
        } else {
          next.add(resolvedParams.lessonId);
        }
        return next;
      });
    }
  };

  // Loading state
  if (!resolvedParams || !course || !lesson) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="size-12 animate-spin rounded-full border-4 border-gray-200 border-t-lms-primary-600 mx-auto mb-4" />
          <Text variant="body-md" tone="secondary">Loading lesson...</Text>
        </div>
      </div>
    );
  }

  const isCurrentLessonCompleted = completedLessons.has(resolvedParams.lessonId);
  const isVideoLesson = lesson.type === "video";

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Module Timeline (30%) - Hidden on mobile */}
      <div className="hidden md:flex md:w-[30%] flex-col border-r border-gray-200 bg-white">
        {/* Back to course header */}
        <div className="p-4 border-b border-gray-200">
          <Link
            href={`/courses/${resolvedParams.courseId}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Icon name="chevron-left" size="sm" />
            <Text variant="label-sm">Back to course</Text>
          </Link>
        </div>

        {/* Module Timeline - has its own progress bar */}
        <div className="flex-1 overflow-y-auto">
          <ModuleTimeline
            modules={timelineModules}
            courseTitle={course.title}
            activeLessonId={resolvedParams.lessonId}
            onLessonClick={handleLessonClick}
            progress={progress}
            collapsed={false}
            className="border-none w-full"
          />
        </div>
      </div>

      {/* Center Content (45%) */}
      <div className="flex-1 md:w-[45%] overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
          <Link
            href={`/courses/${resolvedParams.courseId}`}
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
                lesson.type === "article" ? "bg-lms-coral-50 text-lms-coral-600" :
                "bg-amber-50 text-amber-600"
              }`}>
                {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
              </span>
              <Text variant="body-sm" tone="tertiary">{lesson.duration}</Text>
            </div>
          </div>

          {/* Video Player (for video lessons) */}
          {isVideoLesson && (
            <div className="mb-8">
              <VideoPlayer
                src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                poster={course.thumbnail}
                title={lesson.title}
                onEnded={() => {
                  if (!isCurrentLessonCompleted) {
                    handleMarkComplete();
                  }
                }}
              />
            </div>
          )}

          {/* Lesson Title as Notes Header */}
          <div className="mb-6">
            <Text variant="heading-md">{lesson.title}</Text>
          </div>

          {/* Markdown Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <MarkdownContent content={content} />
          </div>

          {/* Bottom Navigation - NOT sticky, scrolls with content */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <LessonNavigation
              previousLesson={adjacentLessons.prev ? {
                id: adjacentLessons.prev.id,
                title: adjacentLessons.prev.title,
                type: adjacentLessons.prev.type as "video" | "article" | "quiz",
              } : undefined}
              nextLesson={adjacentLessons.next ? {
                id: adjacentLessons.next.id,
                title: adjacentLessons.next.title,
                type: adjacentLessons.next.type as "video" | "article" | "quiz",
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
