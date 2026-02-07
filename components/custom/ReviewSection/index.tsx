"use client";

import * as React from "react";
import { Text, Avatar, Icon, Button } from "@/components";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface Review {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  rating: number;
  date: string;
  content: string;
  helpful?: number;
}

export interface ReviewSectionProps {
  /** Overall rating stats */
  stats: {
    average: number;
    total: number;
    distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  /** List of reviews */
  reviews: Review[];
  /** Handler for "Was this helpful?" click */
  onHelpfulClick?: (reviewId: string) => void;
  /** Handler for "Load more" click */
  onLoadMore?: () => void;
  /** Whether there are more reviews to load */
  hasMore?: boolean;
  /** Additional class names */
  className?: string;
}

// ============================================================================
// Sub-Components
// ============================================================================

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-tatva-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name="favourite"
          size={size === "sm" ? "xs" : "sm"}
          className={cn(
            star <= rating
              ? "text-lms-coral-500"
              : "text-gray-200"
          )}
        />
      ))}
    </div>
  );
}

function RatingBar({ percentage, stars }: { percentage: number; stars: number }) {
  // Use coral gradient based on star level
  const barColor = stars >= 4 ? "bg-lms-coral-500" : stars >= 3 ? "bg-lms-coral-400" : "bg-lms-coral-300";

  return (
    <div className="h-2.5 flex-1 overflow-hidden rounded-tatva-full bg-gray-100">
      <div
        className={cn("h-full rounded-tatva-full transition-all", barColor)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function ReviewCard({
  review,
  onHelpfulClick,
}: {
  review: Review;
  onHelpfulClick?: (reviewId: string) => void;
}) {
  return (
    <div className="border-b border-tatva-border py-tatva-6 last:border-b-0">
      {/* Author & Rating */}
      <div className="mb-tatva-4 flex items-start justify-between">
        <div className="flex items-center gap-tatva-3">
          <div className="rounded-full ring-2 ring-lms-primary-100">
            <Avatar src={review.author.avatar} fallback={review.author.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()} size="sm" />
          </div>
          <div>
            <Text variant="label-sm">{review.author.name}</Text>
            <Text variant="body-xs" tone="tertiary">
              {review.date}
            </Text>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} />
          <span className="rounded-full bg-lms-coral-50 px-2 py-0.5 text-xs font-medium text-lms-coral-600">
            {review.rating}.0
          </span>
        </div>
      </div>

      {/* Content */}
      <Text variant="body-sm" tone="secondary" className="mb-tatva-4">
        {review.content}
      </Text>

      {/* Helpful */}
      <button
        onClick={() => onHelpfulClick?.(review.id)}
        className="flex items-center gap-tatva-2 rounded-full bg-lms-primary-50 px-3 py-1.5 text-lms-primary-600 transition-colors hover:bg-lms-primary-100"
      >
        <Icon name="like" size="xs" className="text-lms-primary-600" />
        <Text variant="body-xs" className="text-lms-primary-600">
          Helpful{review.helpful ? ` (${review.helpful})` : ""}
        </Text>
      </button>
    </div>
  );
}

// ============================================================================
// Component
// ============================================================================

export function ReviewSection({
  stats,
  reviews,
  onHelpfulClick,
  onLoadMore,
  hasMore = false,
  className,
}: ReviewSectionProps) {
  return (
    <section className={cn("py-tatva-16", className)}>
      {/* Section Header */}
      <div className="mb-tatva-10 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-lms-coral-100">
          <Icon name="favourite" size="md" className="text-lms-coral-600" />
        </div>
        <Text variant="heading-md">
          Student Reviews
        </Text>
      </div>

      <div className="grid grid-cols-1 gap-tatva-12 lg:grid-cols-3">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-tatva-xl border border-lms-primary-100 bg-gradient-to-br from-white to-lms-primary-50 p-tatva-6">
            {/* Average Rating */}
            <div className="mb-tatva-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-lms-coral-100 px-4 py-2">
                <Icon name="favourite" size="md" className="text-lms-coral-500" />
                <span className="text-3xl font-bold text-lms-coral-600">
                  {stats.average.toFixed(1)}
                </span>
              </div>
              <div className="mt-3">
                <StarRating rating={Math.round(stats.average)} size="md" />
              </div>
              <Text variant="body-sm" tone="tertiary" className="mt-tatva-2">
                Based on {stats.total.toLocaleString()} reviews
              </Text>
            </div>

            {/* Distribution */}
            <div className="space-y-3">
              {([5, 4, 3, 2, 1] as const).map((stars) => {
                const count = stats.distribution[stars];
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

                return (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex w-12 items-center gap-1">
                      <Text variant="body-sm" tone="secondary">
                        {stars}
                      </Text>
                      <Icon name="favourite" size="xs" className="text-lms-coral-400" />
                    </div>
                    <RatingBar percentage={percentage} stars={stars} />
                    <Text variant="body-xs" tone="tertiary" className="w-10 text-right">
                      {count}
                    </Text>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          {reviews.length > 0 ? (
            <>
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onHelpfulClick={onHelpfulClick}
                />
              ))}

              {hasMore && (
                <div className="mt-tatva-8 text-center">
                  <Button variant="outline" onClick={onLoadMore}>
                    Load More Reviews
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-tatva-xl border border-dashed border-lms-primary-200 bg-lms-primary-50 py-tatva-12 text-center">
              <Icon name="chat" size="lg" className="mx-auto mb-3 text-lms-primary-400" />
              <Text variant="body-md" tone="tertiary">
                No reviews yet. Be the first to review this course!
              </Text>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ReviewSection;
