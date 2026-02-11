"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Text,
  Button,
  Table,
  Badge,
  Dialog,
  Breadcrumbs,
  FileUpload,
} from "@/components";
import {
  getOrganization,
  getInstitutionStudents,
  deleteStudentRecord,
  uploadStudentCSV,
  getErrorMessage,
} from "@/lib/api";
import type { Organization, StudentRecord, TableColumn, TableAction } from "@/lib/api";
import { toast } from "sonner";

interface OrganizationStudentsPageProps {
  params: Promise<{ id: string }>;
}

export default function OrganizationStudentsPage({ params }: OrganizationStudentsPageProps) {
  const { id: orgId } = use(params);
  const router = useRouter();

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const pageSize = 20;

  // Upload dialog state
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [orgData, studentsData] = await Promise.all([
          getOrganization(orgId),
          getInstitutionStudents(orgId, {
            page: currentPage,
            limit: pageSize,
            search: searchQuery || undefined,
          }),
        ]);
        setOrganization(orgData.organization);
        setStudents(studentsData.students);
        setTotalRows(studentsData.pagination.total);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [orgId, currentPage, searchQuery]);

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadStudentCSV(orgId, uploadFile);
      setUploadResult(result);
      toast.success(`Processed ${result.stats.totalProcessed} students`);

      // Refresh the list
      const studentsData = await getInstitutionStudents(orgId, {
        page: 1,
        limit: pageSize,
      });
      setStudents(studentsData.students);
      setTotalRows(studentsData.pagination.total);
      setCurrentPage(1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;

    setIsDeleting(true);
    try {
      await deleteStudentRecord(orgId, studentToDelete.id);
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
      setTotalRows((prev) => prev - 1);
      toast.success("Student record deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  const columns: TableColumn<StudentRecord>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Student",
        accessorKey: "name",
        cell: ({ row }) => (
          <div>
            <Text variant="body-md" className="font-medium">
              {row.original.name}
            </Text>
            <Text variant="body-xs" tone="secondary">
              {row.original.email}
            </Text>
          </div>
        ),
      },
      {
        id: "enrollmentId",
        header: "Enrollment ID",
        accessorKey: "enrollmentId",
      },
      {
        id: "batch",
        header: "Batch",
        accessorKey: "batch.name",
        cell: ({ row }) => (
          <Text variant="body-md">
            {row.original.batch?.name || "-"}
          </Text>
        ),
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "isClaimed",
        cell: ({ row }) => (
          <Badge
            type="label"
            variant={row.original.isClaimed ? "success" : "neutral"}
            size="sm"
          >
            {row.original.isClaimed ? "Claimed" : "Unclaimed"}
          </Badge>
        ),
      },
      {
        id: "claimedBy",
        header: "Claimed By",
        accessorKey: "claimedBy.name",
        cell: ({ row }) => (
          <Text variant="body-md">
            {row.original.claimedBy?.name || "-"}
          </Text>
        ),
      },
      {
        id: "createdAt",
        header: "Added",
        accessorKey: "createdAt",
        cell: ({ row }) => (
          <Text variant="body-md">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </Text>
        ),
      },
    ],
    []
  );

  const actions: TableAction<StudentRecord>[] = [
    {
      label: "Delete",
      icon: "trash-2",
      onClick: (student) => {
        setStudentToDelete(student);
        setDeleteDialogOpen(true);
      },
      variant: "danger",
    },
  ];

  if (isLoading && !organization) {
    return (
      <div className="p-8">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200 mb-8" />
        <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
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
            { label: "Students" },
          ]}
          linkComponent={Link}
        />
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Text variant="heading-lg" className="mb-1">
            Students
          </Text>
          <Text variant="body-md" tone="secondary">
            Manage student records for {organization?.name}
          </Text>
        </div>
        <Button
          variant="primary"
          icon="upload"
          onClick={() => {
            setUploadFile(null);
            setUploadResult(null);
            setUploadDialogOpen(true);
          }}
        >
          Upload CSV
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Students Table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <Table
          columns={columns}
          data={students}
          isLoading={isLoading}
          actions={actions}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search students..."
          currentPage={currentPage}
          pageSize={pageSize}
          totalRows={totalRows}
          onPageChange={setCurrentPage}
          emptyTitle="No students found"
          emptyDescription="Upload a CSV file to add students"
          emptyAction={{
            label: "Upload CSV",
            onClick: () => setUploadDialogOpen(true),
          }}
          showColumnFilter={false}
          showExport={false}
          showAddFilter={false}
        />
      </div>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        title="Upload Student CSV"
        description="Upload a CSV file containing student records"
        submitButtonText={uploadResult ? "Close" : "Upload"}
        onSubmit={uploadResult ? () => setUploadDialogOpen(false) : handleUpload}
        isSubmitting={isUploading}
        size="md"
      >
        <div className="py-4">
          {uploadResult ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4">
                <Text variant="body-md" className="font-medium text-green-800 mb-2">
                  Upload Complete
                </Text>
                <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                  <div>Added: {uploadResult.stats.added}</div>
                  <div>Updated: {uploadResult.stats.updated}</div>
                  <div>Auto-linked: {uploadResult.stats.autoLinked}</div>
                  <div>Already claimed: {uploadResult.stats.alreadyClaimed}</div>
                  <div>Parse errors: {uploadResult.stats.parseErrors}</div>
                  <div>Total processed: {uploadResult.stats.totalProcessed}</div>
                </div>
              </div>
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="rounded-lg bg-red-50 p-4">
                  <Text variant="body-md" className="font-medium text-red-800 mb-2">
                    Errors
                  </Text>
                  <ul className="text-sm text-red-700 space-y-1">
                    {uploadResult.errors.slice(0, 10).map((err: any, i: number) => (
                      <li key={i}>
                        Row {err.row}: {err.message}
                      </li>
                    ))}
                    {uploadResult.errors.length > 10 && (
                      <li>...and {uploadResult.errors.length - 10} more</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <FileUpload
                value={uploadFile ? [uploadFile] : []}
                onChange={(files) => setUploadFile(files[0] || null)}
                accept=".csv"
                maxFiles={1}
              />
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <Text variant="body-sm" className="font-medium mb-2">
                  CSV Format
                </Text>
                <Text variant="body-xs" tone="secondary">
                  The CSV should have the following columns:
                </Text>
                <code className="block mt-2 text-xs bg-gray-100 p-2 rounded">
                  name,email,enrollmentId,batchName
                </code>
              </div>
            </>
          )}
        </div>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Student Record"
        description={`Are you sure you want to delete the record for "${studentToDelete?.name}"? This will not delete the user account if they have claimed the record.`}
        submitButtonText="Delete"
        submitButtonVariant="danger"
        onSubmit={handleDeleteConfirm}
        isSubmitting={isDeleting}
        size="sm"
      />
    </div>
  );
}
