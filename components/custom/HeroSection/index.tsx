"use client";

import * as React from "react";
import { Text, Button } from "@/components";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface HeroSectionProps {
  /** Main headline */
  headline: string;
  /** Subtitle/description */
  subtitle: string;
  /** Primary CTA button text */
  ctaText?: string;
  /** Primary CTA click handler */
  onCtaClick?: () => void;
  /** Secondary CTA button text */
  secondaryCtaText?: string;
  /** Secondary CTA click handler */
  onSecondaryCtaClick?: () => void;
  /** Optional background image URL */
  backgroundImage?: string;
  /** Additional class names */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function HeroSection({
  headline,
  subtitle,
  ctaText = "Explore Courses",
  onCtaClick,
  secondaryCtaText,
  onSecondaryCtaClick,
  backgroundImage,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[500px] items-center justify-center overflow-hidden bg-gradient-to-br from-tatva-background-primary via-tatva-background-secondary to-tatva-background-primary px-tatva-8 py-tatva-32",
        className
      )}
    >
      {/* Background Image (optional) */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -left-40 -top-40 size-80 rounded-full bg-tatva-brand-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-80 rounded-full bg-tatva-orange-200/20 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <Text
          variant="display-sm"
          className="mb-tatva-6 bg-gradient-to-r from-tatva-content-primary to-tatva-content-secondary bg-clip-text"
        >
          {headline}
        </Text>

        <Text
          variant="body-lg"
          tone="secondary"
          className="mx-auto mb-tatva-10 max-w-2xl"
        >
          {subtitle}
        </Text>

        <div className="flex items-center justify-center gap-tatva-4">
          <Button variant="primary" size="lg" onClick={onCtaClick}>
            {ctaText}
          </Button>
          {secondaryCtaText && (
            <Button variant="outline" size="lg" onClick={onSecondaryCtaClick}>
              {secondaryCtaText}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
