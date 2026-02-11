"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Text,
  Button,
  Badge,
  Dialog,
  Breadcrumbs,
  Select,
} from "@/components";
import {
  getOrganization,
  getInstitutionCourses,
  assignCourseAccess,
  removeCourseAccess,
  getCourses,
  getErrorMessage,
} from "@/lib/api";
import type { Organization, CourseListItem } from "@/lib/api";
import { toast } from "sonner";

interface CourseAccessPageProps {
  params: Promise<{ id: string }>;
}

interface CourseAccess {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  batchId?: string;
  batchName?: string;
  type: "organization" | "batch";
}

export default function OrganizationCoursesPage({ params }: CourseAccessPageProps) {
  const { id: orgId } = use(params);

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [courseAccess, setCourseAccess] = useState<CourseAccess[]>([]);
  const [availableCourses, setAvailableCourses] = useState<CourseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add access dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  // Remove access dialog
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [accessToRemove, setAccessToRemove] = useState<CourseAccess | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [orgData, accessData, coursesData] = await Promise.all([
          getOrganization(orgId),
          getInstitutionCourses(orgId),
          getCourses({ limit: 100 }),
        ]);

        setOrganization(orgData.organization);
        setAvailableCourses(coursesData.courses);

        // Transform course access data
        const accessList: CourseAccess[] = [];

        // Organization-level access
        accessData.organizationCourses.forEach((item) => {
          accessList.push({
            id: item.id,
            courseId: item.courseId,
            courseTitle: item.course.title,
            courseSlug: item.course.slug,
            type: "organization",
          });
        });

        // Batch-level access
        accessData.batchCourses.forEach((item) => {
          accessList.push({
            id: item.id,
            courseId: item.courseId,
            courseTitle: item.course.title,
            courseSlug: item.course.slug,
            batchId: item.batchId,
            batchName: item.batch.name,
            type: "batch",
          });
        });

        setCourseAccess(accessList);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [orgId]);

  const handleAddAccess = async () => {
    if (!selectedCourseId) {
      toast.error("Please select a course");
      return;
    }

    setIsAdding(true);
    try {
      await assignCourseAccess(orgId, {
        courseId: selectedCourseId,
        batchId: selectedBatchId || undefined,
      });
      toast.success("Course access granted");

      // Refresh the access list
      const accessData = await getInstitutionCourses(orgId);
      const accessList: CourseAccess[] = [];

      accessData.organizationCourses.forEach((item) => {
        accessList.push({
          id: item.id,
          courseId: item.courseId,
          courseTitle: item.course.title,
          courseSlug: item.course.slug,
          type: "organization",
        });
      });

      accessData.batchCourses.forEach((item) => {
        accessList.push({
          id: item.id,
          courseId: item.courseId,
          courseTitle: item.course.title,
          courseSlug: item.course.slug,
          batchId: item.batchId,
          batchName: item.batch.name,
          type: "batch",
        });
      });

      setCourseAccess(accessList);
      setAddDialogOpen(false);
      setSelectedCourseId("");
      setSelectedBatchId("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveAccess = async () => {
    if (!accessToRemove) return;

    setIsRemoving(true);
    try {
      await removeCourseAccess(
        orgId,
        accessToRemove.courseId,
        accessToRemove.batchId
      );
      setCourseAccess((prev) =>
        prev.filter((a) => a.id !== accessToRemove.id)
      );
      toast.success("Course access removed");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsRemoving(false);
      setRemoveDialogOpen(false);
      setAccessToRemove(null);
    }
  };

  const courseOptions = availableCourses.map((c) => ({
    value: c.id,
    label: c.title,
  }));

  const batchOptions = [
    { value: "", label: "All Members (Organization-wide)" },
    ...(organization?.batches?.map((b) => ({
      value: b.id,
      label: b.name,
    })) || []),
  ];

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Organizations", href: "/admin/organizations" },
            { label: organization?.name || "", href: `/admin/organizations/${orgId}` },
            { label: "Course Access" },
          ]}
          linkComponent={Link}
        />
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Text variant="heading-lg" className="mb-1">
            Course Access
          </Text>
          <Text variant="body-md" tone="secondary">
            Manage course access for {organization?.name}
          </Text>
        </div>
        <Button
          variant="primary"
          icon="plus"
          onClick={() => setAddDialogOpen(true)}
        >
          Grant Access
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Course Access List */}
      {courseAccess.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Text variant="heading-sm" className="mb-2">
            No course access configured
          </Text>
          <Text variant="body-md" tone="secondary" className="mb-4">
            Grant access to courses for this organization
          </Text>
          <Button
            variant="primary"
            icon="plus"
            onClick={() => setAddDialogOpen(true)}
          >
            Grant Access
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {courseAccess.map((access) => (
            <div
              key={access.id}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white"
            >
              <div className="flex items-center gap-4">
                <div>
                  <Text variant="body-md" className="font-medium">
                    {access.courseTitle}
                  </Text>
                  <Text variant="body-xs" tone="secondary">
                    {access.courseSlug}
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  type="label"
                  variant={access.type === "organization" ? "default" : "neutral"}
                  size="sm"
                >
                  {access.type === "organization"
                    ? "All Members"
                    : access.batchName}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="trash-2"
                  onClick={() => {
                    setAccessToRemove(access);
                    setRemoveDialogOpen(true);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Access Dialog */}
      <Dialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        title="Grant Course Access"
        description="Allow organization members to access a course"
        submitButtonText="Grant Access"
        onSubmit={handleAddAccess}
        isSubmitting={isAdding}
        size="md"
      >
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course *
            </label>
            <Select
              value={selectedCourseId}
              onChange={(value) => setSelectedCourseId(value as string)}
              options={courseOptions}
              placeholder="Select a course"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Access Level
            </label>
            <Select
              value={selectedBatchId}
              onChange={(value) => setSelectedBatchId(value as string)}
              options={batchOptions}
            />
            <Text variant="body-xs" tone="tertiary" className="mt-1">
              Choose whether to grant access to all members or a specific batch
            </Text>
          </div>
        </div>
      </Dialog>

      {/* Remove Access Dialog */}
      <Dialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        title="Remove Course Access"
        description={`Are you sure you want to remove access to "${accessToRemove?.courseTitle}" for ${accessToRemove?.batchName || "all members"}?`}
        submitButtonText="Remove"
        submitButtonVariant="danger"
        onSubmit={handleRemoveAccess}
        isSubmitting={isRemoving}
        size="sm"
      />
    </div>
  );
}
