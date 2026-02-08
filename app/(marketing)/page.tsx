import Link from "next/link";
import Image from "next/image";
import {
  Text,
  Button,
  Badge,
  Icon,
  CourseCard,
  InstructorSection,
} from "@/components";
import { getFeaturedCourses, instructor, courses } from "@/lib/data";

// ============================================================================
// Hero Section - Ample Market Style (Clean, Centered)
// ============================================================================

function HeroSection() {
  return (
    <section className="relative w-full min-w-full overflow-hidden bg-white">
      {/* Background Image with opacity */}
      <div className="absolute inset-0 pointer-events-none w-full">
        <Image
          src="/hero-section-bg.png"
          alt=""
          fill
          className="object-cover object-center opacity-40"
          priority
          sizes="100vw"
        />
        {/* Bottom fade to white for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>

      {/* Subtle Gradient Glow Effects - Desktop only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        {/* Left pink/coral glow */}
        <div className="absolute -top-20 -left-20 size-[500px] rounded-full bg-gradient-to-br from-pink-200/60 via-lms-coral-200/40 to-orange-100/30 blur-3xl" />
        {/* Right blue glow */}
        <div className="absolute top-40 -right-20 size-[400px] rounded-full bg-gradient-to-bl from-lms-primary-100/50 via-blue-100/30 to-transparent blur-3xl" />
        {/* Bottom center glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-gradient-to-t from-lms-primary-50/40 via-purple-50/20 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-8">
        {/* Centered Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* NEW Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-1 py-1 pr-4 mb-8 shadow-sm">
            <span className="rounded-full bg-gray-900 px-2.5 py-0.5 text-xs font-semibold text-white">
              NEW
            </span>
            <span className="text-sm text-gray-600">
              AI Product Management Course
            </span>
            <Icon name="arrow-right" size="xs" className="text-gray-400" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl xl:text-7xl mb-6">
            Master the Future
            <br />
            of AI Learning
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Learn from industry experts and gain practical skills in machine learning,
            deep learning, and AI applications with our comprehensive courses.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link href="/courses">
              <Button size="lg" icon="arrow-right" iconPosition="right">
                Explore Courses
              </Button>
            </Link>
            <Link href="/learn/ml-fundamentals/l-1">
              <button className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm">
                <Icon name="play" size="sm" />
                Watch Preview
              </button>
            </Link>
          </div>
        </div>

        {/* Course Page Image - Floating Product Image */}
        <div className="relative max-w-5xl mx-auto mt-8">
          {/* Gradient glow behind image - Desktop only */}
          <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-lms-primary-200/40 via-purple-100/30 to-lms-coral-200/40 blur-2xl hidden lg:block" />

          {/* Image Container with modern styling */}
          <div className="relative">
            {/* Outer border frame */}
            <div className="rounded-[24px] bg-gradient-to-b from-gray-200 to-gray-300 p-px shadow-2xl">
              <div className="rounded-[23px] bg-gradient-to-b from-white to-gray-50 p-2">
                {/* Inner content area - natural image dimensions */}
                <div className="overflow-hidden rounded-[16px] border border-gray-200">
                  <Image
                    src="/course-page-image.png"
                    alt="LexAI Labs Course Platform"
                    width={1200}
                    height={900}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Featured Courses Section
// ============================================================================

function FeaturedCoursesSection() {
  const featuredCourses = getFeaturedCourses(3);

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-lms-coral-50 border border-lms-coral-100 px-4 py-2">
            <Icon name="star" size="xs" className="text-lms-coral-500" />
            <Text variant="label-sm" className="text-lms-coral-700">Featured Courses</Text>
          </div>
          <Text variant="heading-lg" className="mb-4">
            Start Your AI Journey
          </Text>
          <Text variant="body-lg" tone="secondary" className="max-w-2xl mx-auto">
            Hand-picked courses to help you build practical AI skills,
            whether you&apos;re a developer or business professional.
          </Text>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <CourseCard
                title={course.title}
                description={course.description}
                image={course.thumbnail}
                badge={course.level}
                studentsCount={course.studentsCount}
                coursesCount={course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
              />
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/courses">
            <Button variant="outline" size="lg" icon="arrow-right" iconPosition="right">
              {`View All ${courses.length} Courses`}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Subscription CTA Section
// ============================================================================

function SubscriptionSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-lms-primary-600 via-lms-primary-700 to-lms-primary-800" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 size-96 rounded-full bg-lms-coral-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 size-80 rounded-full bg-lms-primary-400/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
            <Icon name="sparkles" size="xs" className="text-lms-coral-300" />
            <Text variant="label-sm" className="text-white/90">One Subscription</Text>
          </div>

          <Text variant="display-sm" className="text-white mb-4">
            Unlock All Courses
          </Text>
          <Text variant="body-lg" className="text-white/80 max-w-2xl mx-auto mb-8">
            Get unlimited access to all {courses.length} courses, hands-on projects, quizzes,
            and certificates. Learn at your own pace with lifetime access.
          </Text>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            {[
              "All courses included",
              "Lifetime access",
              "Certificates included",
              "New courses added monthly",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="size-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Icon name="check" size="xs" className="text-green-400" />
                </div>
                <Text variant="body-md" className="text-white">{item}</Text>
              </div>
            ))}
          </div>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-lms-primary-600 shadow-lg hover:bg-gray-50 transition-all hover:scale-105"
          >
            Get Started - Free Trial
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Trusted By Section - Marquee Animation
// ============================================================================

function TrustedBySection() {
  const companies = [
    { name: "Google", logo: "/logos/google.png" },
    { name: "Microsoft", logo: "/logos/microsoft.png" },
    { name: "Amazon", logo: "/logos/amazon.png" },
    { name: "Oracle", logo: "/logos/oracle.png" },
    { name: "Meesho", logo: "/logos/meesho.png" },
    { name: "Demandbase", logo: "/logos/demandbase.png" },
  ];

  return (
    <section className="relative py-16 bg-white border-b border-gray-100 overflow-hidden">
      <div className="relative">
        <Text variant="body-sm" tone="tertiary" className="text-center mb-8">
          Our alumni work at leading companies worldwide
        </Text>

        {/* Marquee Container */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrolling logos */}
          <div className="flex animate-marquee">
            {/* First set */}
            <div className="flex shrink-0 items-center gap-16 px-8">
              {companies.map((company) => (
                <div key={company.name} className="flex items-center gap-2 shrink-0">
                  <div className="relative h-6 w-6">
                    <Image
                      src={company.logo}
                      alt={company.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-gray-600 font-semibold text-lg whitespace-nowrap">{company.name}</span>
                </div>
              ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div className="flex shrink-0 items-center gap-16 px-8">
              {companies.map((company) => (
                <div key={`${company.name}-dup`} className="flex items-center gap-2 shrink-0">
                  <div className="relative h-6 w-6">
                    <Image
                      src={company.logo}
                      alt={company.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-gray-600 font-semibold text-lg whitespace-nowrap">{company.name}</span>
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
// Personas Section - Who Is This For
// ============================================================================

function PersonasSection() {
  const personas = [
    {
      id: "engineers",
      label: "Engineers",
      icon: "code" as const,
      title: "Build production-ready ML systems",
      description: "Go beyond tutorials. Learn to architect, deploy, and scale machine learning models in real-world production environments.",
      benefits: [
        "Master MLOps and deployment pipelines",
        "Build scalable ML infrastructure",
        "Learn best practices from industry experts",
        "Hands-on projects with production datasets",
      ],
      gradient: "from-lms-primary-500 to-blue-600",
      lightGradient: "from-lms-primary-50 to-blue-50",
    },
    {
      id: "product-managers",
      label: "Product Managers",
      icon: "grid" as const,
      title: "Lead AI-powered product strategy",
      description: "Understand what's possible with AI and confidently communicate with technical teams to build innovative products.",
      benefits: [
        "Evaluate AI solutions for your products",
        "Communicate effectively with ML teams",
        "Prioritize AI features strategically",
        "Build AI-first product roadmaps",
      ],
      gradient: "from-lms-coral-500 to-orange-500",
      lightGradient: "from-lms-coral-50 to-orange-50",
    },
    {
      id: "leaders",
      label: "Business Leaders",
      icon: "trending-up" as const,
      title: "Drive AI transformation",
      description: "Make informed decisions about AI investments and lead your organization's machine learning initiatives with confidence.",
      benefits: [
        "Understand AI capabilities and limitations",
        "Identify high-impact AI opportunities",
        "Build and manage data science teams",
        "Navigate ethical AI considerations",
      ],
      gradient: "from-purple-500 to-violet-600",
      lightGradient: "from-purple-50 to-violet-50",
    },
    {
      id: "career-changers",
      label: "Career Changers",
      icon: "rocket" as const,
      title: "Launch your AI career",
      description: "Transition into the fastest-growing field in tech. Build the skills employers are looking for, starting from scratch.",
      benefits: [
        "Structured learning path from zero to job-ready",
        "Portfolio projects that impress recruiters",
        "Industry-recognized certifications",
        "Career guidance and interview prep",
      ],
      gradient: "from-emerald-500 to-teal-600",
      lightGradient: "from-emerald-50 to-teal-50",
    },
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-lms-primary-50 border border-lms-primary-100 px-4 py-2">
            <Icon name="users" size="xs" className="text-lms-primary-600" />
            <Text variant="label-sm" className="text-lms-primary-700">For Every Learner</Text>
          </div>
          <Text variant="heading-lg" className="mb-4">
            Built for learners like you
          </Text>
          <Text variant="body-lg" tone="secondary" className="max-w-2xl mx-auto">
            Whether you&apos;re a developer diving into ML, a PM understanding AI capabilities,
            or starting fresh — we&apos;ve got you covered.
          </Text>
        </div>

        {/* Personas Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {personas.map((persona) => (
            <div
              key={persona.id}
              className="group relative rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-lg"
            >
              {/* Top gradient bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${persona.gradient}`} />

              {/* Icon */}
              <div className={`mb-4 size-12 rounded-xl bg-gradient-to-br ${persona.lightGradient} flex items-center justify-center`}>
                <Icon name={persona.icon} size="md" className="text-gray-700" />
              </div>

              {/* Label */}
              <Text variant="label-md" className="mb-2 text-gray-500">{persona.label}</Text>

              {/* Title */}
              <Text variant="heading-sm" className="mb-3">{persona.title}</Text>

              {/* Description */}
              <Text variant="body-sm" tone="secondary" className="mb-6">
                {persona.description}
              </Text>

              {/* Benefits */}
              <ul className="space-y-3">
                {persona.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className={`mt-1 size-4 shrink-0 rounded-full bg-gradient-to-br ${persona.lightGradient} flex items-center justify-center`}>
                      <Icon name="check" size="xs" className="text-gray-600" />
                    </div>
                    <Text variant="body-sm" tone="secondary">{benefit}</Text>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="group/btn flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  <span>Explore courses</span>
                  <Icon name="arrow-right" size="xs" className="transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Testimonials Section - New Card Design
// ============================================================================

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Abhinav Srivastava",
      initials: "AS",
      role: "Consultant, Deloitte",
      content:
        "Puru made machine learning easy to grasp. He turned complex topics into clear, manageable lessons throughout LexAI Fellowship.",
      achievement: "Built production ML confidence",
      avatarColor: "bg-lms-coral-400",
    },
    {
      name: "Maneet Kaur Bagga",
      initials: "MK",
      role: "UX Researcher, MathWorks",
      content:
        "With Puru's practical teaching, I gained real-world ML skills that made a difference in my career.",
      achievement: "Accelerated career trajectory",
      avatarColor: "bg-amber-500",
    },
    {
      name: "Rahul Mehta",
      initials: "RM",
      role: "ML Engineer, Google",
      content:
        "Learning ML with Puru was intuitive. He truly makes advanced concepts accessible for anyone serious about AI.",
      achievement: "Transformed career path",
      avatarColor: "bg-lms-primary-500",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <Text variant="heading-lg" className="mb-4">
            What Our Students Say
          </Text>
          <Text variant="body-lg" tone="secondary">
            Join thousands of learners who have transformed their careers
          </Text>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group flex flex-col rounded-3xl bg-white p-5 border border-tatva-border transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                  <svg width="18" height="14" viewBox="0 0 40 32" fill="none" className="text-lms-primary-500">
                    <path d="M0 20.8C0 13.0667 2.13333 7.46667 6.4 4C10.6667 0.533333 15.4667 -0.8 20.8 0L21.6 4.8C17.0667 5.06667 13.6 6.13333 11.2 8C8.8 9.86667 7.6 12.5333 7.6 16V16.8H18.4V32H0V20.8ZM21.6 20.8C21.6 13.0667 23.7333 7.46667 28 4C32.2667 0.533333 37.0667 -0.8 42.4 0L43.2 4.8C38.6667 5.06667 35.2 6.13333 32.8 8C30.4 9.86667 29.2 12.5333 29.2 16V16.8H40V32H21.6V20.8Z" fill="currentColor"/>
                  </svg>
              </div>

              {/* Testimonial Content */}
              <Text variant="body-sm" className="text-gray-600 leading-relaxed flex-1 mb-4">
                {testimonial.content}
              </Text>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`size-11 rounded-full ${testimonial.avatarColor} flex items-center justify-center shadow-sm`}>
                  <span className="text-white font-semibold text-sm">{testimonial.initials}</span>
                </div>
                <div className="flex flex-col">
                  <Text variant="label-sm" className="text-gray-900">{testimonial.name}</Text>
                  <Text variant="body-xs" tone="tertiary" className="mt-0.5">{testimonial.role}</Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustedBySection />
      <FeaturedCoursesSection />
      <InstructorSection
        name={instructor.name}
        role={instructor.role}
        bio={instructor.bio}
        bioPoints={instructor.bioPoints}
        avatar={instructor.avatar}
        credentials={instructor.credentials}
      />
      <TestimonialsSection />
      <SubscriptionSection />
    </main>
  );
}
