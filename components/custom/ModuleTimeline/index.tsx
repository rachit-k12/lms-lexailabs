"use client";

import * as React from "react";
import { useState } from "react";
import { Text, Icon } from "@/components";
import { cn } from "@/lib/utils";
import type { IconName } from "@/ui/lib/icons";

// ============================================================================
// Types
// ============================================================================

export interface TimelineLesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "article" | "quiz";
  isCompleted?: boolean;
  isLocked?: boolean;
}

export interface TimelineModule {
  id: string;
  title: string;
  description?: string;
  lessons: TimelineLesson[];
}

export interface ModuleTimelineProps {
  /** Course title */
  courseTitle?: string;
  /** Course modules with lessons */
  modules: TimelineModule[];
  /** Currently active lesson ID */
  activeLessonId?: string;
  /** Handler when a lesson is clicked */
  onLessonClick?: (lessonId: string) => void;
  /** Overall course progress (0-100) */
  progress?: number;
  /** Whether the sidebar is collapsed */
  collapsed?: boolean;
  /** Toggle collapse handler */
  onToggleCollapse?: () => void;
  /** Additional class names */
  className?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getLessonIcon(type: TimelineLesson["type"]): IconName {
  switch (type) {
    case "video":
      return "play";
    case "article":
      return "docs";
    case "quiz":
      return "checkbox";
    default:
      return "play";
  }
}

function getLessonTypeLabel(type: TimelineLesson["type"]): string {
  switch (type) {
    case "video":
      return "Video";
    case "article":
      return "Article";
    case "quiz":
      return "Quiz";
    default:
      return "Lesson";
  }
}

function getLessonTypeColor(type: TimelineLesson["type"]): string {
  switch (type) {
    case "video":
      return "bg-lms-primary-50 text-lms-primary-600";
    case "article":
      return "bg-lms-coral-50 text-lms-coral-600";
    case "quiz":
      return "bg-amber-50 text-amber-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
}

function calculateModuleStats(lessons: TimelineLesson[]) {
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((l) => l.isCompleted).length;
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
      : `${totalMinutes}m`,
  };
}

// ============================================================================
// Component
// ============================================================================

export function ModuleTimeline({
  courseTitle,
  modules,
  activeLessonId,
  onLessonClick,
  progress = 0,
  collapsed = false,
  onToggleCollapse,
  className,
}: ModuleTimelineProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    // Auto-expand the module containing the active lesson
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

  // Calculate total stats
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.reduce((acc, m) => acc + m.lessons.filter(l => l.isCompleted).length, 0);

  if (collapsed) {
    return (
      <div
        className={cn(
          "flex h-full w-14 flex-col items-center border-r border-tatva-border bg-white py-4",
          className
        )}
      >
        <button
          onClick={onToggleCollapse}
          className="flex size-10 items-center justify-center rounded-lg bg-lms-primary-50 hover:bg-lms-primary-100 transition-colors"
        >
          <Icon name="chevron-right" size="sm" className="text-lms-primary-600" />
        </button>
        {/* Mini progress indicator */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="h-20 w-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="w-full rounded-full bg-lms-primary-500 transition-all"
              style={{ height: `${progress}%` }}
            />
          </div>
          <Text variant="body-xs" className="text-lms-primary-600 font-medium">
            {progress}%
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-80 flex-col border-r border-tatva-border bg-white",
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-tatva-border p-4">
        <div className="flex items-center justify-between mb-3">
          {courseTitle && (
            <Text variant="label-md" className="truncate flex-1">
              {courseTitle}
            </Text>
          )}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="ml-2 flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Icon name="chevron-left" size="sm" tone="tertiary" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Text variant="body-xs" tone="tertiary">
              {completedLessons} of {totalLessons} completed
            </Text>
            <Text variant="label-sm" className="text-lms-primary-600">
              {progress}%
            </Text>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-lms-primary-400 to-lms-primary-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto">
        {modules.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(module.id);
          const stats = calculateModuleStats(module.lessons);
          const hasActiveLesson = module.lessons.some(l => l.id === activeLessonId);
          const isCompleted = stats.completedLessons === stats.totalLessons;

          return (
            <div key={module.id} className="border-b border-tatva-border last:border-b-0">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3.5 transition-colors",
                  isExpanded ? "bg-gray-50" : "hover:bg-gray-50",
                  hasActiveLesson && !isExpanded && "border-l-3 border-lms-primary-500"
                )}
              >
                <Icon
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size="xs"
                  className={cn(
                    "shrink-0",
                    isCompleted ? "text-green-500" : "text-gray-400"
                  )}
                />

                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <div className="flex size-5 items-center justify-center rounded-full bg-green-100">
                        <Icon name="check" size="xs" className="text-green-600" />
                      </div>
                    )}
                    <Text variant="label-sm" className="truncate">
                      {module.title}
                    </Text>
                  </div>
                  {module.description && (
                    <Text variant="body-xs" tone="tertiary" className="truncate mt-0.5">
                      {module.description}
                    </Text>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Content type indicators */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    {stats.videoCount > 0 && (
                      <div className="flex items-center gap-0.5">
                        <Icon name="play" size="xs" className="text-lms-primary-400" />
                        <Text variant="body-xs" tone="tertiary">{stats.videoCount}</Text>
                      </div>
                    )}
                    {stats.articleCount > 0 && (
                      <div className="flex items-center gap-0.5">
                        <Icon name="docs" size="xs" className="text-lms-coral-400" />
                        <Text variant="body-xs" tone="tertiary">{stats.articleCount}</Text>
                      </div>
                    )}
                  </div>

                  {/* Progress */}
                  {stats.completedLessons > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-8 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-lms-primary-500 transition-all"
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
                  {stats.completedLessons === 0 && (
                    <Text variant="body-xs" tone="tertiary">
                      {stats.totalLessons} lessons
                    </Text>
                  )}
                </div>
              </button>

              {/* Lessons */}
              {isExpanded && (
                <div className="bg-white">
                  {module.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isLocked = lesson.isLocked;
                    const isCompleted = lesson.isCompleted;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => !isLocked && onLessonClick?.(lesson.id)}
                        disabled={isLocked}
                        className={cn(
                          "group flex w-full items-center gap-3 px-4 py-2.5 transition-all border-l-3",
                          isActive
                            ? "bg-lms-primary-50 border-lms-primary-500"
                            : "border-transparent hover:bg-gray-50",
                          isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                        )}
                      >
                        {/* Status Icon - Minimal */}
                        <div
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-full transition-all",
                            isCompleted
                              ? "bg-green-100"
                              : isLocked
                                ? "bg-gray-100"
                                : isActive
                                  ? "bg-lms-primary-100"
                                  : "bg-gray-100"
                          )}
                        >
                          {isCompleted ? (
                            <Icon name="check" size="xs" className="text-green-600" />
                          ) : isLocked ? (
                            <Icon name="lock" size="xs" className="text-gray-400" />
                          ) : (
                            <Icon
                              name={getLessonIcon(lesson.type)}
                              size="xs"
                              className={cn(
                                isActive ? "text-lms-primary-600" : "text-gray-500"
                              )}
                            />
                          )}
                        </div>

                        {/* Lesson title */}
                        <div className="flex-1 text-left min-w-0">
                          <Text
                            variant="body-sm"
                            className={cn(
                              "truncate",
                              isActive && "text-lms-primary-700 font-medium",
                              isCompleted && "text-gray-500",
                              isLocked && "text-gray-400"
                            )}
                          >
                            {lesson.title}
                          </Text>
                        </div>

                        {/* Duration only */}
                        <Text variant="body-xs" tone="tertiary" className="shrink-0">
                          {lesson.duration}
                        </Text>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ModuleTimeline;
