"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Text,
  Button,
  Input,
  TagInput,
  Switch,
  Breadcrumbs,
  DatePicker,
  Badge,
  MetricCard,
  Dialog,
} from "@/components";
import {
  getOrganization,
  updateOrganization,
  addInstitutionAdmin,
  getErrorMessage,
} from "@/lib/api";
import type { Organization } from "@/lib/api";
import { toast } from "sonner";

interface OrganizationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrganizationDetailPage({ params }: OrganizationDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [emailDomains, setEmailDomains] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [contractStart, setContractStart] = useState<Date | undefined>();
  const [contractEnd, setContractEnd] = useState<Date | undefined>();

  // Add admin dialog state
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  useEffect(() => {
    async function fetchOrganization() {
      try {
        const data = await getOrganization(id);
        setOrganization(data.organization);

        // Populate form
        setName(data.organization.name);
        setSlug(data.organization.slug);
        setEmailDomains(data.organization.emailDomains);
        setIsActive(data.organization.isActive);
        if (data.organization.contractStart) {
          setContractStart(new Date(data.organization.contractStart));
        }
        if (data.organization.contractEnd) {
          setContractEnd(new Date(data.organization.contractEnd));
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
        router.push("/admin/organizations");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrganization();
  }, [id, router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateOrganization(id, {
        name,
        slug,
        emailDomains,
        isActive,
        contractStart: contractStart?.toISOString(),
        contractEnd: contractEnd?.toISOString(),
      });
      setOrganization(result.organization);
      toast.success("Organization updated successfully");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!adminName.trim() || !adminEmail.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setIsAddingAdmin(true);
    try {
      await addInstitutionAdmin(id, {
        name: adminName,
        email: adminEmail,
        password: adminPassword || undefined,
      });
      toast.success("Admin added successfully");
      setAddAdminOpen(false);
      setAdminName("");
      setAdminEmail("");
      setAdminPassword("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsAddingAdmin(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (!organization) return null;

  return (
    <div className="p-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Organizations", href: "/admin/organizations" },
            { label: organization.name },
          ]}
          linkComponent={Link}
        />
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <Text variant="heading-lg" className="mb-1">
              {organization.name}
            </Text>
            <Text variant="body-md" tone="secondary">
              {organization.slug}
            </Text>
          </div>
          <Badge
            type="label"
            variant={organization.isActive ? "success" : "danger"}
            size="md"
          >
            {organization.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon="plus"
            onClick={() => setAddAdminOpen(true)}
          >
            Add Admin
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          heading="Members"
          value={organization._count?.members || 0}
        />
        <MetricCard
          heading="Student Records"
          value={organization._count?.studentRecords || 0}
        />
        <MetricCard
          heading="Courses"
          value={organization._count?.courseAccess || 0}
        />
      </div>

      {/* Quick Links */}
      <div className="mb-8 flex gap-4">
        <Link href={`/admin/organizations/${id}/students`}>
          <Button variant="secondary" icon="users">
            Manage Students
          </Button>
        </Link>
        <Link href={`/admin/organizations/${id}/courses`}>
          <Button variant="secondary" icon="book-open">
            Course Access
          </Button>
        </Link>
      </div>

      {/* Form */}
      <div className="space-y-6 max-w-2xl">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <Text variant="heading-sm" className="mb-6">
            Organization Details
          </Text>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Organization name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="organization-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Domains
              </label>
              <TagInput
                value={emailDomains}
                onChange={setEmailDomains}
                placeholder="Add email domains"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Text variant="body-md">Active</Text>
                <Text variant="body-sm" tone="secondary">
                  Allow members to access the platform
                </Text>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <Text variant="heading-sm" className="mb-6">
            Contract Period
          </Text>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <DatePicker
                value={contractStart}
                onChange={setContractStart}
                placeholder="Select start date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <DatePicker
                value={contractEnd}
                onChange={setContractEnd}
                placeholder="Select end date"
              />
            </div>
          </div>
        </section>

        {/* Batches */}
        {organization.batches && organization.batches.length > 0 && (
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <Text variant="heading-sm" className="mb-6">
              Batches
            </Text>
            <div className="space-y-2">
              {organization.batches.map((batch) => (
                <div
                  key={batch.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                >
                  <Text variant="body-md">{batch.name}</Text>
                  <Badge
                    type="label"
                    variant={batch.isActive ? "success" : "neutral"}
                    size="sm"
                  >
                    {batch.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Add Admin Dialog */}
      <Dialog
        open={addAdminOpen}
        onOpenChange={setAddAdminOpen}
        title="Add Institution Admin"
        description="Add an administrator for this organization"
        submitButtonText="Add Admin"
        onSubmit={handleAddAdmin}
        isSubmitting={isAddingAdmin}
        size="md"
      >
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <Input
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Admin name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password (optional)
            </label>
            <Input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Leave blank to send invite email"
            />
            <Text variant="body-xs" tone="tertiary" className="mt-1">
              If left blank, the user will receive an email to set their password
            </Text>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
