import { Text, Icon, InstructorSection } from "@/components";
import { instructor } from "@/lib/data";

export default function AboutPage() {
  return (
    <main className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Text variant="display-sm" className="mb-4">
            About LexAI Labs
          </Text>
          <Text variant="body-lg" tone="secondary" className="max-w-2xl mx-auto">
            We&apos;re on a mission to democratize AI education and help professionals
            build practical machine learning skills.
          </Text>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <Text variant="heading-md" className="mb-4">Our Mission</Text>
            <Text variant="body-md" tone="secondary" className="mb-6">
              At LexAI Labs, we believe that AI education should be accessible, practical,
              and directly applicable to real-world challenges. Our courses are designed
              by industry practitioners who understand what it takes to build production-ready
              machine learning systems.
            </Text>
            <Text variant="body-md" tone="secondary">
              We focus on hands-on learning, real-world projects, and the skills that
              employers are actually looking for. No fluff, no outdated content — just
              practical AI education that works.
            </Text>
          </div>
          <div className="space-y-6">
            {[
              { icon: "users" as const, title: "50,000+", description: "Students trained worldwide" },
              { icon: "audio-book" as const, title: "8", description: "Comprehensive courses" },
              { icon: "star" as const, title: "4.9/5", description: "Average course rating" },
              { icon: "building" as const, title: "100+", description: "Companies hire our alumni" },
            ].map((stat) => (
              <div key={stat.title} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <div className="size-12 rounded-xl bg-lms-primary-50 flex items-center justify-center">
                  <Icon name={stat.icon} size="md" className="text-lms-primary-600" />
                </div>
                <div>
                  <Text variant="heading-sm">{stat.title}</Text>
                  <Text variant="body-sm" tone="tertiary">{stat.description}</Text>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructor Section */}
        <InstructorSection
          name={instructor.name}
          role={instructor.role}
          bio={instructor.bio}
          avatar={instructor.avatar}
          credentials={instructor.credentials}
                  />
      </div>
    </main>
  );
}
