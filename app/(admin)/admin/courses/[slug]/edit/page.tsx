"use client";

import { useState, useEffect, use } from "react";
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
  Dialog,
  Badge,
  Icon,
} from "@/components";
import {
  getCourseBySlug,
  updateCourse,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
  getErrorMessage,
} from "@/lib/api";
import type {
  Course,
  ModuleWithLessons,
  CreateModuleRequest,
  CreateLessonRequest,
} from "@/lib/api";
import { toast } from "sonner";

interface EditCoursePageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_OPTIONS = [
  { value: "engineering", label: "Engineering" },
  { value: "non-engineering", label: "Non-Engineering" },
];

const LEVEL_OPTIONS = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const LESSON_TYPE_OPTIONS = [
  { value: "VIDEO", label: "Video" },
  { value: "ARTICLE", label: "Article" },
];

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const { slug } = use(params);
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "curriculum">("details");

  // Course form state
  const [title, setTitle] = useState("");
  const [courseSlug, setCourseSlug] = useState("");
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

  // Module dialog state
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleWithLessons | null>(null);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [isSavingModule, setIsSavingModule] = useState(false);

  // Lesson dialog state
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<{ lesson: any; moduleId: string } | null>(null);
  const [lessonModuleId, setLessonModuleId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonType, setLessonType] = useState<string>("VIDEO");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonDuration, setLessonDuration] = useState<number>(0);
  const [lessonIsPreview, setLessonIsPreview] = useState(false);
  const [lessonIsFree, setLessonIsFree] = useState(false);
  const [isSavingLesson, setIsSavingLesson] = useState(false);

  // Delete confirmation
  const [deleteType, setDeleteType] = useState<"module" | "lesson" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleteModuleId, setDeleteModuleId] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const data = await getCourseBySlug(slug);
        setCourse(data.course);
        setModules(data.modules);

        // Populate form
        setTitle(data.course.title);
        setCourseSlug(data.course.slug);
        setDescription(data.course.description || "");
        setShortDescription(data.course.shortDescription || "");
        setLongDescription(data.course.longDescription || "");
        setThumbnail(data.course.thumbnail || "");
        setIntroVideoUrl(data.course.introVideoUrl || "");
        setCategory(data.course.category);
        setLevel(data.course.level);
        setPrice(data.course.price);
        setIsPublished(data.course.isPublished);
        setIsFeatured(data.course.isFeatured);
        setTags(data.course.tags || []);
        setWhatYouWillLearn(data.course.whatYouWillLearn || []);
        setPrerequisites(data.course.prerequisites || []);
        setIncludes(data.course.includes || []);
      } catch (err) {
        toast.error(getErrorMessage(err));
        router.push("/admin/courses");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourse();
  }, [slug, router]);

  const handleSaveCourse = async () => {
    setIsSaving(true);
    try {
      await updateCourse(course!.id, {
        title,
        slug: courseSlug,
        description,
        shortDescription,
        longDescription,
        thumbnail,
        introVideoUrl,
        category,
        level,
        price,
        isPublished,
        isFeatured,
        tags,
        whatYouWillLearn,
        prerequisites,
        includes,
      });
      toast.success("Course updated successfully");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  // Module handlers
  const openModuleDialog = (module?: ModuleWithLessons) => {
    if (module) {
      setEditingModule(module);
      setModuleTitle(module.title);
      setModuleDescription(module.description || "");
    } else {
      setEditingModule(null);
      setModuleTitle("");
      setModuleDescription("");
    }
    setModuleDialogOpen(true);
  };

  const handleSaveModule = async () => {
    if (!moduleTitle.trim()) {
      toast.error("Module title is required");
      return;
    }

    setIsSavingModule(true);
    try {
      const moduleData: CreateModuleRequest = {
        title: moduleTitle,
        description: moduleDescription || undefined,
        order: editingModule ? editingModule.order : modules.length + 1,
      };

      if (editingModule) {
        const result = await updateModule(course!.id, editingModule.id, moduleData);
        setModules((prev) =>
          prev.map((m) => (m.id === editingModule.id ? result.module : m))
        );
        toast.success("Module updated successfully");
      } else {
        const result = await createModule(course!.id, moduleData);
        setModules((prev) => [...prev, result.module]);
        toast.success("Module created successfully");
      }
      setModuleDialogOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSavingModule(false);
    }
  };

  // Lesson handlers
  const openLessonDialog = (moduleId: string, lesson?: any) => {
    setLessonModuleId(moduleId);
    if (lesson) {
      setEditingLesson({ lesson, moduleId });
      setLessonTitle(lesson.title);
      setLessonDescription(lesson.description || "");
      setLessonType(lesson.type?.toUpperCase() || "VIDEO");
      setLessonVideoUrl(lesson.videoUrl || "");
      setLessonContent(lesson.articleContent || lesson.content || "");
      setLessonDuration(lesson.videoDurationMinutes || lesson.duration || 0);
      setLessonIsPreview(lesson.isPreview);
      setLessonIsFree(lesson.isFree);
    } else {
      setEditingLesson(null);
      setLessonTitle("");
      setLessonDescription("");
      setLessonType("VIDEO");
      setLessonVideoUrl("");
      setLessonContent("");
      setLessonDuration(0);
      setLessonIsPreview(false);
      setLessonIsFree(false);
    }
    setLessonDialogOpen(true);
  };

  const handleSaveLesson = async () => {
    if (!lessonTitle.trim()) {
      toast.error("Lesson title is required");
      return;
    }

    setIsSavingLesson(true);
    try {
      const module = modules.find((m) => m.id === lessonModuleId);
      const lessonData: CreateLessonRequest = {
        title: lessonTitle,
        description: lessonDescription || undefined,
        type: lessonType as "VIDEO" | "ARTICLE",
        videoUrl: lessonType === "VIDEO" ? lessonVideoUrl : undefined,
        content: lessonType === "ARTICLE" ? lessonContent : undefined,
        duration: lessonDuration || undefined,
        isPreview: lessonIsPreview,
        isFree: lessonIsFree,
        order: editingLesson
          ? editingLesson.lesson.order
          : (module?.lessons.length || 0) + 1,
      };

      if (editingLesson) {
        const result = await updateLesson(
          course!.id,
          lessonModuleId,
          editingLesson.lesson.id,
          lessonData
        );
        setModules((prev) =>
          prev.map((m) =>
            m.id === lessonModuleId
              ? {
                  ...m,
                  lessons: m.lessons.map((l) =>
                    l.id === editingLesson.lesson.id ? result.lesson : l
                  ),
                }
              : m
          )
        );
        toast.success("Lesson updated successfully");
      } else {
        const result = await createLesson(course!.id, lessonModuleId, lessonData);
        setModules((prev) =>
          prev.map((m) =>
            m.id === lessonModuleId
              ? { ...m, lessons: [...m.lessons, result.lesson] }
              : m
          )
        );
        toast.success("Lesson created successfully");
      }
      setLessonDialogOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSavingLesson(false);
    }
  };

  // Delete handlers
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      if (deleteType === "module" && deleteTarget) {
        await deleteModule(course!.id, deleteTarget.id);
        setModules((prev) => prev.filter((m) => m.id !== deleteTarget.id));
        toast.success("Module deleted successfully");
      } else if (deleteType === "lesson" && deleteTarget && deleteModuleId) {
        await deleteLesson(course!.id, deleteModuleId, deleteTarget.id);
        setModules((prev) =>
          prev.map((m) =>
            m.id === deleteModuleId
              ? { ...m, lessons: m.lessons.filter((l) => l.id !== deleteTarget.id) }
              : m
          )
        );
        toast.success("Lesson deleted successfully");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
      setDeleteType(null);
      setDeleteTarget(null);
      setDeleteModuleId("");
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

  return (
    <div className="p-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Courses", href: "/admin/courses" },
            { label: course?.title || "Edit" },
          ]}
          linkComponent={Link}
        />
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Text variant="heading-lg" className="mb-1">
            {course?.title}
          </Text>
          <Text variant="body-md" tone="secondary">
            Edit course details and curriculum
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/courses/${slug}`} target="_blank">
            <Button variant="secondary" icon="external-link">
              Preview
            </Button>
          </Link>
          <Button
            variant="primary"
            onClick={handleSaveCourse}
            isLoading={isSaving}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        {[
          { key: "details", label: "Course Details" },
          { key: "curriculum", label: "Curriculum" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
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

      {/* Content */}
      {activeTab === "details" ? (
        <div className="space-y-8 max-w-4xl">
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
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <Input
                  value={courseSlug}
                  onChange={(e) => setCourseSlug(e.target.value)}
                  placeholder="course-url-slug"
                />
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
        </div>
      ) : (
        // Curriculum Tab
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Text variant="heading-sm">Modules & Lessons</Text>
            <Button variant="primary" icon="plus" onClick={() => openModuleDialog()}>
              Add Module
            </Button>
          </div>

          {modules.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <Text variant="heading-sm" className="mb-2">
                No modules yet
              </Text>
              <Text variant="body-md" tone="secondary" className="mb-4">
                Create your first module to start building the curriculum
              </Text>
              <Button variant="primary" icon="plus" onClick={() => openModuleDialog()}>
                Add Module
              </Button>
            </div>
          ) : (
            modules.map((module, moduleIndex) => (
              <div
                key={module.id}
                className="rounded-xl border border-gray-200 bg-white overflow-hidden"
              >
                {/* Module Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-400">
                      {moduleIndex + 1}
                    </span>
                    <div>
                      <Text variant="body-md" className="font-medium">
                        {module.title}
                      </Text>
                      {module.description && (
                        <Text variant="body-sm" tone="secondary">
                          {module.description}
                        </Text>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="plus"
                      onClick={() => openLessonDialog(module.id)}
                    >
                      Add Lesson
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="edit"
                      onClick={() => openModuleDialog(module)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="trash-2"
                      onClick={() => {
                        setDeleteType("module");
                        setDeleteTarget(module);
                      }}
                    />
                  </div>
                </div>

                {/* Lessons */}
                <div className="divide-y divide-gray-100">
                  {module.lessons.length === 0 ? (
                    <div className="p-4 text-center">
                      <Text variant="body-sm" tone="secondary">
                        No lessons yet
                      </Text>
                    </div>
                  ) : (
                    module.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">
                            {moduleIndex + 1}.{lessonIndex + 1}
                          </span>
                          <Icon
                            name={lesson.type === "video" ? "play" : "file-text"}
                            size="sm"
                            className="text-gray-400"
                          />
                          <div>
                            <Text variant="body-md">{lesson.title}</Text>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge type="label" variant="neutral" size="sm">
                                {lesson.type}
                              </Badge>
                              {lesson.isPreview && (
                                <Badge type="label" variant="default" size="sm">
                                  Preview
                                </Badge>
                              )}
                              {lesson.videoDurationMinutes && (
                                <Text variant="body-xs" tone="tertiary">
                                  {lesson.videoDurationMinutes} min
                                </Text>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="edit"
                            onClick={() => openLessonDialog(module.id, lesson)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="trash-2"
                            onClick={() => {
                              setDeleteType("lesson");
                              setDeleteTarget(lesson);
                              setDeleteModuleId(module.id);
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Module Dialog */}
      <Dialog
        open={moduleDialogOpen}
        onOpenChange={setModuleDialogOpen}
        title={editingModule ? "Edit Module" : "Add Module"}
        submitButtonText={editingModule ? "Save" : "Create"}
        onSubmit={handleSaveModule}
        isSubmitting={isSavingModule}
        size="md"
      >
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <Input
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              placeholder="Module title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              value={moduleDescription}
              onChange={(e) => setModuleDescription(e.target.value)}
              placeholder="Module description"
              rows={3}
            />
          </div>
        </div>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog
        open={lessonDialogOpen}
        onOpenChange={setLessonDialogOpen}
        title={editingLesson ? "Edit Lesson" : "Add Lesson"}
        submitButtonText={editingLesson ? "Save" : "Create"}
        onSubmit={handleSaveLesson}
        isSubmitting={isSavingLesson}
        size="lg"
      >
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <Input
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="Lesson title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <Select
              value={lessonType}
              onChange={(value) => setLessonType(value as string)}
              options={LESSON_TYPE_OPTIONS}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              value={lessonDescription}
              onChange={(e) => setLessonDescription(e.target.value)}
              placeholder="Lesson description"
              rows={2}
            />
          </div>
          {lessonType === "VIDEO" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL
                </label>
                <Input
                  value={lessonVideoUrl}
                  onChange={(e) => setLessonVideoUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={lessonDuration.toString()}
                  onChange={(e) => setLessonDuration(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content (Markdown)
              </label>
              <Textarea
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                placeholder="Lesson content..."
                rows={8}
              />
            </div>
          )}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={lessonIsPreview} onCheckedChange={setLessonIsPreview} />
              <Text variant="body-sm">Preview</Text>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={lessonIsFree} onCheckedChange={setLessonIsFree} />
              <Text variant="body-sm">Free</Text>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteType !== null}
        onOpenChange={() => {
          setDeleteType(null);
          setDeleteTarget(null);
          setDeleteModuleId("");
        }}
        title={`Delete ${deleteType === "module" ? "Module" : "Lesson"}`}
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        submitButtonText="Delete"
        submitButtonVariant="danger"
        onSubmit={handleDeleteConfirm}
        isSubmitting={isDeleting}
        size="sm"
      />
    </div>
  );
}
