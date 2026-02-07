// Re-export all UI components from the Tatva design system
// This provides a cleaner import path: import { Button, Input } from "@/components"

export * from "../ui";

// Re-export custom components for the Lex AI LMS
// Explicitly exclude Navbar to avoid conflict with UI Navbar
export {
  CourseCard,
  type CourseCardProps,
  // Navbar is exported separately below with an alias
  type NavbarProps as LmsNavbarProps,
  type LmsNavItem,
  InstructorSection,
  type InstructorSectionProps,
  Footer,
  type FooterProps,
  type FooterSection,
  type FooterLink,
  EnrollCard,
  type EnrollCardProps,
  CourseBanner,
  type CourseBannerProps,
  type CourseBreadcrumbItem,
  type TopicTag,
  CourseContentAccordion,
  type CourseContentAccordionProps,
  type Module,
  type Lesson,
  type LessonType,
  type LessonStatus,
  ReviewSection,
  type ReviewSectionProps,
  type Review,
  ModuleTimeline,
  type ModuleTimelineProps,
  type TimelineModule,
  type TimelineLesson,
  TableOfContents,
  type TableOfContentsProps,
  type TocItem,
  VideoPlayer,
  type VideoPlayerProps,
  MDXContent,
  Prose,
  CodeBlock,
  Callout,
  mdxComponents,
  type MDXContentProps,
  MarkdownContent,
  type MarkdownContentProps,
  LessonNavigation,
  LessonNavigationCompact,
  type LessonNavigationProps,
  type LessonInfo,
  TrustedBySection,
  WhatYoullLearnSection,
  CourseIncludesSection,
  CourseStatsBar,
  type TrustedBySectionProps,
  type TrustedByLogo,
  type WhatYoullLearnSectionProps,
  type CourseIncludesSectionProps,
  type CourseIncludesItem,
  type CourseStatsBarProps,
} from "./custom";

// Export the custom Navbar with an alias to avoid conflict
export { Navbar as LmsNavbar } from "./custom";
