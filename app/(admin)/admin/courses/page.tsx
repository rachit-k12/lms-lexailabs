"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Text, Button, Table, Badge, Dialog, toast } from "@/components";
import { getCourses, deleteCourse, getErrorMessage } from "@/lib/api";
import type { CourseListItem } from "@/lib/api";
import type { TableColumn, TableAction } from "@/components";

export default function AdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const pageSize = 20;

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<CourseListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      setIsLoading(true);
      try {
        const offset = (currentPage - 1) * pageSize;
        const data = await getCourses({
          limit: pageSize,
          offset,
          search: searchQuery || undefined,
        });
        setCourses(data.courses);
        setTotalRows(data.pagination.total);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
  }, [currentPage, searchQuery]);

  const handleDeleteClick = (course: CourseListItem) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;

    setIsDeleting(true);
    try {
      await deleteCourse(courseToDelete.id);
      toast.success({ title: "Course Deleted", description: "The course has been deleted successfully" });
      // Refresh the list
      setCourses((prev) => prev.filter((c) => c.id !== courseToDelete.id));
      setTotalRows((prev) => prev - 1);
    } catch (err) {
      toast.error({ title: "Delete Failed", description: getErrorMessage(err) });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const columns: TableColumn<CourseListItem>[] = useMemo(
    () => [
      {
        id: "title",
        header: "Course",
        accessorKey: "title",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.thumbnail ? (
              <img
                src={row.original.thumbnail}
                alt={row.original.title}
                className="size-10 rounded-lg object-cover"
              />
            ) : (
              <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Text variant="body-xs" tone="tertiary">
                  {row.original.title.charAt(0)}
                </Text>
              </div>
            )}
            <div>
              <Text variant="body-md" className="font-medium">
                {row.original.title}
              </Text>
              <Text variant="body-xs" tone="secondary">
                {row.original.slug}
              </Text>
            </div>
          </div>
        ),
      },
      {
        id: "category",
        header: "Category",
        accessorKey: "category",
        cell: ({ row }) => (
          <Badge
            type="label"
            variant={row.original.category === "engineering" ? "indigo" : "default"}
            size="sm"
          >
            {row.original.category === "engineering" ? "Engineering" : "Non-Engineering"}
          </Badge>
        ),
      },
      {
        id: "level",
        header: "Level",
        accessorKey: "level",
        cell: ({ row }) => (
          <Badge type="label" variant="default" size="sm">
            {row.original.level}
          </Badge>
        ),
      },
      {
        id: "modules",
        header: "Modules",
        accessorKey: "totalModules",
      },
      {
        id: "students",
        header: "Students",
        accessorKey: "studentsCount",
      },
      {
        id: "rating",
        header: "Rating",
        accessorKey: "rating",
        cell: ({ row }) => (
          <Text variant="body-md">
            {row.original.rating.toFixed(1)} ({row.original.reviewsCount})
          </Text>
        ),
      },
    ],
    []
  );

  const getActions = (): TableAction<CourseListItem>[] => [
    {
      label: "Edit",
      icon: "edit",
      onClick: (course) => router.push(`/admin/courses/${course.slug}/edit`),
    },
    {
      label: "View",
      icon: "eye",
      onClick: (course) => router.push(`/courses/${course.slug}`),
    },
    {
      label: "Delete",
      icon: "trash-2",
      onClick: handleDeleteClick,
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Text variant="heading-lg" className="mb-1">
            Courses
          </Text>
          <Text variant="body-md" tone="secondary">
            Manage all courses on the platform
          </Text>
        </div>
        <Link href="/admin/courses/new">
          <Button variant="primary" icon="plus">
            Create Course
          </Button>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Courses Table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <Table
          columns={columns}
          data={courses}
          isLoading={isLoading}
          actions={getActions}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search courses..."
          currentPage={currentPage}
          pageSize={pageSize}
          totalRows={totalRows}
          onPageChange={setCurrentPage}
          emptyTitle="No courses found"
          emptyDescription="Get started by creating your first course"
          emptyAction={{
            label: "Create Course",
            onClick: () => router.push("/admin/courses/new"),
          }}
          showColumnFilter={false}
          showExport={false}
          showAddFilter={false}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Course"
        description={`Are you sure you want to delete "${courseToDelete?.title}"? This action cannot be undone.`}
        submitButtonText="Delete"
        submitButtonVariant="destructive"
        onSubmit={handleDeleteConfirm}
        isSubmitting={isDeleting}
        cancelButtonText="Cancel"
        size="sm"
      />
    </div>
  );
}
