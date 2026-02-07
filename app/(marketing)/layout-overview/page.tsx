import Link from "next/link";
import { Text, Badge, Icon, Divider } from "@/components";

// ============================================================================
// Types
// ============================================================================

interface PageInfo {
  route: string;
  name: string;
  description: string;
  status: "completed" | "in-progress" | "planned";
  phase: number;
  components: string[];
}

interface FlowConnection {
  from: string;
  to: string;
  label?: string;
}

// ============================================================================
// Data
// ============================================================================

const pages: PageInfo[] = [
  {
    route: "/",
    name: "Landing Page",
    description: "Showcase LexAI Labs, instructor, and featured courses",
    status: "completed",
    phase: 1,
    components: ["Navbar", "Hero", "InstructorSection", "CourseCard", "Footer"],
  },
  {
    route: "/courses",
    name: "Courses Page",
    description: "Browse all 8 courses organized by category",
    status: "completed",
    phase: 2,
    components: ["Navbar", "CourseCard", "Badge", "Divider", "Footer"],
  },
  {
    route: "/courses/[id]",
    name: "Course Detail",
    description: "Full course information with modules and lessons",
    status: "completed",
    phase: 3,
    components: ["CourseBanner", "CourseContentAccordion", "InstructorSection", "Button"],
  },
  {
    route: "/learn/[courseId]/[lessonId]",
    name: "Learning View",
    description: "Render MDX content with module navigation and TOC",
    status: "completed",
    phase: 4,
    components: ["ModuleTimeline", "MarkdownContent", "TableOfContents", "Button"],
  },
  {
    route: "/auth/signin",
    name: "Sign In",
    description: "User authentication - sign in form",
    status: "planned",
    phase: 5,
    components: ["Card", "Input", "Button", "Text"],
  },
  {
    route: "/auth/signup",
    name: "Sign Up",
    description: "User registration - create account form",
    status: "planned",
    phase: 5,
    components: ["Card", "Input", "Button", "Text"],
  },
  {
    route: "/dashboard",
    name: "User Dashboard",
    description: "Show enrolled courses with progress tracking",
    status: "planned",
    phase: 6,
    components: ["Navbar", "Card", "Badge", "Button"],
  },
  {
    route: "/my-learning",
    name: "My Learning",
    description: "Continue learning with progress indicators",
    status: "planned",
    phase: 6,
    components: ["Card", "ProgressBar", "Button"],
  },
  {
    route: "/certificates",
    name: "Certificates",
    description: "View and download earned certificates",
    status: "planned",
    phase: 6,
    components: ["Card", "Button"],
  },
  {
    route: "/admin",
    name: "Admin Dashboard",
    description: "Manage courses, view analytics (protected)",
    status: "planned",
    phase: 7,
    components: ["MetricCard", "Table", "Button", "Dialog"],
  },
];

const navigationFlow: FlowConnection[] = [
  { from: "/", to: "/courses", label: "Explore Courses" },
  { from: "/", to: "/auth/signup", label: "Sign Up" },
  { from: "/courses", to: "/courses/[id]", label: "View Course" },
  { from: "/courses/[id]", to: "/learn/[courseId]/[lessonId]", label: "Start Learning" },
  { from: "/auth/signin", to: "/dashboard", label: "After Login" },
  { from: "/dashboard", to: "/my-learning", label: "Continue" },
  { from: "/dashboard", to: "/admin", label: "Admin Only" },
];

// ============================================================================
// Helper Components
// ============================================================================

function StatusBadge({ status }: { status: PageInfo["status"] }) {
  const variants = {
    completed: { variant: "green" as const, label: "Completed" },
    "in-progress": { variant: "coral" as const, label: "In Progress" },
    planned: { variant: "default" as const, label: "Planned" },
  };

  const { variant, label } = variants[status];

  return (
    <Badge variant={variant} size="sm">
      {label}
    </Badge>
  );
}

