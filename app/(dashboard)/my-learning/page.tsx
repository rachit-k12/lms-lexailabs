"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Text, Button, Badge, PaymentButton, CourseCard } from "@/components";
import { useAuth } from "@/lib/contexts/auth-context";
import { usePaymentStatus } from "@/lib/hooks";
import { getEnrollments, getErrorMessage, type EnrollmentWithCourse } from "@/lib/api";

type TabType = "all" | "in-progress" | "completed";

export default function MyLearningPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { status: paymentStatus, loading: paymentLoading, refetch: refetchPayment } = usePaymentStatus();
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const fetchEnrollments = async () => {
    try {
      const data = await getEnrollments();
      setEnrollments(data.enrollments);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handlePaymentSuccess = async () => {
    await refetchPayment();
    await fetchEnrollments();
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (activeTab === "all") return true;
    if (activeTab === "in-progress") return enrollment.status === "in-progress";
    if (activeTab === "completed") return enrollment.status === "completed";
    return true;
  });

  const stats = {
    total: enrollments.length,
    inProgress: enrollments.filter((e) => e.status === "in-progress").length,
    completed: enrollments.filter((e) => e.status === "completed").length,
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-lms-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <Text variant="heading-lg" className="mb-2">
          Welcome back, {user?.name?.split(" ")[0] || "Learner"}!
        </Text>
        <Text variant="body-md" tone="secondary">
          Continue your learning journey
        </Text>
      </div>

      {/* Premium Status Card */}
      {!paymentLoading && !paymentStatus?.hasAccess && (
        <div className="mb-6 rounded-xl border border-lms-primary-200 bg-gradient-to-r from-lms-primary-50 to-indigo-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Text variant="heading-sm" className="mb-1">
                Unlock All Courses
              </Text>
              <Text variant="body-sm" tone="secondary">
                Get lifetime access to all courses with a one-time payment of ₹499
              </Text>
            </div>
            <PaymentButton
              variant="button"
              size="md"
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-4">
        {/* Access Status */}
        <div className={`rounded-xl border p-6 ${
          paymentStatus?.hasAccess
            ? "border-green-200 bg-green-50"
            : "border-gray-200 bg-white"
        }`}>
          <Text variant="body-sm" tone="secondary" className="mb-1">
            Access Status
          </Text>
          <Text variant="heading-sm" className={paymentStatus?.hasAccess ? "text-green-600" : ""}>
            {paymentStatus?.hasAccess
              ? paymentStatus.accessType === "institution"
                ? "Institution"
                : "Premium"
              : "Free"}
          </Text>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <Text variant="body-sm" tone="secondary" className="mb-1">
            Total Courses
          </Text>
          <Text variant="heading-lg">{stats.total}</Text>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <Text variant="body-sm" tone="secondary" className="mb-1">
            In Progress
          </Text>
          <Text variant="heading-lg" className="text-lms-primary-600">
            {stats.inProgress}
          </Text>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <Text variant="body-sm" tone="secondary" className="mb-1">
            Completed
          </Text>
          <Text variant="heading-lg" className="text-green-600">
            {stats.completed}
          </Text>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 border-b border-gray-200">
        {[
          { key: "all", label: "All Courses" },
          { key: "in-progress", label: "In Progress" },
          { key: "completed", label: "Completed" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabType)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-lms-primary-600 text-lms-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-8 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Course Grid */}
      {filteredEnrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-6">
            <svg
              className="size-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <Text variant="heading-sm" className="mb-2">
            {activeTab === "all"
              ? "No courses yet"
              : activeTab === "in-progress"
              ? "No courses in progress"
              : "No completed courses"}
          </Text>
          <Text variant="body-md" tone="secondary" className="mb-6">
            {activeTab === "all"
              ? "Explore our catalog and start learning today!"
              : "Keep learning to see your progress here."}
          </Text>
          {activeTab === "all" && (
            <Link href="/courses">
              <Button variant="primary">Browse Courses</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEnrollments.map((enrollment) => (
            <CourseCard
              key={enrollment.courseId}
              title={enrollment.title}
              description={enrollment.description || `${enrollment.completedLessons} / ${enrollment.totalLessons} lessons`}
              image={enrollment.thumbnail}
              badge={enrollment.category === "engineering" ? "Engineering" : "Non-Engineering"}
              progress={enrollment.progressPercentage}
              onStartLearning={() => router.push(`/courses/${enrollment.slug}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
