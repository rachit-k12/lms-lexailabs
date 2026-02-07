"use client";

import Image from "next/image";
import { Text, Badge, Avatar, Icon, Breadcrumbs } from "@/components";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface TopicTag {
  label: string;
  variant?: "brand" | "indigo" | "orange" | "green" | "pink" | "coral" | "yellow";
}

export interface CourseBannerProps {
  /** Course title */
  title: string;
  /** Course description */
  description: string;
  /** Course category/type badge (e.g., "Learning Path", "Course", "Certification") */
  badge?: string;
  /** Badge variant */
  badgeVariant?: "brand" | "indigo" | "orange" | "green" | "pink" | "coral" | "yellow";
  /** Topic tags for the course */
  tags?: TopicTag[];
  /** Course thumbnail/video preview image */
  image?: string;
  /** Breadcrumb items for navigation */
  breadcrumbs?: BreadcrumbItem[];
  /** Instructor information */
  instructor?: {
    name: string;
    avatar?: string;
  };
  /** Course stats */
  stats?: {
    studentsCount?: number;
    duration?: string;
    level?: "Beginner" | "Intermediate" | "Advanced";
    modulesCount?: number;
    lessonsCount?: number;
  };
  /** Additional class names */
  className?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return num.toString();
}

function getLevelColor(level: string): string {
  switch (level) {
    case "Beginner":
      return "text-lms-primary-600";
    case "Intermediate":
      return "text-lms-coral-600";
    case "Advanced":
      return "text-lms-coral-700";
    default:
      return "text-lms-primary-600";
  }
}

// ============================================================================
// Component
// ============================================================================

export function CourseBanner({
  title,
  description,
  badge,
  badgeVariant = "brand",
  tags,
  image,
  breadcrumbs,
  instructor,
  stats,
  className,
}: CourseBannerProps) {
  return (
    <section
      className={cn(
        "bg-tatva-background-primary",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-tatva-8 py-tatva-16">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-tatva-10">
            <Breadcrumbs
              items={breadcrumbs.map((item, index) => ({
                label: item.label,
                href: item.href,
                isActive: index === breadcrumbs.length - 1,
              }))}
              size="sm"
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-tatva-16 lg:grid-cols-5">
          {/* Content - takes 3 columns */}
          <div className="flex flex-col justify-center space-y-8 lg:col-span-3">
            {/* Badge + Tags Row */}
            {(badge || (tags && tags.length > 0)) && (
              <div className="flex flex-wrap items-center gap-tatva-3">
                {badge && (
                  <Badge variant={badgeVariant} size="md">
                    {badge}
                  </Badge>
                )}
                {tags && tags.map((tag, index) => (
                  <Badge key={index} variant={tag.variant || "default"} size="sm">
                    {tag.label}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <Text variant="display-sm">
              {title}
            </Text>

            {/* Description */}
            <div className="max-w-2xl">
              <Text variant="body-lg" tone="secondary">
                {description}
              </Text>
            </div>

            {/* Stats Row - Simple text with icons and dividers */}
            {stats && (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {stats.studentsCount !== undefined && (
                  <div className="flex items-center gap-tatva-2">
                    <Icon name="users" size="sm" className="text-lms-primary-500" />
                    <Text variant="body-md" tone="secondary">
                      {formatNumber(stats.studentsCount)} students
                    </Text>
                  </div>
                )}

                {stats.duration && (
                  <div className="flex items-center gap-tatva-2">
                    <Icon name="history" size="sm" className="text-lms-primary-500" />
                    <Text variant="body-md" tone="secondary">
                      {stats.duration}
                    </Text>
                  </div>
                )}

                {stats.level && (
                  <div className="flex items-center gap-tatva-2">
                    <Icon name="activity" size="sm" className="text-lms-coral-500" />
                    <Text variant="body-md" className={getLevelColor(stats.level)}>
                      {stats.level}
                    </Text>
                  </div>
                )}

                {stats.modulesCount !== undefined && (
                  <div className="flex items-center gap-tatva-2">
                    <Icon name="layers" size="sm" className="text-lms-primary-500" />
                    <Text variant="body-md" tone="secondary">
                      {stats.modulesCount} modules
                    </Text>
                  </div>
                )}

                {stats.lessonsCount !== undefined && (
                  <div className="flex items-center gap-tatva-2">
                    <Icon name="play" size="sm" className="text-lms-primary-500" />
                    <Text variant="body-md" tone="secondary">
                      {stats.lessonsCount} lessons
                    </Text>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Banner Image - takes 2 columns */}
          {image && (
            <div className="lg:col-span-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover rounded-3xl"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CourseBanner;
