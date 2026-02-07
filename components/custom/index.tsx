// ============================================================================
// Custom Components - Lex AI LMS
// ============================================================================
// These are custom components built using the Tatva design system primitives.
// They are specific to the Lex AI LMS platform.
// ============================================================================

export { CourseCard, type CourseCardProps } from "./CourseCard";
export { Navbar, type NavbarProps, type NavItem as LmsNavItem } from "./Navbar";
export { InstructorSection, type InstructorSectionProps } from "./InstructorSection";
export { Footer, type FooterProps, type FooterSection, type FooterLink } from "./Footer";
export { EnrollCard, type EnrollCardProps } from "./EnrollCard";
export { CourseBanner, type CourseBannerProps, type BreadcrumbItem as CourseBreadcrumbItem, type TopicTag } from "./CourseBanner";
export { CourseContentAccordion, type CourseContentAccordionProps, type Module, type Lesson, type LessonType, type LessonStatus } from "./CourseContentAccordion";
export { ReviewSection, type ReviewSectionProps, type Review } from "./ReviewSection";
export { ModuleTimeline, type ModuleTimelineProps, type TimelineModule, type TimelineLesson } from "./ModuleTimeline";
export { TableOfContents, type TableOfContentsProps, type TocItem } from "./TableOfContents";
export { VideoPlayer, type VideoPlayerProps } from "./VideoPlayer";
export { MDXContent, Prose, CodeBlock, Callout, mdxComponents, type MDXContentProps } from "./MDXContent";
export { MarkdownContent, type MarkdownContentProps } from "./MarkdownContent";
export { LessonNavigation, LessonNavigationCompact, type LessonNavigationProps, type LessonInfo } from "./LessonNavigation";
export {
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
} from "./CourseDetailSections";
