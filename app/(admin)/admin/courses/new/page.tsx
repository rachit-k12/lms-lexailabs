"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Text,
  Button,
  Input,
  Textarea,
  Select,
  Switch,
  TagInput,
  Breadcrumbs,
} from "@/components";
import { createCourse, getErrorMessage } from "@/lib/api";
import type { CreateCourseRequest } from "@/lib/api";
import { toast } from "sonner";

const CATEGORY_OPTIONS = [
  { value: "engineering", label: "Engineering" },
  { value: "non-engineering", label: "Non-Engineering" },
];

const LEVEL_OPTIONS = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

export default function NewCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [introVideoUrl, setIntroVideoUrl] = useState("");
  const [category, setCategory] = useState<string>("engineering");
  const [level, setLevel] = useState<string>("Beginner");
  const [price, setPrice] = useState<number>(0);
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([]);
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [includes, setIncludes] = useState<string[]>([]);

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(generatedSlug);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const courseData: CreateCourseRequest = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        shortDescription: shortDescription.trim() || undefined,
        longDescription: longDescription.trim() || undefined,
        thumbnail: thumbnail.trim() || undefined,
        introVideoUrl: introVideoUrl.trim() || undefined,
        category,
        level,
        price,
        isPublished,
        isFeatured,
        tags: tags.length > 0 ? tags : undefined,
        whatYouWillLearn: whatYouWillLearn.length > 0 ? whatYouWillLearn : undefined,
        prerequisites: prerequisites.length > 0 ? prerequisites : undefined,
        includes: includes.length > 0 ? includes : undefined,
      };

      const result = await createCourse(courseData);
      toast.success("Course created successfully");
      router.push(`/admin/courses/${result.course.slug}/edit`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Courses", href: "/admin/courses" },
            { label: "New Course" },
          ]}
          linkComponent={Link}
        />
      </div>

      {/* Header */}
      <div className="mb-8">
        <Text variant="heading-lg" className="mb-2">
          Create New Course
        </Text>
        <Text variant="body-md" tone="secondary">
          Fill in the details below to create a new course
        </Text>
      </div>

      {/* Form */}
      <div className="space-y-8">
        {/* Basic Information */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <Text variant="heading-sm" className="mb-6">
            Basic Information
          </Text>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter course title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="course-url-slug"
              />
              <Text variant="body-xs" tone="tertiary" className="mt-1">
                This will be used in the URL: /courses/{slug || "your-slug"}
              </Text>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Select
                  value={category}
                  onChange={(value) => setCategory(value as string)}
                  options={CATEGORY_OPTIONS}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <Select
                  value={level}
                  onChange={(value) => setLevel(value as string)}
                  options={LEVEL_OPTIONS}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <Input
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief description for course cards"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Course description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Long Description
              </label>
              <Textarea
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="Detailed course description (supports markdown)"
                rows={5}
              />
            </div>
          </div>
        </section>

        {/* Media */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <Text variant="heading-sm" className="mb-6">
            Media
          </Text>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail URL
              </label>
              <Input
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intro Video URL
              </label>
              <Input
                value={introVideoUrl}
                onChange={(e) => setIntroVideoUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        {/* Pricing & Visibility */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <Text variant="heading-sm" className="mb-6">
            Pricing & Visibility
          </Text>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <Input
                type="number"
                value={price.toString()}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Text variant="body-md">Published</Text>
                <Text variant="body-sm" tone="secondary">
                  Make this course visible to users
                </Text>
              </div>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Text variant="body-md">Featured</Text>
                <Text variant="body-sm" tone="secondary">
                  Show on the homepage featured section
                </Text>
              </div>
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>
          </div>
        </section>

        {/* Tags & Metadata */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <Text variant="heading-sm" className="mb-6">
            Tags & Metadata
          </Text>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <TagInput
                value={tags}
                onChange={setTags}
                placeholder="Add tags..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What You Will Learn
              </label>
              <TagInput
                value={whatYouWillLearn}
                onChange={setWhatYouWillLearn}
                placeholder="Add learning outcomes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prerequisites
              </label>
              <TagInput
                value={prerequisites}
                onChange={setPrerequisites}
                placeholder="Add prerequisites..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Includes
              </label>
              <TagInput
                value={includes}
                onChange={setIncludes}
                placeholder="Add what's included..."
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/courses">
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!title.trim() || !slug.trim()}
          >
            Create Course
          </Button>
        </div>
      </div>
    </div>
  );
}
