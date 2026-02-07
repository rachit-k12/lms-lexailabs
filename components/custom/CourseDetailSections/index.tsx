"use client";

import Image from "next/image";
import { Text, Icon, Badge } from "@/components";
import { cn } from "@/lib/utils";
import type { IconName } from "@/ui/lib/icons";

// ============================================================================
// TrustedBy Section
// ============================================================================

export interface TrustedByLogo {
  name: string;
  logo: string;
}

export interface TrustedBySectionProps {
  /** Section title */
  title?: string;
  /** Company/University logos */
  logos: TrustedByLogo[];
  /** Additional class names */
  className?: string;
}

export function TrustedBySection({
  title = "Learners from top companies and universities",
  logos,
  className,
}: TrustedBySectionProps) {
  return (
    <section className={cn("bg-tatva-background-primary py-tatva-12", className)}>
      <div className="mx-auto max-w-7xl px-tatva-8">
        <div className="mb-tatva-8 text-center">
          <Text variant="body-md" tone="tertiary">
            {title}
          </Text>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-tatva-12">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            >
              <Image
                src={logo.logo}
                alt={logo.name}
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// WhatYoullLearn Section
// ============================================================================

export interface WhatYoullLearnSectionProps {
  /** Section title */
  title?: string;
  /** Learning outcomes list */
  outcomes: string[];
  /** Additional class names */
  className?: string;
}

export function WhatYoullLearnSection({
  title = "What you'll learn",
  outcomes,
  className,
}: WhatYoullLearnSectionProps) {
  // Split outcomes into two columns
  const midpoint = Math.ceil(outcomes.length / 2);
  const leftColumn = outcomes.slice(0, midpoint);
  const rightColumn = outcomes.slice(midpoint);

  return (
    <section className={cn("bg-tatva-background-primary py-tatva-12", className)}>
      <div className="mx-auto max-w-7xl px-tatva-8">
        <div className="rounded-tatva-xl border border-tatva-border p-tatva-8">
          <div className="mb-tatva-6">
            <Text variant="heading-md">
              {title}
            </Text>
          </div>
          <div className="grid grid-cols-1 gap-tatva-4 md:grid-cols-2 md:gap-tatva-8">
            {/* Left Column */}
            <div className="space-y-tatva-4">
              {leftColumn.map((outcome, index) => (
                <div key={index} className="flex items-start gap-tatva-3">
                  <div className="mt-0.5 shrink-0">
                    <Icon name="check" size="sm" tone="success" />
                  </div>
                  <Text variant="body-sm" tone="secondary">
                    {outcome}
                  </Text>
                </div>
              ))}
            </div>
            {/* Right Column */}
            <div className="space-y-tatva-4">
              {rightColumn.map((outcome, index) => (
                <div key={index} className="flex items-start gap-tatva-3">
                  <div className="mt-0.5 shrink-0">
                    <Icon name="check" size="sm" tone="success" />
                  </div>
                  <Text variant="body-sm" tone="secondary">
                    {outcome}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CourseIncludes Section
// ============================================================================

export interface CourseIncludesItem {
  icon: IconName;
  label: string;
  value: string;
}

export interface CourseIncludesSectionProps {
  /** Section title */
  title?: string;
  /** Course includes items */
  items: CourseIncludesItem[];
  /** Additional class names */
  className?: string;
}

export function CourseIncludesSection({
  title = "This course includes",
  items,
  className,
}: CourseIncludesSectionProps) {
  return (
    <section className={cn("bg-tatva-background-primary py-tatva-12", className)}>
      <div className="mx-auto max-w-7xl px-tatva-8">
        <div className="mb-tatva-6">
          <Text variant="heading-md">
            {title}
          </Text>
        </div>
        <div className="grid grid-cols-2 gap-tatva-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-tatva-3 rounded-tatva-lg border border-tatva-border bg-tatva-background-secondary/50 p-tatva-4"
            >
              <Icon name={item.icon} size="md" tone="secondary" />
              <div>
                <Text variant="body-sm" tone="default">
                  {item.value}
                </Text>
                <Text variant="body-xs" tone="tertiary">
                  {item.label}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CourseStats Bar (Rating + Students + Premium badge)
// ============================================================================

export interface CourseStatsBarProps {
  /** Average rating */
  rating?: {
    score: number;
    count: number;
  };
  /** Number of students enrolled */
  studentsCount?: number;
  /** Whether to show premium badge */
  isPremium?: boolean;
  /** Additional class names */
  className?: string;
}

export function CourseStatsBar({
  rating,
  studentsCount,
  isPremium = false,
  className,
}: CourseStatsBarProps) {
  return (
    <div className={cn("flex items-center gap-tatva-8 rounded-tatva-lg border border-tatva-border bg-tatva-background-secondary/50 px-tatva-8 py-tatva-6", className)}>
      {isPremium && (
        <div className="flex items-center gap-tatva-3 border-r border-tatva-border pr-tatva-8">
          <div className="flex size-12 items-center justify-center rounded-tatva-lg bg-tatva-brand-primary">
            <Icon name="check" size="md" tone="inverse" />
          </div>
          <div>
            <Text variant="label-sm" tone="default">
              Premium
            </Text>
            <Text variant="body-xs" tone="tertiary">
              Full access included
            </Text>
          </div>
        </div>
      )}

      {rating && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-tatva-1">
            <Text variant="heading-md">
              {rating.score.toFixed(1)}
            </Text>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  name="favourite"
                  size="xs"
                  tone={star <= Math.round(rating.score) ? "warning" : "tertiary"}
                />
              ))}
            </div>
          </div>
          <Text variant="body-xs" tone="tertiary">
            {rating.count.toLocaleString()} ratings
          </Text>
        </div>
      )}

      {studentsCount !== undefined && (
        <div className="text-center">
          <Text variant="heading-md">
            {studentsCount.toLocaleString()}
          </Text>
          <Text variant="body-xs" tone="tertiary">
            learners
          </Text>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default {
  TrustedBySection,
  WhatYoullLearnSection,
  CourseIncludesSection,
  CourseStatsBar,
};