function PhaseSection({ phase, title, pages }: { phase: number; title: string; pages: PageInfo[] }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex size-10 items-center justify-center rounded-full bg-lms-primary-100">
          <Text variant="heading-sm" className="text-lms-primary-600">{phase}</Text>
        </div>
        <Text variant="heading-md">{title}</Text>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <div
            key={page.route}
            className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <code className="text-sm bg-gray-100 px-2 py-1 rounded text-lms-primary-600">
                {page.route}
              </code>
              <StatusBadge status={page.status} />
            </div>

            <Text variant="heading-sm" className="mb-2">
              {page.name}
            </Text>
            <Text variant="body-sm" tone="secondary" className="mb-4">
              {page.description}
            </Text>

            <div className="flex flex-wrap gap-1">
              {page.components.slice(0, 4).map((component) => (
                <span
                  key={component}
                  className="text-xs bg-gray-50 border border-gray-200 px-2 py-0.5 rounded"
                >
                  {component}
                </span>
              ))}
              {page.components.length > 4 && (
                <span className="text-xs text-gray-400">
                  +{page.components.length - 4} more
                </span>
              )}
            </div>

            {page.status === "completed" && page.route !== "/learn/[courseId]/[lessonId]" && !page.route.includes("[") && (
              <Link
                href={page.route}
                className="mt-4 inline-flex items-center gap-1 text-sm text-lms-primary-600 hover:text-lms-primary-700"
              >
                View Page
                <Icon name="arrow-right" size="xs" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Navigation Flow Diagram
// ============================================================================

function NavigationFlowSection() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 mb-12">
      <Text variant="heading-md" className="mb-6">
        Navigation Flow
      </Text>

      <div className="bg-white rounded-xl p-6 font-mono text-sm overflow-x-auto">
        <pre className="text-gray-700">
{`Landing (/)
    │
    ├── Courses (/courses)
    │       │
    │       └── Course Detail (/courses/[id])
    │               │
    │               └── Learning View (/learn/[courseId]/[lessonId])
    │
    ├── Sign In (/auth/signin)
    │
    ├── Sign Up (/auth/signup)
    │
    └── Dashboard (/dashboard) [authenticated]
            │
            ├── My Learning (/my-learning)
            │
            ├── Certificates (/certificates)
            │
            ├── Settings (/settings)
            │
            └── Admin (/admin) [admin only]`}
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// Project Stats
// ============================================================================

function ProjectStats() {
  const completed = pages.filter((p) => p.status === "completed").length;
  const inProgress = pages.filter((p) => p.status === "in-progress").length;
  const planned = pages.filter((p) => p.status === "planned").length;

  const stats = [
    { label: "Total Pages", value: pages.length, icon: "layers", color: "bg-lms-primary-100 text-lms-primary-600" },
    { label: "Completed", value: completed, icon: "check", color: "bg-green-100 text-green-600" },
    { label: "In Progress", value: inProgress, icon: "activity", color: "bg-lms-coral-100 text-lms-coral-600" },
    { label: "Planned", value: planned, icon: "history", color: "bg-gray-100 text-gray-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-gray-200 bg-white p-6 text-center"
        >
          <div className={`mx-auto mb-3 flex size-12 items-center justify-center rounded-full ${stat.color}`}>
            <Icon name={stat.icon as any} size="md" />
          </div>
          <Text variant="display-sm">{stat.value}</Text>
          <Text variant="body-sm" tone="tertiary">{stat.label}</Text>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Data Models Section
// ============================================================================

function DataModelsSection() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 mb-12">
      <Text variant="heading-md" className="mb-6">
        Data Models
      </Text>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-xl p-6">
          <Text variant="label-md" className="mb-3">Course</Text>
          <pre className="text-sm text-gray-600 overflow-x-auto">
{`{
  id: string
  title: string
  description: string
  thumbnail: string
  category: 'engineering' | 'non-engineering'
  modules: Module[]
  instructor: Instructor
}`}
          </pre>
        </div>

        <div className="bg-white rounded-xl p-6">
          <Text variant="label-md" className="mb-3">Module</Text>
          <pre className="text-sm text-gray-600 overflow-x-auto">
{`{
  id: string
  title: string
  description: string
  lessons: Lesson[]
}`}
          </pre>
        </div>

        <div className="bg-white rounded-xl p-6">
          <Text variant="label-md" className="mb-3">Lesson</Text>
          <pre className="text-sm text-gray-600 overflow-x-auto">
{`{
  id: string
  title: string
  duration: string
  type: 'video' | 'article' | 'quiz'
  isPreview: boolean
}`}
          </pre>
        </div>

        <div className="bg-white rounded-xl p-6">
          <Text variant="label-md" className="mb-3">UserProgress (Planned)</Text>
          <pre className="text-sm text-gray-600 overflow-x-auto">
{`{
  courseId: string
  completedLessons: string[]
  percentComplete: number
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function LayoutOverviewPage() {
  const phase1Pages = pages.filter((p) => p.phase === 1);
  const phase2Pages = pages.filter((p) => p.phase === 2);
  const phase3Pages = pages.filter((p) => p.phase === 3);
  const phase4Pages = pages.filter((p) => p.phase === 4);
  const phase5Pages = pages.filter((p) => p.phase === 5);
  const phase6Pages = pages.filter((p) => p.phase === 6);
  const phase7Pages = pages.filter((p) => p.phase === 7);

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-lms-primary-600 to-lms-primary-700 py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
            <Icon name="layers" size="xs" className="text-white" />
            <Text variant="label-sm" className="text-white/90">Layout Overview</Text>
          </div>
          <Text variant="display-sm" className="text-white mb-4">
            LexAI Labs LMS - User Flows
          </Text>
          <Text variant="body-lg" className="text-white/80 max-w-2xl mx-auto">
            Complete overview of all pages, navigation flows, and implementation status.
            This page will be updated as the project progresses.
          </Text>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          {/* Project Stats */}
          <ProjectStats />

          {/* Navigation Flow */}
          <NavigationFlowSection />

          {/* Build Phases */}
          <div className="mb-8">
            <Text variant="heading-lg" className="mb-2">Build Phases</Text>
            <Text variant="body-md" tone="secondary" className="mb-8">
              Pages are built using a DFS approach - completing each phase fully before moving to the next.
            </Text>
          </div>

          <PhaseSection phase={1} title="Landing Page" pages={phase1Pages} />
          <PhaseSection phase={2} title="Courses Page" pages={phase2Pages} />
          <PhaseSection phase={3} title="Course Detail" pages={phase3Pages} />
          <PhaseSection phase={4} title="Learning View" pages={phase4Pages} />

          <Divider className="my-12" />

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-lms-coral-50 border border-lms-coral-100 px-4 py-2 mb-4">
              <Icon name="history" size="xs" className="text-lms-coral-500" />
              <Text variant="label-sm" className="text-lms-coral-700">Coming Soon</Text>
            </div>
          </div>

          <PhaseSection phase={5} title="Authentication" pages={phase5Pages} />
          <PhaseSection phase={6} title="User Dashboard" pages={phase6Pages} />
          <PhaseSection phase={7} title="Admin Dashboard" pages={phase7Pages} />

          {/* Data Models */}
          <DataModelsSection />

          {/* Quick Links */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8">
            <Text variant="heading-md" className="mb-6">
              Quick Links
            </Text>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-lms-primary-50 border border-lms-primary-100 px-4 py-3 text-lms-primary-600 hover:bg-lms-primary-100 transition-colors"
              >
                <Icon name="home" size="sm" />
                <Text variant="label-sm">Landing Page</Text>
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-xl bg-lms-primary-50 border border-lms-primary-100 px-4 py-3 text-lms-primary-600 hover:bg-lms-primary-100 transition-colors"
              >
                <Icon name="audio-book" size="sm" />
                <Text variant="label-sm">Courses</Text>
              </Link>
              <Link
                href="/courses/ml-fundamentals"
                className="inline-flex items-center gap-2 rounded-xl bg-lms-primary-50 border border-lms-primary-100 px-4 py-3 text-lms-primary-600 hover:bg-lms-primary-100 transition-colors"
              >
                <Icon name="info" size="sm" />
                <Text variant="label-sm">Course Detail</Text>
              </Link>
              <Link
                href="/learn/ml-fundamentals/l-1"
                className="inline-flex items-center gap-2 rounded-xl bg-lms-coral-50 border border-lms-coral-100 px-4 py-3 text-lms-coral-600 hover:bg-lms-coral-100 transition-colors"
              >
                <Icon name="play" size="sm" />
                <Text variant="label-sm">Learning View</Text>
              </Link>
              <Link
                href="/design-system"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Icon name="settings" size="sm" />
                <Text variant="label-sm">Design System</Text>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
