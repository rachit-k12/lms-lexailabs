"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Text, Button, Table, Badge } from "@/components";
import { getOrganizations, getErrorMessage } from "@/lib/api";
import type { Organization, TableColumn, TableAction } from "@/lib/api";
import { toast } from "@/components";

export default function AdminOrganizationsPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchOrganizations() {
      setIsLoading(true);
      try {
        const data = await getOrganizations();
        setOrganizations(data.organizations);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrganizations();
  }, []);

  // Filter organizations by search query
  const filteredOrganizations = useMemo(() => {
    if (!searchQuery) return organizations;
    const query = searchQuery.toLowerCase();
    return organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(query) ||
        org.slug.toLowerCase().includes(query) ||
        org.emailDomains.some((d) => d.toLowerCase().includes(query))
    );
  }, [organizations, searchQuery]);

  const columns: TableColumn<Organization>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Organization",
        accessorKey: "name",
        cell: ({ row }) => (
          <div>
            <Text variant="body-md" className="font-medium">
              {row.original.name}
            </Text>
            <Text variant="body-xs" tone="secondary">
              {row.original.slug}
            </Text>
          </div>
        ),
      },
      {
        id: "emailDomains",
        header: "Email Domains",
        accessorKey: "emailDomains",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.emailDomains.slice(0, 2).map((domain) => (
              <Badge key={domain} type="label" variant="neutral" size="sm">
                {domain}
              </Badge>
            ))}
            {row.original.emailDomains.length > 2 && (
              <Badge type="label" variant="neutral" size="sm">
                +{row.original.emailDomains.length - 2}
              </Badge>
            )}
          </div>
        ),
      },
      {
        id: "members",
        header: "Members",
        accessorKey: "_count.members",
        cell: ({ row }) => (
          <Text variant="body-md">{row.original._count?.members || 0}</Text>
        ),
      },
      {
        id: "students",
        header: "Students",
        accessorKey: "_count.studentRecords",
        cell: ({ row }) => (
          <Text variant="body-md">{row.original._count?.studentRecords || 0}</Text>
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
        id: "contract",
        header: "Contract",
        accessorKey: "contractEnd",
        cell: ({ row }) => {
          const end = row.original.contractEnd;
          if (!end) return <Text variant="body-md" tone="tertiary">-</Text>;
          const endDate = new Date(end);
          const isExpired = endDate < new Date();
          return (
            <Text
              variant="body-md"
              className={isExpired ? "text-red-500" : ""}
            >
              {endDate.toLocaleDateString()}
            </Text>
          );
        },
      },
    ],
    []
  );

  const actions: TableAction<Organization>[] = [
    {
      label: "View Details",
      icon: "eye",
      onClick: (org) => router.push(`/admin/organizations/${org.id}`),
    },
    {
      label: "Manage Students",
      icon: "users",
      onClick: (org) => router.push(`/admin/organizations/${org.id}/students`),
    },
    {
      label: "Course Access",
      icon: "book-open",
      onClick: (org) => router.push(`/admin/organizations/${org.id}/courses`),
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Text variant="heading-lg" className="mb-1">
            Organizations
          </Text>
          <Text variant="body-md" tone="secondary">
            Manage institutional partners and their access
          </Text>
        </div>
        <Link href="/admin/organizations/new">
          <Button variant="primary" icon="plus">
            Add Organization
          </Button>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Organizations Table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <Table
          columns={columns}
          data={filteredOrganizations}
          isLoading={isLoading}
          actions={actions}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search organizations..."
          emptyTitle="No organizations found"
          emptyDescription="Get started by adding your first organization"
          emptyAction={{
            label: "Add Organization",
            onClick: () => router.push("/admin/organizations/new"),
          }}
          showColumnFilter={false}
          showExport={false}
          showAddFilter={false}
        />
      </div>
    </div>
  );
}
