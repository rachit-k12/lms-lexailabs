"use client";

import * as React from "react";
import { Text, Button, Icon } from "@/components";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface LessonInfo {
  id: string;
  title: string;
  type: "video" | "article" | "quiz";
}

export interface LessonNavigationProps {
  /** Previous lesson info */
  previousLesson?: LessonInfo;
  /** Next lesson info */
  nextLesson?: LessonInfo;
  /** Handler for previous lesson click */
  onPreviousClick?: () => void;
  /** Handler for next lesson click */
  onNextClick?: () => void;
  /** Handler for marking lesson as complete */
  onMarkComplete?: () => void;
  /** Whether the current lesson is completed */
  isCompleted?: boolean;
  /** Additional class names */
  className?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getLessonTypeLabel(type: LessonInfo["type"]): string {
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

// ============================================================================
// Component
// ============================================================================

export function LessonNavigation({
  previousLesson,
  nextLesson,
  onPreviousClick,
  onNextClick,
  onMarkComplete,
  isCompleted = false,
  className,
}: LessonNavigationProps) {
  return (
    <div
      className={cn(
        "bg-white px-tatva-8 py-tatva-6",
        className
      )}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-tatva-4">
        {/* Previous Lesson */}
        <div className="flex-1">
          {previousLesson ? (
            <button
              onClick={onPreviousClick}
              className="group flex items-center gap-tatva-3 rounded-xl border border-gray-200 p-tatva-3 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              <div className="flex size-tatva-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors group-hover:border-lms-primary-500">
                <Icon name="chevron-left" size="sm" tone="secondary" />
              </div>
              <div className="text-left">
                <Text variant="label-sm" tone="tertiary">
                  Previous {getLessonTypeLabel(previousLesson.type)}
                </Text>
                <Text variant="body-sm" className="line-clamp-1">
                  {previousLesson.title}
                </Text>
              </div>
            </button>
          ) : (
            <div />
          )}
        </div>

        {/* Mark Complete Button */}
        {onMarkComplete && (
          <div className="shrink-0">
            <Button
              variant={isCompleted ? "outline" : "primary"}
              size="md"
              onClick={onMarkComplete}
              icon={isCompleted ? "check" : undefined}
            >
              {isCompleted ? "Completed" : "Mark as Complete"}
            </Button>
          </div>
        )}

        {/* Next Lesson */}
        <div className="flex flex-1 justify-end">
          {nextLesson ? (
            <button
              onClick={onNextClick}
              className="group flex items-center gap-tatva-3 rounded-xl border border-gray-200 p-tatva-3 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              <div className="text-right">
                <Text variant="label-sm" tone="tertiary">
                  Next {getLessonTypeLabel(nextLesson.type)}
                </Text>
                <Text variant="body-sm" className="line-clamp-1">
                  {nextLesson.title}
                </Text>
              </div>
              <div className="flex size-tatva-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors group-hover:border-lms-primary-500">
                <Icon name="chevron-right" size="sm" tone="secondary" />
              </div>
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Compact Variant - For use within content area
// ============================================================================

export function LessonNavigationCompact({
  previousLesson,
  nextLesson,
  onPreviousClick,
  onNextClick,
  className,
}: Omit<LessonNavigationProps, "onMarkComplete" | "isCompleted">) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-tatva-4 py-tatva-6",
        className
      )}
    >
      {/* Previous */}
      {previousLesson ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousClick}
          icon="chevron-left"
        >
          Previous
        </Button>
      ) : (
        <div />
      )}

      {/* Next */}
      {nextLesson ? (
        <Button
          variant="primary"
          size="sm"
          onClick={onNextClick}
          icon="chevron-right"
          iconPosition="right"
        >
          Next Lesson
        </Button>
      ) : (
        <Button variant="primary" size="sm" disabled>
          Course Complete
        </Button>
      )}
    </div>
  );
}

export default LessonNavigation;
