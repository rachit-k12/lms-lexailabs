"use client";

import { useState } from "react";
import {
  Text,
  Tabs,
  Badge,
  CourseCard,
  LmsNavbar,
  type LmsNavItem,
  InstructorSection,
  Footer,
  CourseBanner,
  EnrollCard,
  CourseContentAccordion,
  ReviewSection,
  ModuleTimeline,
  TableOfContents,
  VideoPlayer,
  MDXContent,
  MarkdownContent,
  Prose,
  CodeBlock,
  Callout,
  LessonNavigation,
  WhatYoullLearnSection,
  CourseIncludesSection,
} from "@/components";

// ============================================================================
// Grainy Gradient Images from Unsplash
// ============================================================================

const grainyImages = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1557682260-96773eb01377?w=600&h=400&fit=crop&q=80",
];

// ============================================================================
// Sample Data
// ============================================================================

const sampleCourses = [
  {
    id: "1",
    title: "Solutions Architect Interview Prep",
    description: "Land your dream solutions architect job at Amazon, Google, Meta, Microsoft, Salesforce, and other top tech companies.",
    image: grainyImages[0],
    badge: "Learning Path",
    coursesCount: 6,
    studentsCount: 5500,
    progress: 0, // Not started
  },
  {
    id: "2",
    title: "Full-Stack Web Development",
    description: "Master modern web development with React, Node.js, and cloud deployment. Build production-ready applications.",
    image: grainyImages[1],
    badge: "Course",
    coursesCount: 12,
    studentsCount: 12400,
    progress: 45, // In progress
  },
  {
    id: "3",
    title: "Machine Learning Fundamentals",
    description: "Learn the core concepts of machine learning, from linear regression to neural networks and deep learning.",
    image: grainyImages[2],
    badge: "Certification",
    coursesCount: 8,
    studentsCount: 8900,
    progress: 100, // Completed
  },
];

const sampleModules = [
  {
    id: "module-1",
    title: "Getting Started",
    description: "Introduction to the course and setup instructions",
    lessons: [
      { id: "lesson-1", title: "Welcome to the Course", duration: "5 min", type: "video" as const, status: "completed" as const, isPreview: true },
      { id: "lesson-2", title: "Course Overview", duration: "10 min", type: "video" as const, status: "completed" as const, isPreview: true },
      { id: "lesson-3", title: "Setting Up Your Environment", duration: "15 min", type: "article" as const, status: "completed" as const },
    ],
  },
  {
    id: "module-2",
    title: "Core Concepts",
    description: "Learn the fundamental concepts and techniques",
    lessons: [
      { id: "lesson-4", title: "Understanding the Basics", duration: "20 min", type: "video" as const, status: "completed" as const },
      { id: "lesson-5", title: "Advanced Techniques", duration: "25 min", type: "video" as const, status: "in-progress" as const },
      { id: "lesson-6", title: "Best Practices", duration: "15 min", type: "article" as const, status: "available" as const },
      { id: "lesson-7", title: "Module Quiz", duration: "10 min", type: "quiz" as const, status: "locked" as const },
    ],
  },
  {
    id: "module-3",
    title: "Building Projects",
    description: "Apply what you learned in hands-on projects",
    lessons: [
      { id: "lesson-8", title: "Project Setup", duration: "15 min", type: "video" as const, status: "locked" as const },
      { id: "lesson-9", title: "Implementation Guide", duration: "30 min", type: "article" as const, status: "locked" as const },
      { id: "lesson-10", title: "Final Project", duration: "45 min", type: "assignment" as const, status: "locked" as const },
    ],
  },
];

