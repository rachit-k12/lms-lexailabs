"use client";

import * as React from "react";
import { Text, Button, Icon, Divider } from "@/components";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface EnrollCardProps {
  /** Course price (0 for free) */
  price: number;
  /** Original price for discount display */
  originalPrice?: number;
  /** Whether the user is already enrolled */
  isEnrolled?: boolean;
  /** User's progress percentage (if enrolled) */
  progress?: number;
  /** Course stats */
  stats?: {
    videoHours?: number;
    modules?: number;
    chapters?: number;
    hasCertificate?: boolean;
  };
  /** Enroll button click handler */
  onEnroll?: () => void;
  /** Continue learning click handler */
  onContinue?: () => void;
  /** Sticky positioning */
  sticky?: boolean;
  /** Additional class names */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function EnrollCard({
  price,
  originalPrice,
  isEnrolled = false,
  progress = 0,
  stats,
  onEnroll,
  onContinue,
  sticky = true,
  className,
}: EnrollCardProps) {
  const isFree = price === 0;
  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <div
      className={cn(
        "rounded-tatva-lg border border-tatva-border bg-tatva-background-primary p-tatva-6",
        sticky && "sticky top-tatva-8",
        className
      )}
    >
      {/* Price Section */}
      <div className="mb-tatva-6">
        {isEnrolled ? (
          <div>
            <Text variant="label-sm" tone="tertiary" className="mb-tatva-2">
              Your Progress
            </Text>
            <div className="flex items-center gap-tatva-3">
              <div className="h-tatva-3 flex-1 overflow-hidden rounded-tatva-full bg-tatva-background-tertiary">
                <div
                  className="h-full rounded-tatva-full bg-tatva-brand-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <Text variant="body-sm" tone="secondary">
                {progress}%
              </Text>
            </div>
          </div>
        ) : (
          <div className="flex items-baseline gap-tatva-3">
            {isFree ? (
              <Text variant="heading-lg" className="text-tatva-positive-content">
                Free
              </Text>
            ) : (
              <>
                <Text variant="heading-lg">${price}</Text>
                {hasDiscount && (
                  <Text
                    variant="body-md"
                    tone="tertiary"
                    className="line-through"
                  >
                    ${originalPrice}
                  </Text>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <Button
        variant="primary"
        width="full"
        size="lg"
        onClick={isEnrolled ? onContinue : onEnroll}
        icon={isEnrolled ? "play" : undefined}
      >
        {isEnrolled
          ? progress === 0
            ? "Start Learning"
            : progress === 100
              ? "Review Course"
              : "Continue Learning"
          : isFree
            ? "Enroll for Free"
            : "Enroll Now"}
      </Button>

      {/* Stats */}
      {stats && (
        <>
          <Divider className="my-tatva-6" />
          <div>
            <Text variant="label-sm" tone="tertiary" className="mb-tatva-4">
              This course includes
            </Text>
            <ul className="space-y-tatva-3">
              {stats.videoHours && (
                <li className="flex items-center gap-tatva-3">
                  <Icon name="play" size="sm" tone="secondary" />
                  <Text variant="body-sm" tone="secondary">
                    {stats.videoHours} hours of video
                  </Text>
                </li>
              )}
              {stats.modules && (
                <li className="flex items-center gap-tatva-3">
                  <Icon name="layers" size="sm" tone="secondary" />
                  <Text variant="body-sm" tone="secondary">
                    {stats.modules} modules
                  </Text>
                </li>
              )}
              {stats.chapters && (
                <li className="flex items-center gap-tatva-3">
                  <Icon name="audio-book" size="sm" tone="secondary" />
                  <Text variant="body-sm" tone="secondary">
                    {stats.chapters} chapters
                  </Text>
                </li>
              )}
              {stats.hasCertificate && (
                <li className="flex items-center gap-tatva-3">
                  <Icon name="briefcase" size="sm" tone="secondary" />
                  <Text variant="body-sm" tone="secondary">
                    Certificate of completion
                  </Text>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default EnrollCard;
