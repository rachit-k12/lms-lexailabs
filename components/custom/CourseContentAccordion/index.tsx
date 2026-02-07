"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Text, Icon, Badge } from "@/components";
import { cn } from "@/lib/utils";
import type { IconName } from "@/ui/lib/icons";

// ============================================================================
// Types
// ============================================================================

export type LessonType = "video" | "article" | "quiz" | "assignment";
export type LessonStatus = "locked" | "available" | "in-progress" | "completed";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: LessonType;
  /** Whether this lesson is available for preview (free) */
  isPreview?: boolean;
  /** Lesson status */
  status?: LessonStatus;
}

export interface Module {
  id: string;
  title: string;
  /** Optional module description */
  description?: string;
  lessons: Lesson[];
}

export interface CourseContentAccordionProps {
  /** Course modules with lessons */
  modules: Module[];
  /** Course ID for navigation */
  courseId?: string;
  /** Currently active lesson ID */
  activeLessonId?: string;
  /** Handler when a lesson is clicked */
  onLessonClick?: (lessonId: string) => void;
  /** Handler when preview is clicked */
  onPreviewClick?: (lessonId: string) => void;
  /** Additional class names */
  className?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getLessonTypeIcon(type: LessonType): IconName {
  switch (type) {
    case "video":
      return "play";
    case "article":
      return "docs";
    case "quiz":
      return "checkbox";
    case "assignment":
      return "code";
    default:
      return "play";
  }
}

function getLessonTypeLabel(type: LessonType): string {
  switch (type) {
    case "video":
      return "Video";
    case "article":
      return "Article";
    case "quiz":
      return "Quiz";
    case "assignment":
      return "Assignment";
    default:
      return "Lesson";
  }
}

function getLessonTypeColor(type: LessonType): string {
  switch (type) {
    case "video":
      return "bg-lms-primary-50 text-lms-primary-600";
    case "article":
      return "bg-lms-coral-50 text-lms-coral-600";
    case "quiz":
      return "bg-amber-50 text-amber-600";
    case "assignment":
      return "bg-purple-50 text-purple-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
}

function calculateModuleStats(lessons: Lesson[]) {
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((l) => l.status === "completed").length;
  const totalMinutes = lessons.reduce((acc, lesson) => {
    const match = lesson.duration.match(/(\d+)/);
    return acc + (match ? parseInt(match[1], 10) : 0);
  }, 0);

  // Count by type
  const videoCount = lessons.filter(l => l.type === "video").length;
  const articleCount = lessons.filter(l => l.type === "article").length;
  const quizCount = lessons.filter(l => l.type === "quiz").length;

  return {
    totalLessons,
    completedLessons,
    videoCount,
    articleCount,
    quizCount,
    duration: totalMinutes >= 60
      ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
      : `${totalMinutes}min`,
  };
}

// ============================================================================
// Component
// ============================================================================

export function CourseContentAccordion({
  modules,
  courseId,
  activeLessonId,
  onLessonClick,
  onPreviewClick,
  className,
}: CourseContentAccordionProps) {
  const router = useRouter();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    // Auto-expand the module containing the active lesson, or first module
    if (activeLessonId) {
      const activeModule = modules.find((m) =>
        m.lessons.some((l) => l.id === activeLessonId)
      );
      return new Set(activeModule ? [activeModule.id] : [modules[0]?.id]);
    }
    return new Set([modules[0]?.id]);
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedModules(new Set(modules.map((m) => m.id)));
  };

  const collapseAll = () => {
    setExpandedModules(new Set());
  };

  const allExpanded = expandedModules.size === modules.length;

  // Calculate total stats
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalMinutes = modules.reduce((acc, m) => {
    return acc + m.lessons.reduce((lessonAcc, lesson) => {
      const match = lesson.duration.match(/(\d+)/);
      return lessonAcc + (match ? parseInt(match[1], 10) : 0);
    }, 0);
  }, 0);
  const totalDuration = totalMinutes >= 60
    ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
    : `${totalMinutes}min`;

  // Calculate content type totals
  const totalVideos = modules.reduce((acc, m) => acc + m.lessons.filter(l => l.type === "video").length, 0);
  const totalArticles = modules.reduce((acc, m) => acc + m.lessons.filter(l => l.type === "article").length, 0);
  const totalQuizzes = modules.reduce((acc, m) => acc + m.lessons.filter(l => l.type === "quiz").length, 0);

  return (
    <div className={className}>
      {/* Header with totals and expand button */}
      <div className="mb-tatva-8 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <Text variant="heading-md">
              Course Content
            </Text>
            <div className="mt-tatva-2">
              <Text variant="body-sm" tone="tertiary">
                {modules.length} sections • {totalLessons} lectures • {totalDuration} total length
              </Text>
            </div>
          </div>
          <button
            onClick={allExpanded ? collapseAll : expandAll}
            className="text-tatva-brand-primary hover:underline"
          >
            <Text variant="label-sm" tone="brand">
              {allExpanded ? "Collapse all sections" : "Expand all sections"}
            </Text>
          </button>
        </div>

        {/* Content type breakdown */}
        <div className="flex flex-wrap items-center gap-4">
          {totalVideos > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-md bg-lms-primary-100">
                <Icon name="play" size="xs" className="text-lms-primary-600" />
              </div>
              <Text variant="body-sm" tone="secondary">{totalVideos} videos</Text>
            </div>
          )}
          {totalArticles > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-md bg-lms-coral-100">
                <Icon name="docs" size="xs" className="text-lms-coral-600" />
              </div>
              <Text variant="body-sm" tone="secondary">{totalArticles} articles</Text>
            </div>
          )}
          {totalQuizzes > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-md bg-amber-100">
                <Icon name="checkbox" size="xs" className="text-amber-600" />
              </div>
              <Text variant="body-sm" tone="secondary">{totalQuizzes} quizzes</Text>
            </div>
          )}
        </div>
      </div>

      {/* Modules */}
      <div className="overflow-hidden rounded-tatva-xl border border-tatva-border">
        {modules.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(module.id);
          const stats = calculateModuleStats(module.lessons);
          const isFirstModule = moduleIndex === 0;

          return (
            <div key={module.id} className={cn(!isFirstModule && "border-t border-tatva-border")}>
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className={cn(
                  "flex w-full items-center justify-between px-tatva-6 py-tatva-5 transition-colors",
                  isExpanded ? "bg-tatva-background-secondary" : "bg-tatva-background-primary hover:bg-tatva-background-secondary/50"
                )}
              >
                <div className="flex items-center gap-tatva-4">
                  <Icon
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size="sm"
                    tone="secondary"
                  />
                  <div className="text-left">
                    <Text variant="label-md">
                      {module.title}
                    </Text>
                    {module.description && (
                      <div className="mt-1">
                        <Text variant="body-xs" tone="tertiary">
                          {module.description}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-tatva-4">
                  {/* Content type icons */}
                  <div className="hidden items-center gap-3 sm:flex">
                    {stats.videoCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Icon name="play" size="xs" className="text-lms-primary-500" />
                        <Text variant="body-xs" tone="tertiary">{stats.videoCount}</Text>
                      </div>
                    )}
                    {stats.articleCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Icon name="docs" size="xs" className="text-lms-coral-500" />
                        <Text variant="body-xs" tone="tertiary">{stats.articleCount}</Text>
                      </div>
                    )}
                    {stats.quizCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Icon name="checkbox" size="xs" className="text-amber-500" />
                        <Text variant="body-xs" tone="tertiary">{stats.quizCount}</Text>
                      </div>
                    )}
                  </div>
                  <Text variant="body-sm" tone="tertiary">
                    {stats.duration}
                  </Text>
                  {/* Progress indicator */}
                  {stats.completedLessons > 0 && (
                    <div className="flex items-center gap-tatva-2">
                      <div className="h-tatva-2 w-tatva-16 overflow-hidden rounded-tatva-full bg-tatva-background-tertiary">
                        <div
                          className="h-full rounded-tatva-full bg-lms-primary-500 transition-all"
                          style={{
                            width: `${(stats.completedLessons / stats.totalLessons) * 100}%`,
                          }}
                        />
                      </div>
                      <Text variant="body-xs" tone="tertiary">
                        {stats.completedLessons}/{stats.totalLessons}
                      </Text>
                    </div>
                  )}
                </div>
              </button>

              {/* Lessons List */}
              {isExpanded && (
                <ul className="bg-tatva-background-primary">
                  {module.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isLocked = lesson.status === "locked";
                    const isCompleted = lesson.status === "completed";
                    const isInProgress = lesson.status === "in-progress";

                    return (
                      <li key={lesson.id} className="border-t border-tatva-border">
                        <div
                          className={cn(
                            "flex items-center gap-tatva-4 px-tatva-6 py-tatva-4 transition-colors",
                            isActive && "bg-lms-primary-50 border-l-4 border-lms-primary-500",
                            isInProgress && !isActive && "bg-lms-primary-25",
                            isLocked && "opacity-50",
                            !isLocked && !isActive && "hover:bg-tatva-background-secondary/50"
                          )}
                        >
                          {/* Lesson Type/Status Icon */}
                          <div className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-tatva-lg transition-all",
                            isCompleted ? "bg-green-100" :
                            isLocked ? "bg-gray-100" :
                            getLessonTypeColor(lesson.type)
                          )}>
                            {isCompleted ? (
                              <Icon name="check" size="sm" className="text-green-600" />
                            ) : isLocked ? (
                              <Icon name="lock" size="sm" tone="tertiary" />
                            ) : (
                              <Icon name={getLessonTypeIcon(lesson.type)} size="sm" />
                            )}
                          </div>

                          {/* Lesson Content */}
                          <div className="min-w-0 flex-1">
                            <button
                              onClick={() => {
                                if (isLocked) return;
                                if (onLessonClick) {
                                  onLessonClick(lesson.id);
                                } else if (courseId) {
                                  router.push(`/learn/${courseId}/${lesson.id}`);
                                }
                              }}
                              disabled={isLocked}
                              className={cn(
                                "w-full text-left transition-colors",
                                !isLocked && "hover:text-lms-primary-600",
                                isLocked && "cursor-not-allowed"
                              )}
                            >
                              <Text
                                variant="body-sm"
                                tone={isActive ? "brand" : isCompleted ? "secondary" : "default"}
                                className={isActive ? "font-medium" : undefined}
                              >
                                {lesson.title}
                              </Text>
                            </button>
                            {/* Lesson type label for mobile */}
                            <div className="mt-1 flex items-center gap-2 sm:hidden">
                              <Text variant="body-xs" tone="tertiary">
                                {getLessonTypeLabel(lesson.type)} • {lesson.duration}
                              </Text>
                            </div>
                          </div>

                          {/* Right side: Type badge, Preview link + Duration */}
                          <div className="hidden items-center gap-tatva-4 sm:flex">
                            {/* Type badge */}
                            <span className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-medium",
                              getLessonTypeColor(lesson.type)
                            )}>
                              {getLessonTypeLabel(lesson.type)}
                            </span>

                            {/* Preview link */}
                            {lesson.isPreview && !isCompleted && !isLocked && (
                              <button
                                onClick={() => {
                                  if (onPreviewClick) {
                                    onPreviewClick(lesson.id);
                                  } else if (courseId) {
                                    router.push(`/learn/${courseId}/${lesson.id}`);
                                  }
                                }}
                                className="flex items-center gap-1 rounded-full bg-lms-coral-50 px-2.5 py-1 text-lms-coral-600 transition-colors hover:bg-lms-coral-100"
                              >
                                <Icon name="play" size="xs" className="text-lms-coral-600" />
                                <Text variant="label-sm" className="text-lms-coral-600">
                                  Preview
                                </Text>
                              </button>
                            )}

                            {/* Duration */}
                            <div className="w-14 text-right">
                              <Text variant="body-xs" tone="tertiary">
                                {lesson.duration}
                              </Text>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CourseContentAccordion;
