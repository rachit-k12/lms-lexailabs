# LexAI Labs - Learning Management System

A modern, responsive LMS built with Next.js 16, Tailwind CSS, and a custom component library.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS with custom design tokens
- **UI Components:** Custom component library (`ui/` folder)
- **Icons:** Custom icon system
- **Fonts:** Geist (via next/font)

## Project Structure

```
lms-app/
├── app/                          # Next.js App Router pages
│   ├── (marketing)/              # Marketing pages (with navbar/footer)
│   │   ├── page.tsx              # Landing page (/)
│   │   ├── about/page.tsx        # About page (/about)
│   │   ├── courses/page.tsx      # All courses (/courses)
│   │   └── courses/[id]/page.tsx # Course detail (/courses/[id])
│   ├── learn/[courseId]/[lessonId]/page.tsx  # Learning view
│   └── design-system/page.tsx    # Component showcase
├── components/
│   ├── custom/                   # LMS-specific components
│   └── index.ts                  # Component exports
├── ui/                           # Base UI component library
│   └── components/               # Reusable UI primitives
└── lib/
    ├── data.ts                   # Mock course data
    └── utils.ts                  # Utility functions
```

## User Flows

### 1. Landing Page (`/`)

The homepage showcases the LMS platform with:

- **Hero Section** - Main value proposition with CTA buttons
  - "Explore Courses" → `/courses`
  - "Watch Preview" → `/learn/ml-fundamentals/l-1`
- **Trusted By Section** - Marquee of company logos (Google, Microsoft, Amazon, etc.)
- **Featured Courses** - Grid of 3 highlighted courses
- **Instructor Section** - About the lead instructor (Puru Govind)
- **Testimonials** - Student reviews in a minimal card layout
- **Subscription CTA** - Call to action for signing up

### 2. Courses Listing (`/courses`)

Displays all available courses organized by category:

- **Hero** - Title and description of the course catalog
- **Non-Engineering Courses** (3 courses displayed)
  - AI Product Management
  - AI for Business Leaders
  - AI Marketing Mastery
- **Engineering Courses** (5 courses)
  - Machine Learning Fundamentals
  - Python for Data Science
  - Deep Learning Specialization
  - AI Ethics & Responsible AI
  - MLOps & Production ML

**Course Card States:**
- `not-started` - Gray border, "Start learning" button
- `in-progress` - Blue border, progress indicator on image, liquid glass button with progress fill
- `completed` - Green border, checkmark overlay on image

### 3. Course Detail (`/courses/[id]`)

Individual course page with:

- **Course Banner** - Image, title, description, breadcrumbs, stats
- **What You'll Learn** - Grid of learning outcomes
- **Course Content Accordion** - Expandable modules with lessons
  - Click any lesson → navigates to `/learn/[courseId]/[lessonId]`
  - Preview badges on free lessons
  - Content type icons (video/article/quiz)
- **Subscription Card** - Sticky sidebar with CTA
- **Course Includes** - Features grid (video hours, lessons, quizzes, etc.)
- **Instructor Section** - Detailed instructor bio

### 4. Learning View (`/learn/[courseId]/[lessonId]`)

The main learning interface with a 3-panel layout:

**Left Panel (30%)**
- Back to course link
- Course title and progress bar
- Module Timeline - Collapsible modules with lessons
- Lesson status indicators (completed/in-progress/locked)

**Center Panel (45%)**
- Lesson title and type badge
- Video Player (for video lessons)
- Markdown content (lesson notes)
- Lesson Navigation - Previous/Next buttons with borders

**Right Panel (25%)**
- Table of Contents - Auto-highlights based on scroll position
- Clickable headings for navigation

**Features:**
- Mark lessons as complete
- Progress tracking
- Responsive (hides sidebars on mobile)

### 5. About Page (`/about`)

Company information page with:

- Mission statement
- Statistics (50,000+ students, 8 courses, 4.9 rating, 100+ companies)
- Instructor profile

## Course Data Structure

```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: "engineering" | "non-engineering";
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  studentsCount: number;
  modules: Module[];
  learningOutcomes: string[];
  includes: { icon: string; label: string }[];
}

interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "article" | "quiz";
  isPreview?: boolean;
}
```

## Key Components

### Custom LMS Components

| Component | Description |
|-----------|-------------|
| `CourseCard` | Course preview card with state-based styling and progress |
| `CourseBanner` | Hero banner for course detail pages |
| `CourseContentAccordion` | Expandable course curriculum |
| `ModuleTimeline` | Sidebar navigation for learning view |
| `LessonNavigation` | Previous/Next lesson navigation |
| `TableOfContents` | Scroll-spy enabled content navigation |
| `VideoPlayer` | Custom video player component |
| `MarkdownContent` | Renders lesson content from markdown |
| `InstructorSection` | Instructor bio with credentials |
| `Navbar` | Top navigation with logo and links |
| `Footer` | Site footer with links and social icons |

### UI Primitives

The `ui/` folder contains base components:
- Button, Badge, Icon, Text
- Input, Select, Checkbox, Radio
- Card, Dialog, Sheet
- Table, Tabs, Accordion
- And more...

## Available Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/courses` | Course catalog |
| `/courses/[id]` | Course detail (e.g., `/courses/ml-fundamentals`) |
| `/learn/[courseId]/[lessonId]` | Learning view (e.g., `/learn/ml-fundamentals/l-1`) |
| `/about` | About page |
| `/design-system` | Component showcase |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Sample User Journey

1. User lands on homepage (`/`)
2. Clicks "Explore Courses" → goes to `/courses`
3. Browses courses, clicks on "Machine Learning Fundamentals"
4. Views course detail at `/courses/ml-fundamentals`
5. Clicks on "Welcome to the Course" lesson in Course Content
6. Navigates to `/learn/ml-fundamentals/l-1`
7. Watches video, reads notes, marks as complete
8. Uses Next button to proceed to next lesson
9. Progress is tracked in the sidebar

## Design Tokens

The project uses a custom design system with:

- **Colors:** `lms-primary` (blue), `lms-coral` (orange/coral)
- **Spacing:** Uses `tatva-*` spacing scale
- **Border Radius:** `rounded-tatva-*` variants
- **Typography:** Custom text variants via `Text` component

## Demo Data

The app includes mock data for:
- 9 courses (5 engineering, 4 non-engineering)
- Multiple modules per course
- Lessons with markdown content
- Instructor profile
- Testimonials

Progress states are hardcoded for demo:
- `ml-fundamentals` - 45% in progress
- `python-data-science` - 100% completed
