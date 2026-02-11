"use client";

import { useState, useEffect, useMemo } from "react";
import { Text, Table, Badge, Dialog, Select, Switch } from "@/components";
import { getUsers, updateUser, getErrorMessage } from "@/lib/api";
import type { AdminUser, TableColumn, TableAction } from "@/lib/api";
import { toast } from "sonner";

const ROLE_OPTIONS = [
  { value: "STUDENT", label: "Student" },
  { value: "INSTRUCTOR", label: "Instructor" },
  { value: "INSTITUTION_ADMIN", label: "Institution Admin" },
  { value: "PLATFORM_ADMIN", label: "Platform Admin" },
];

const ROLE_COLORS: Record<string, string> = {
  STUDENT: "neutral",
  INSTRUCTOR: "default",
  INSTITUTION_ADMIN: "default",
  PLATFORM_ADMIN: "success",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const pageSize = 20;

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editRole, setEditRole] = useState<string>("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const data = await getUsers({
          page: currentPage,
          limit: pageSize,
          search: searchQuery || undefined,
        });
        setUsers(data.users);
        setTotalRows(data.pagination.total);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, [currentPage, searchQuery]);

  const handleEditClick = (user: AdminUser) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditIsActive(user.isActive);
    setEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    setIsSaving(true);
    try {
      const result = await updateUser(editingUser.id, {
        role: editRole,
        isActive: editIsActive,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? result.user : u))
      );
      toast.success("User updated successfully");
      setEditDialogOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const columns: TableColumn<AdminUser>[] = useMemo(
    () => [
      {
        id: "name",
        header: "User",
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
        id: "role",
        header: "Role",
        accessorKey: "role",
        cell: ({ row }) => (
          <Badge
            type="label"
            variant={ROLE_COLORS[row.original.role] as any || "neutral"}
            size="sm"
          >
            {row.original.role.replace("_", " ")}
          </Badge>
        ),
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "isActive",
        cell: ({ row }) => (
          <Badge
            type="label"
            variant={row.original.isActive ? "success" : "danger"}
            size="sm"
          >
            {row.original.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        id: "verified",
        header: "Email Verified",
        accessorKey: "emailVerified",
        cell: ({ row }) => (
          <Badge
            type="label"
            variant={row.original.emailVerified ? "success" : "neutral"}
            size="sm"
          >
            {row.original.emailVerified ? "Verified" : "Pending"}
          </Badge>
        ),
      },
      {
        id: "organizations",
        header: "Organizations",
        accessorKey: "_count.organizationMembers",
        cell: ({ row }) => (
          <Text variant="body-md">
            {row.original._count?.organizationMembers || 0}
          </Text>
        ),
      },
      {
        id: "createdAt",
        header: "Joined",
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

  const actions: TableAction<AdminUser>[] = [
    {
      label: "Edit",
      icon: "edit",
      onClick: handleEditClick,
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Text variant="heading-lg" className="mb-1">
          Users
        </Text>
        <Text variant="body-md" tone="secondary">
          Manage platform users and their roles
        </Text>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <Table
          columns={columns}
          data={users}
          isLoading={isLoading}
          actions={actions}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search users..."
          currentPage={currentPage}
          pageSize={pageSize}
          totalRows={totalRows}
          onPageChange={setCurrentPage}
          emptyTitle="No users found"
          emptyDescription="Users will appear here once they sign up"
          showColumnFilter={false}
          showExport={false}
          showAddFilter={false}
        />
      </div>

      {/* Edit User Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit User"
        description={`Update role and status for ${editingUser?.name}`}
        submitButtonText="Save"
        onSubmit={handleSaveUser}
        isSubmitting={isSaving}
        size="sm"
      >
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Select
              value={editRole}
              onChange={(value) => setEditRole(value as string)}
              options={ROLE_OPTIONS}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Text variant="body-md">Active</Text>
              <Text variant="body-sm" tone="secondary">
                Allow user to access the platform
              </Text>
            </div>
            <Switch checked={editIsActive} onCheckedChange={setEditIsActive} />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