const sampleReviews = [
  {
    id: "1",
    author: { name: "Alex Johnson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    rating: 5,
    date: "2 weeks ago",
    content: "This course was exactly what I needed to level up my skills. The instructor explains complex concepts in a very accessible way. Highly recommended!",
    helpful: 24,
  },
  {
    id: "2",
    author: { name: "Sarah Chen" },
    rating: 4,
    date: "1 month ago",
    content: "Great content and well-structured modules. I would have liked more hands-on exercises, but overall a solid learning experience.",
    helpful: 12,
  },
  {
    id: "3",
    author: { name: "Mike Wilson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
    rating: 5,
    date: "1 month ago",
    content: "One of the best courses I've taken online. The real-world examples and projects helped me apply what I learned immediately at work.",
    helpful: 18,
  },
];

// Timeline modules only support video, article, quiz types (no assignment)
const timelineModules = [
  {
    id: "module-1",
    title: "Getting Started",
    description: "Introduction to the course",
    lessons: [
      { id: "lesson-1", title: "Welcome to the Course", duration: "5 min", type: "video" as const, isCompleted: true },
      { id: "lesson-2", title: "Course Overview", duration: "10 min", type: "video" as const, isCompleted: true },
      { id: "lesson-3", title: "Setting Up Your Environment", duration: "15 min", type: "article" as const, isCompleted: true },
    ],
  },
  {
    id: "module-2",
    title: "Core Concepts",
    description: "Learn the fundamentals",
    lessons: [
      { id: "lesson-4", title: "Understanding the Basics", duration: "20 min", type: "video" as const, isCompleted: true },
      { id: "lesson-5", title: "Advanced Techniques", duration: "25 min", type: "video" as const },
      { id: "lesson-6", title: "Best Practices", duration: "15 min", type: "article" as const },
      { id: "lesson-7", title: "Module Quiz", duration: "10 min", type: "quiz" as const, isLocked: true },
    ],
  },
  {
    id: "module-3",
    title: "Building Projects",
    description: "Apply what you learned",
    lessons: [
      { id: "lesson-8", title: "Project Setup", duration: "15 min", type: "video" as const, isLocked: true },
      { id: "lesson-9", title: "Implementation Guide", duration: "30 min", type: "article" as const, isLocked: true },
      { id: "lesson-10", title: "Final Quiz", duration: "45 min", type: "quiz" as const, isLocked: true },
    ],
  },
];

const sampleTocItems = [
  { id: "introduction", title: "Introduction", level: 1 as const },
  { id: "getting-started", title: "Getting Started", level: 2 as const },
  { id: "installation", title: "Installation", level: 3 as const },
  { id: "configuration", title: "Configuration", level: 3 as const },
  { id: "core-concepts", title: "Core Concepts", level: 2 as const },
  { id: "advanced-topics", title: "Advanced Topics", level: 2 as const },
  { id: "conclusion", title: "Conclusion", level: 1 as const },
];

// ============================================================================
// Component Showcase Wrapper
// ============================================================================

function ComponentShowcase({
  title,
  description,
  children,
  noPadding = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  noPadding?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Text variant="heading-sm">{title}</Text>
        {description && (
          <Text variant="body-sm" tone="secondary">
            {description}
          </Text>
        )}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// Tab Content Components
// ============================================================================

function OverviewTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const components = [
    { name: "Navbar", description: "Main navigation bar with logo, nav items, and auth buttons.", available: true, tab: "navbar" },
    { name: "CourseCard", description: "Display course information with image, stats, badges, and CTA.", available: true, tab: "course-cards" },
    { name: "InstructorSection", description: "Instructor profile with company, credentials, and social links.", available: true, tab: "landing-page" },
    { name: "Footer", description: "Site footer with social icons, contact info, and quick links.", available: true, tab: "landing-page" },
    { name: "CourseBanner", description: "Course detail page banner with title, stats, and image.", available: true, tab: "course-detail" },
    { name: "EnrollCard", description: "Enrollment sidebar with price, stats, and CTA button.", available: true, tab: "course-detail" },
    { name: "CourseContentAccordion", description: "Expandable course modules with lessons list.", available: true, tab: "course-detail" },
    { name: "ReviewSection", description: "Student reviews with ratings and distribution chart.", available: true, tab: "course-detail" },
    { name: "ModuleTimeline", description: "Course navigation sidebar with progress tracking.", available: true, tab: "learning-view" },
    { name: "TableOfContents", description: "Article/lesson table of contents with scroll spy.", available: true, tab: "learning-view" },
    { name: "VideoPlayer", description: "Custom video player with controls and progress.", available: true, tab: "learning-view" },
    { name: "MDXContent", description: "Rich text content renderer using React components.", available: true, tab: "learning-view" },
    { name: "MarkdownContent", description: "Renders markdown strings from backend API.", available: true, tab: "learning-view" },
    { name: "LessonNavigation", description: "Previous/Next lesson navigation controls.", available: true, tab: "learning-view" },
  ];

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <Text variant="heading-md">
          Custom Components Library
        </Text>
        <Text variant="body-md" tone="secondary">
          This page showcases custom components built using our Tatva design system.
          These components are specific to the Lex AI LMS platform and combine
          multiple primitive components to create reusable, feature-rich UI elements.
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {components.map((component) => (
          <button
            key={component.name}
            onClick={() => component.available && onNavigate(component.tab)}
            className={`rounded-tatva-lg border border-tatva-border p-4 text-left transition-colors hover:bg-tatva-background-secondary hover:border-tatva-brand-primary ${!component.available ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <Badge variant={component.available ? "brand" : "default"} size="sm">
              {component.available ? "Available" : "Coming Soon"}
            </Badge>
            <Text variant="heading-xs">{component.name}</Text>
            <Text variant="body-xs" tone="secondary">
              {component.description}
            </Text>
          </button>
        ))}
      </div>
    </div>
  );
}

function NavbarTab() {
  const navItemsWithActive: LmsNavItem[] = [
    { label: "Courses", href: "/courses" },
    { label: "Learning Paths", href: "/learning-paths", isActive: true },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <div className="space-y-12">
      <ComponentShowcase
        title="Navbar - Logged Out (with active state)"
        description="Active nav item shows brand-colored underline and medium font weight for clear visual distinction"
        noPadding
      >
        <LmsNavbar
          navItems={navItemsWithActive}
          onLogin={() => console.log("Login clicked")}
          onGetStarted={() => console.log("Get Started clicked")}
        />
      </ComponentShowcase>

      <ComponentShowcase
        title="Navbar - Logged In"
        description="Navbar state for authenticated users with My Learning and user menu"
        noPadding
      >
        <LmsNavbar
          navItems={navItemsWithActive}
          isLoggedIn
          user={{
            name: "John Doe",
            email: "john@example.com",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80",
          }}
          onLogout={() => console.log("Logout clicked")}
        />
      </ComponentShowcase>
    </div>
  );
}

function CourseCardsTab() {
  return (
    <div className="space-y-12">
      <ComponentShowcase
        title="Course Card States"
        description="Three distinct states with visual differentiation: Not Started (default border), In Progress (brand accent border + progress overlay), Completed (green accent border + checkmark overlay)"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleCourses.map((course) => (
            <div key={course.id} className="space-y-2">
              <Text variant="label-sm" tone="secondary" >
                {course.progress === 0 ? "Not Started" : course.progress === 100 ? "Completed" : "In Progress"}
              </Text>
              <CourseCard
                title={course.title}
                description={course.description}
                image={course.image}
                badge={course.badge}
                coursesCount={course.coursesCount}
                studentsCount={course.studentsCount}
                progress={course.progress}
                onStartLearning={() => console.log(`Start: ${course.title}`)}
              />
            </div>
          ))}
        </div>
      </ComponentShowcase>
    </div>
  );
}

function LandingPageTab() {
  return (
    <div className="space-y-12">
      <ComponentShowcase
        title="Instructor Section"
        description="Instructor profile with avatar, bio, company, credentials, and social links (LinkedIn, Twitter, GitHub, Email, Stack Overflow, Website)"
        noPadding
      >
        <InstructorSection
          name="Puru Govind"
          role="Founder & CEO"
          company="Lex AI Labs"
          bio="Puru is the founder and CEO of Lex AI Labs, building the future of AI-powered education. With extensive experience in machine learning and education technology, he leads the vision to democratize quality learning across India and beyond."
          avatar="https://media.licdn.com/dms/image/v2/D4D03AQGQtno9QlQ5ug/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1715758859402?e=1772064000&v=beta&t=GOyIYDDytPLCRWdXEWX_4s5XF4RBY9WtlpxIdeBwg7g"
          credentials={["AI & ML Expert", "EdTech Pioneer", "Startup Founder", "IIT Alumni"]}
          socials={[
            { platform: "linkedin", url: "https://linkedin.com/in/purugovind" },
            { platform: "twitter", url: "https://twitter.com/purugovind" },
            { platform: "github", url: "https://github.com/purugovind" },
            { platform: "email", url: "mailto:puru@lexailabs.com" },
          ]}
        />
      </ComponentShowcase>

      <ComponentShowcase
        title="Footer"
        description="Site footer with Connect (social icons), Get in Touch (email, phone), Quick Links, and tagline"
        noPadding
      >
        <Footer />
      </ComponentShowcase>
    </div>
  );
}

function CourseDetailTab() {
  return (
    <div className="space-y-12">
      <ComponentShowcase
        title="Course Banner"
        description="Course detail page header with breadcrumbs, topic tags, instructor info, rating, and colorful stats"
        noPadding
      >
        <CourseBanner
          title="Machine Learning Fundamentals"
          description="Learn the core concepts of machine learning, from linear regression to neural networks and deep learning. Build real projects and gain practical experience."
          badge="Learning Path"
          badgeVariant="indigo"
          tags={[
            { label: "Artificial Intelligence", variant: "coral" },
            { label: "Data Science", variant: "green" },
            { label: "Python", variant: "orange" },
          ]}
          breadcrumbs={[
            { label: "Courses", href: "/courses" },
            { label: "Engineering", href: "/courses?category=engineering" },
            { label: "Machine Learning" },
          ]}
          instructor={{
            name: "Puru Govind",
            avatar: "https://media.licdn.com/dms/image/v2/D4D03AQGQtno9QlQ5ug/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1715758859402?e=1772064000&v=beta&t=GOyIYDDytPLCRWdXEWX_4s5XF4RBY9WtlpxIdeBwg7g",
          }}
          stats={{
            studentsCount: 8900,
            duration: "24 hours",
            level: "Intermediate",
            modulesCount: 8,
            lessonsCount: 45,
          }}
          image="https://media.gettyimages.com/id/1973239712/photo/digital-brain-connections.jpg?s=612x612&w=0&k=20&c=y8dGTyvzEIk19DzvGbgaekiWqy6aQj_9QFvHXGkAYS4="
        />
      </ComponentShowcase>

      <ComponentShowcase
        title="What You'll Learn"
        description="Learning outcomes section with two-column layout"
        noPadding
      >
        <WhatYoullLearnSection
          outcomes={[
            "Understand key Machine Learning concepts and build a solid foundation",
            "Start coding in Python and learn how to use it for ML and AI",
            "Apply your skills to real-life business cases",
            "Leverage scikit-learn for building ML models",
            "Understand the mathematics behind Machine Learning algorithms",
            "Build and train neural networks from scratch",
            "Implement deep learning models using TensorFlow and PyTorch",
            "Deploy ML models to production environments",
          ]}
        />
      </ComponentShowcase>

      <ComponentShowcase
        title="Course Includes"
        description="Course features and resources"
        noPadding
      >
        <CourseIncludesSection
          items={[
            { icon: "play", label: "on-demand video", value: "24 hours" },
            { icon: "docs", label: "articles", value: "15 articles" },
            { icon: "download", label: "resources", value: "25 downloads" },
            { icon: "code", label: "exercises", value: "10 coding exercises" },
            { icon: "history", label: "access", value: "Full lifetime" },
            { icon: "television", label: "access on", value: "Mobile & TV" },
            { icon: "gift", label: "certificate", value: "Completion" },
          ]}
        />
      </ComponentShowcase>


      <ComponentShowcase
        title="Course Content Accordion"
        description="Expandable modules with Preview links, lock icons, progress tracking, and Expand All toggle"
      >
        <CourseContentAccordion
          modules={sampleModules}
          activeLessonId="lesson-5"
          onLessonClick={(id) => console.log("Lesson clicked:", id)}
          onPreviewClick={(id) => console.log("Preview clicked:", id)}
        />
      </ComponentShowcase>

      <ComponentShowcase
        title="Review Section"
        description="Student reviews with rating distribution"
      >
        <ReviewSection
          stats={{
            average: 4.7,
            total: 2340,
            distribution: { 5: 1800, 4: 380, 3: 120, 2: 30, 1: 10 },
          }}
          reviews={sampleReviews}
          onHelpfulClick={(id) => console.log("Helpful clicked:", id)}
          hasMore
          onLoadMore={() => console.log("Load more clicked")}
        />
      </ComponentShowcase>
    </div>
  );
}

function LearningViewTab() {
  return (
    <div className="space-y-12">
      <ComponentShowcase
        title="Module Timeline"
        description="Course navigation sidebar with progress tracking"
      >
        <div className="h-[500px] overflow-hidden rounded-lg border border-tatva-border">
          <ModuleTimeline
            courseTitle="Machine Learning Fundamentals"
            modules={timelineModules}
            activeLessonId="lesson-5"
            onLessonClick={(id) => console.log("Lesson clicked:", id)}
            progress={35}
          />
        </div>
      </ComponentShowcase>

      <ComponentShowcase
        title="Table of Contents"
        description="Article/lesson table of contents with scroll spy"
      >
        <div className="max-w-xs">
          <TableOfContents
            items={sampleTocItems}
            activeId="core-concepts"
            onItemClick={(id) => console.log("TOC clicked:", id)}
          />
        </div>
      </ComponentShowcase>

      <ComponentShowcase
        title="Video Player"
        description="Custom video player with playback controls"
      >
        <div className="max-w-3xl">
          <VideoPlayer
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            poster={grainyImages[0]}
            title="Introduction to Machine Learning"
            onProgress={(p) => console.log("Progress:", p)}
            onEnded={() => console.log("Video ended")}
          />
        </div>
      </ComponentShowcase>

      <ComponentShowcase
        title="MDX Content / Prose"
        description="Rich text content renderer for lesson content"
      >
        <MDXContent>
          <h2>Understanding Machine Learning</h2>
          <p>
            Machine learning is a subset of artificial intelligence that enables systems
            to learn and improve from experience without being explicitly programmed.
          </p>
          <h3>Key Concepts</h3>
          <ul>
            <li>Supervised Learning</li>
            <li>Unsupervised Learning</li>
            <li>Reinforcement Learning</li>
          </ul>
          <blockquote>
            &quot;Machine learning is the field of study that gives computers the ability
            to learn without being explicitly programmed.&quot; — Arthur Samuel
          </blockquote>
        </MDXContent>
      </ComponentShowcase>

      <ComponentShowcase
        title="Markdown Content"
        description="Renders markdown strings from backend API with syntax highlighting"
      >
        <MarkdownContent
          content={`# Lesson: Introduction to Neural Networks

Neural networks are computing systems inspired by biological neural networks. They learn to perform tasks by considering examples.

## Key Concepts

1. **Neurons** - The basic units that receive inputs and produce outputs
2. **Weights** - Parameters that determine the importance of each input
3. **Activation Functions** - Functions that introduce non-linearity

### Code Example

Here's a simple neural network in Python:

\`\`\`python
import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(10, activation='softmax')
])
\`\`\`

> **Note:** Always remember to normalize your input data before training.

You can also use inline code like \`model.fit()\` or \`model.predict()\`.

---

## Summary

| Layer | Neurons | Activation |
|-------|---------|------------|
| Input | 784 | None |
| Hidden | 128 | ReLU |
| Output | 10 | Softmax |
`}
        />
      </ComponentShowcase>

      <ComponentShowcase
        title="Code Block"
        description="Syntax highlighted code with copy button"
      >
        <CodeBlock language="python" filename="example.py" showLineNumbers>
{`import numpy as np
from sklearn.model_selection import train_test_split

# Load and split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train the model
model.fit(X_train, y_train)`}
        </CodeBlock>
      </ComponentShowcase>

      <ComponentShowcase
        title="Callouts"
        description="Information callouts for tips, warnings, and notes"
      >
        <div className="space-y-4">
          <Callout type="info" title="Pro Tip">
            Use regularization to prevent overfitting in your models.
          </Callout>
          <Callout type="warning" title="Warning">
            Make sure to normalize your data before training.
          </Callout>
          <Callout type="success" title="Success">
            Your model achieved 95% accuracy on the test set!
          </Callout>
          <Callout type="error" title="Error">
            Training failed due to insufficient memory.
          </Callout>
        </div>
      </ComponentShowcase>

      <ComponentShowcase
        title="Lesson Navigation"
        description="Previous/Next lesson navigation with mark complete"
        noPadding
      >
        <LessonNavigation
          previousLesson={{ id: "lesson-4", title: "Understanding the Basics", type: "video" }}
          nextLesson={{ id: "lesson-6", title: "Best Practices", type: "article" }}
          onPreviousClick={() => console.log("Previous clicked")}
          onNextClick={() => console.log("Next clicked")}
          onMarkComplete={() => console.log("Mark complete clicked")}
          isCompleted={false}
        />
      </ComponentShowcase>
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "navbar", label: "Navbar" },
  { value: "course-cards", label: "Course Cards" },
  { value: "landing-page", label: "Landing Page" },
  { value: "course-detail", label: "Course Detail" },
  { value: "learning-view", label: "Learning View" },
];

export default function CustomComponentsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab onNavigate={setActiveTab} />;
      case "navbar":
        return <NavbarTab />;
      case "course-cards":
        return <CourseCardsTab />;
      case "landing-page":
        return <LandingPageTab />;
      case "course-detail":
        return <CourseDetailTab />;
      case "learning-view":
        return <LearningViewTab />;
      default:
        return <OverviewTab onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-tatva-background-primary">
      {/* Header */}
      <div className="border-b border-tatva-border bg-tatva-background-primary">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-2">
            <Text variant="heading-lg">
              Custom Components
            </Text>
          </div>
          <Text variant="body-md" tone="secondary">
            Lex AI LMS custom components built with the Tatva design system
          </Text>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-tatva-border">
        <div className="mx-auto max-w-7xl px-6">
          <Tabs
            tabs={tabs}
            value={activeTab}
            onValueChange={setActiveTab}
          />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
}
