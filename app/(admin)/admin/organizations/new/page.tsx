"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Text,
  Button,
  Input,
  TagInput,
  Breadcrumbs,
  DatePicker,
} from "@/components";
import { createOrganization, getErrorMessage } from "@/lib/api";
import { toast } from "@/components";

export default function NewOrganizationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [emailDomains, setEmailDomains] = useState<string[]>([]);
  const [contractStart, setContractStart] = useState<Date | undefined>();
  const [contractEnd, setContractEnd] = useState<Date | undefined>();

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(generatedSlug);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error({ title: "Validation Error", description: "Name is required" });
      return;
    }
    if (!slug.trim()) {
      toast.error({ title: "Validation Error", description: "Slug is required" });
      return;
    }
    if (emailDomains.length === 0) {
      toast.error({ title: "Validation Error", description: "At least one email domain is required" });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createOrganization({
        name: name.trim(),
        slug: slug.trim(),
        emailDomains,
        contractStart: contractStart?.toISOString(),
        contractEnd: contractEnd?.toISOString(),
      });
      toast.success({ title: "Organization Created", description: "The organization has been created successfully" });
      router.push(`/admin/organizations/${result.organization.id}`);
    } catch (err) {
      toast.error({ title: "Creation Failed", description: getErrorMessage(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Organizations", href: "/admin/organizations" },
            { label: "New Organization" },
          ]}
          linkComponent={Link}
        />
      </div>

      {/* Header */}
      <div className="mb-8">
        <Text variant="heading-lg" className="mb-2">
          Add New Organization
        </Text>
        <Text variant="body-md" tone="secondary">
          Create a new institutional partner account
        </Text>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <Text variant="heading-sm" className="mb-6">
            Organization Details
          </Text>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <Input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter organization name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="organization-slug"
              />
              <Text variant="body-xs" tone="tertiary" className="mt-1">
                Used for identification and URLs
              </Text>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Domains *
              </label>
              <TagInput
                value={emailDomains}
                onChange={setEmailDomains}
                placeholder="Add email domains (e.g., company.com)"
              />
              <Text variant="body-xs" tone="tertiary" className="mt-1">
                Users with these email domains can be verified as members
              </Text>
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

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/organizations">
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!name.trim() || !slug.trim() || emailDomains.length === 0}
          >
            Create Organization
          </Button>
        </div>
      </div>
    </div>
  );
}
