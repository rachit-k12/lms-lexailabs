# LexAI LMS - Component Reference

This document provides a quick reference for all Tatva UI components available in the `/ui` folder. Use this before implementing any UI to ensure you're using components correctly.

---

## Quick Import

```tsx
import {
  Button,
  Card,
  Text,
  Input,
  Badge,
  List,
  ListGroup,
  Accordion,
  AccordionRoot,
  AccordionItem,
  Navbar,
  // ... other components
} from "@/ui";
```

---

## Component Categories

1. [Buttons & Actions](#buttons--actions)
2. [Typography](#typography)
3. [Form Inputs](#form-inputs)
4. [Cards & Containers](#cards--containers)
5. [Lists & Navigation](#lists--navigation)
6. [Accordions](#accordions)
7. [Modals & Overlays](#modals--overlays)
8. [Feedback & Status](#feedback--status)
9. [Data Display](#data-display)
10. [Layout](#layout)

---

## Buttons & Actions

### Button

Primary interactive element for user actions.

```tsx
import { Button } from "@/ui";

// Variants
<Button variant="primary">Primary CTA</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// With icons
<Button leftIcon="play">Start Course</Button>
<Button rightIcon="arrow-right">Continue</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>

// Full width
<Button fullWidth>Full Width Button</Button>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive' \| 'inverse' | 'primary' | Button style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| leftIcon | IconName | - | Icon on left |
| rightIcon | IconName | - | Icon on right |
| disabled | boolean | false | Disabled state |
| loading | boolean | false | Loading state |
| fullWidth | boolean | false | Full width |

### ButtonGroup

Group related buttons together.

```tsx
import { ButtonGroup } from "@/ui";

<ButtonGroup
  items={[
    { label: "All", value: "all" },
    { label: "Engineering", value: "eng" },
    { label: "Non-Engineering", value: "non-eng" },
  ]}
  value="all"
  onChange={(value) => setCategory(value)}
/>
```

---

## Typography

### Text

Unified text component for all typography needs.

```tsx
import { Text } from "@/ui";

// Variants
<Text variant="display-sm">Display Large</Text>
<Text variant="heading-lg">Page Heading</Text>
<Text variant="heading-md">Section Heading</Text>
<Text variant="heading-sm">Subsection</Text>
<Text variant="body-lg">Large body text</Text>
<Text variant="body-md">Regular body text</Text>
<Text variant="body-sm">Small body text</Text>
<Text variant="label-md">Label text</Text>
<Text variant="label-sm">Small label</Text>

// Colors
<Text color="primary">Primary color</Text>
<Text color="secondary">Secondary (gray)</Text>
<Text color="tertiary">Tertiary (lighter gray)</Text>
<Text color="inverse">White (for dark bg)</Text>

// Weights
<Text weight="normal">Normal weight</Text>
<Text weight="medium">Medium weight</Text>
<Text weight="semibold">Semibold</Text>
<Text weight="bold">Bold</Text>

// As different elements
<Text as="h1" variant="heading-lg">Heading 1</Text>
<Text as="p" variant="body-md">Paragraph</Text>
<Text as="span" variant="label-sm">Inline label</Text>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'display-sm' \| 'heading-lg' \| 'heading-md' \| 'heading-sm' \| 'heading-xs' \| 'body-lg' \| 'body-md' \| 'body-sm' \| 'label-md' \| 'label-sm' | 'body-md' | Typography style |
| color | 'primary' \| 'secondary' \| 'tertiary' \| 'quaternary' \| 'inverse' | 'primary' | Text color |
| weight | 'normal' \| 'medium' \| 'semibold' \| 'bold' | - | Font weight |
| as | keyof JSX.IntrinsicElements | 'span' | HTML element |

---

## Form Inputs

### Input

Text input field with label and validation.

```tsx
import { Input } from "@/ui";

<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// With helper text
<Input
  label="Password"
  type="password"
  helperText="Must be at least 8 characters"
/>

// With error
<Input
  label="Email"
  error="Invalid email address"
/>

// With prefix/suffix
<Input
  label="Price"
  prefix="₹"
/>

// With icon
<Input
  label="Search"
  leftIcon="search"
/>

// Disabled
<Input label="Read Only" disabled value="Cannot edit" />
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | Input label |
| placeholder | string | - | Placeholder text |
| type | string | 'text' | Input type |
| error | string | - | Error message |
| helperText | string | - | Helper text |
| prefix | string | - | Prefix text |
| leftIcon | IconName | - | Left icon |
| disabled | boolean | false | Disabled state |

### Textarea

Multi-line text input.

```tsx
import { Textarea } from "@/ui";

<Textarea
  label="Description"
  placeholder="Enter course description..."
  rows={4}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
```

### Select

Dropdown selection.

```tsx
import { Select } from "@/ui";

<Select
  label="Category"
  placeholder="Select category"
  options={[
    { label: "Engineering", value: "engineering" },
    { label: "Non-Engineering", value: "non-engineering" },
  ]}
  value={category}
  onChange={(value) => setCategory(value)}
/>
```

### Checkbox

Boolean toggle with label.

```tsx
import { Checkbox } from "@/ui";

<Checkbox
  label="I agree to terms"
  checked={agreed}
  onChange={(checked) => setAgreed(checked)}
/>
```

### Switch

Toggle switch.

```tsx
import { Switch } from "@/ui";

<Switch
  label="Enable notifications"
  checked={enabled}
  onChange={(checked) => setEnabled(checked)}
/>
```

### Radio & RadioGroup

Radio button selection.

```tsx
import { RadioGroup, Radio } from "@/ui";

<RadioGroup value={selected} onChange={setSelected}>
  <Radio value="video" label="Video" />
  <Radio value="pdf" label="PDF" />
  <Radio value="text" label="Text" />
</RadioGroup>
```

---

## Cards & Containers

### Card

Versatile card component for course cards, info cards, etc.

```tsx
import { Card } from "@/ui";

// Basic card
<Card
  heading="Introduction to ML"
  description="Learn machine learning fundamentals"
/>

// With image
<Card
  heading="Python for Data Science"
  description="Master Python for data analysis"
  image="https://example.com/python.jpg"
  direction="vertical"
/>

// Clickable card
<Card
  heading="Deep Learning"
  description="Neural networks and more"
  onClick={() => router.push('/courses/deep-learning')}
/>

// With badge
<Card
  heading="AI Ethics"
  description="Responsible AI development"
  badge={{ type: "label", value: "Free", variant: "green" }}
/>

// Compact variant (for resources)
<Card
  heading="Lesson Notes.pdf"
  description="2.4 MB"
  variant="compact"
  image="file"
  topRightIcon="download"
  onTopRightIconClick={handleDownload}
/>

// Horizontal layout
<Card
  heading="Course Title"
  description="Description"
  direction="horizontal"
  size="md"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| heading | string | - | Card title |
| description | string | - | Card description |
| image | string | - | Image URL or icon name |
| direction | 'horizontal' \| 'vertical' | 'horizontal' | Card layout |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Card size |
| variant | 'default' \| 'compact' | 'default' | Card variant |
| badge | CardBadge | - | Badge config |
| onClick | () => void | - | Click handler |
| topRightIcon | IconName | - | Top right icon |
| onTopRightIconClick | () => void | - | Icon click handler |

### MetricCard

Display metrics/KPIs.

```tsx
import { MetricCard } from "@/ui";

<MetricCard
  label="Total Students"
  value="1,234"
  trend={{ value: "+12%", direction: "up" }}
/>
```

---

## Lists & Navigation

### List & ListGroup

List items with status indicators - perfect for lesson lists.

```tsx
import { List, ListGroup } from "@/ui";

// Basic list
<ListGroup>
  <List title="Introduction" subtitle="15:00" />
  <List title="Getting Started" subtitle="20:00" />
</ListGroup>

// With status (LMS-ready)
<ListGroup variant="seamless">
  <List
    title="What is Machine Learning?"
    subtitle="15:00"
    status="completed"
  />
  <List
    title="Types of ML"
    subtitle="20:00"
    status="in-progress"
    active
  />
  <List
    title="Setting Up Environment"
    subtitle="25:00"
    status="locked"
  />
</ListGroup>

// Clickable
<List
  title="Linear Regression"
  subtitle="35:00"
  status="in-progress"
  active
  onClick={() => navigateToLesson(id)}
/>
```

**List Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | - | List item title |
| subtitle | string | - | Secondary text (duration) |
| status | 'completed' \| 'in-progress' \| 'locked' | - | Status indicator |
| active | boolean | false | Highlight as current |
| onClick | () => void | - | Click handler |
| rounded | 'none' \| 'sm' \| 'md' \| 'lg' | 'sm' | Border radius |

**ListGroup Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'default' \| 'seamless' | 'default' | Group variant |

**Status Icons:**
- `completed` → Green checkmark
- `in-progress` → Blue play icon
- `locked` → Gray lock icon (auto-disabled)

### Navbar

Top navigation bar.

```tsx
import { Navbar } from "@/ui";

<Navbar
  logo={<img src="/logo.png" alt="LexAI" />}
  navItems={[
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "About", href: "/about" },
  ]}
  actions={
    <>
      <Button variant="ghost">Sign In</Button>
      <Button variant="primary">Sign Up</Button>
    </>
  }
  variant="bordered"
/>
```

### Breadcrumbs

Navigation breadcrumbs.

```tsx
import { Breadcrumbs } from "@/ui";

<Breadcrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Machine Learning" },
  ]}
/>
```

### Tabs

Tab navigation.

```tsx
import { Tabs } from "@/ui";

<Tabs
  items={[
    { label: "Overview", value: "overview" },
    { label: "Curriculum", value: "curriculum" },
    { label: "Reviews", value: "reviews" },
  ]}
  value={activeTab}
  onChange={(value) => setActiveTab(value)}
/>
```

---

## Accordions

### Accordion, AccordionRoot, AccordionItem

Collapsible content sections - perfect for course modules.

```tsx
import { AccordionRoot, AccordionItem, ListGroup, List } from "@/ui";

// For course modules
<AccordionRoot type="multiple" defaultValue={["module-1"]}>
  <AccordionItem
    value="module-1"
    heading="Getting Started with ML"
    subtitle="6 lessons"
    badge={{ type: "label", value: "4/6", variant: "green" }}
  >
    <ListGroup variant="seamless">
      <List title="What is ML?" subtitle="15:00" status="completed" />
      <List title="Types of ML" subtitle="20:00" status="completed" />
      <List title="Environment Setup" subtitle="25:00" status="in-progress" active />
      <List title="First Model" subtitle="30:00" status="locked" />
    </ListGroup>
  </AccordionItem>

  <AccordionItem
    value="module-2"
    heading="Supervised Learning"
    subtitle="5 lessons"
    badge={{ type: "label", value: "0/5", variant: "gray" }}
  >
    <ListGroup variant="seamless">
      <List title="Linear Regression" subtitle="35:00" status="locked" />
      <List title="Logistic Regression" subtitle="40:00" status="locked" />
    </ListGroup>
  </AccordionItem>
</AccordionRoot>
```

**AccordionRoot Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | 'single' \| 'multiple' | 'single' | Allow multiple open |
| defaultValue | string[] | - | Initially open items |

**AccordionItem Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | - | Unique identifier |
| heading | string | - | Accordion title |
| subtitle | string | - | Secondary text |
| badge | AccordionBadge | - | Badge config (progress) |

---

## Modals & Overlays

### Dialog

Modal dialog for confirmations and forms.

```tsx
import { Dialog } from "@/ui";

<Dialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Confirm Enrollment"
  description="Are you sure you want to enroll in this course?"
  actions={[
    { label: "Cancel", variant: "ghost", onClick: () => setIsOpen(false) },
    { label: "Enroll", variant: "primary", onClick: handleEnroll },
  ]}
/>

// With form content
<Dialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Add Review"
  size="md"
>
  <div className="space-y-4">
    <Input label="Title" />
    <Textarea label="Your review" />
  </div>
</Dialog>
```

### Sheet

Side panel/drawer.

```tsx
import { Sheet } from "@/ui";

<Sheet
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Course Details"
  side="right"
  size="md"
>
  {/* Content */}
</Sheet>
```

### Tooltip

Hover tooltips.

```tsx
import { Tooltip, TooltipProvider } from "@/ui";

// Wrap app with TooltipProvider
<TooltipProvider>
  <Tooltip content="Start this lesson">
    <Button leftIcon="play" />
  </Tooltip>
</TooltipProvider>
```

### Menu

Dropdown menu.

```tsx
import { Menu } from "@/ui";

<Menu
  trigger={<Button variant="ghost" rightIcon="chevron-down">Options</Button>}
  options={[
    { label: "Edit", icon: "edit", onClick: handleEdit },
    { label: "Duplicate", icon: "copy", onClick: handleDuplicate },
    { type: "separator" },
    { label: "Delete", icon: "trash", onClick: handleDelete, variant: "destructive" },
  ]}
/>
```

---

## Feedback & Status

### Badge

Small status indicators.

```tsx
import { Badge } from "@/ui";

<Badge variant="default">Draft</Badge>
<Badge variant="green">Published</Badge>
<Badge variant="orange">In Progress</Badge>
<Badge variant="red">Error</Badge>
<Badge variant="indigo">Premium</Badge>

// With icon
<Badge variant="green" leftIcon="check">Completed</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'default' \| 'green' \| 'orange' \| 'red' \| 'indigo' \| 'pink' \| 'yellow' | 'default' | Badge color |
| size | 'sm' \| 'md' | 'sm' | Badge size |
| leftIcon | IconName | - | Left icon |

### Loader

Loading indicators.

```tsx
import { Loader } from "@/ui";

<Loader />
<Loader size="sm" />
<Loader size="lg" />
<Loader variant="linear" />
```

### Skeleton

Loading placeholders.

```tsx
import { Skeleton } from "@/ui";

<Skeleton className="h-4 w-32" />
<Skeleton className="h-48 w-full" />
<Skeleton variant="circular" className="h-12 w-12" />
```

### Toast

Notification toasts.

```tsx
import { toast, Toaster } from "@/ui";

// Add Toaster to layout
<Toaster />

// Show toasts
toast.success("Course enrolled successfully!");
toast.error("Failed to enroll");
toast.info("Course updated");
toast.warning("Session expiring soon");
```

### EmptyState

Empty state placeholders.

```tsx
import { EmptyState } from "@/ui";

<EmptyState
  icon="book"
  title="No courses yet"
  description="You haven't enrolled in any courses"
  action={{
    label: "Browse Courses",
    onClick: () => router.push('/courses')
  }}
/>
```

---

## Data Display

### Table

Data table with sorting, filtering, and pagination.

```tsx
import { Table } from "@/ui";

<Table
  columns={[
    { header: "Course", accessorKey: "title" },
    { header: "Category", accessorKey: "category" },
    { header: "Students", accessorKey: "enrolledCount" },
    { header: "Rating", accessorKey: "rating" },
  ]}
  data={courses}
  searchable
  searchPlaceholder="Search courses..."
  actions={[
    { label: "Edit", onClick: (row) => handleEdit(row.id) },
    { label: "Delete", onClick: (row) => handleDelete(row.id), variant: "destructive" },
  ]}
/>
```

### Avatar

User avatars.

```tsx
import { Avatar, AvatarGroup } from "@/ui";

<Avatar
  src="https://example.com/user.jpg"
  alt="User Name"
  size="md"
/>

// Fallback to initials
<Avatar name="John Doe" size="lg" />

// Avatar group
<AvatarGroup
  items={[
    { src: "/user1.jpg", alt: "User 1" },
    { src: "/user2.jpg", alt: "User 2" },
    { name: "User 3" },
  ]}
  max={3}
/>
```

### KeyValue

Key-value pair display.

```tsx
import { KeyValue, KeyValueGroup } from "@/ui";

<KeyValueGroup>
  <KeyValue label="Duration" value="24 hours" />
  <KeyValue label="Modules" value="5" />
  <KeyValue label="Level" value="Intermediate" />
</KeyValueGroup>
```

---

## Layout

### Divider

Horizontal/vertical divider.

```tsx
import { Divider } from "@/ui";

<Divider />
<Divider variant="dashed" />
<Divider orientation="vertical" />
```

### Sidebar

Application sidebar with navigation.

```tsx
import { Sidebar, SidebarProvider, useSidebar } from "@/ui";

<SidebarProvider>
  <Sidebar
    header={{
      logo: <img src="/logo.png" alt="Logo" />,
      title: "LexAI Labs",
    }}
    menuGroups={[
      {
        items: [
          { label: "Dashboard", icon: "home", href: "/dashboard" },
          { label: "My Courses", icon: "book", href: "/my-courses" },
          { label: "Certificates", icon: "award", href: "/certificates" },
        ],
      },
    ]}
    profile={{
      name: "John Doe",
      email: "john@example.com",
      avatar: "/avatar.jpg",
    }}
  />
</SidebarProvider>
```

---

## Icon Reference

The UI uses HugeIcons. Common icons for LMS:

```tsx
import { Icon } from "@/ui";

// Learning
<Icon name="play" />          // Video/start
<Icon name="book" />          // Course
<Icon name="graduation" />    // Certificate
<Icon name="award" />         // Achievement

// Status
<Icon name="check" />         // Completed
<Icon name="lock" />          // Locked
<Icon name="clock" />         // Duration

// Navigation
<Icon name="arrow-left" />
<Icon name="arrow-right" />
<Icon name="chevron-down" />
<Icon name="menu" />

// Actions
<Icon name="download" />
<Icon name="share" />
<Icon name="edit" />
<Icon name="trash" />
<Icon name="search" />
```

---

## LMS-Specific Patterns

### Course Card Pattern

```tsx
<Card
  heading={course.title}
  description={course.shortDescription}
  image={course.thumbnail}
  direction="vertical"
  size="lg"
  badge={course.price === 0
    ? { type: "label", value: "Free", variant: "green" }
    : { type: "label", value: `₹${course.price}` }
  }
  onClick={() => router.push(`/courses/${course.id}`)}
/>
```

### Module with Lessons Pattern

```tsx
<AccordionItem
  value={module.id}
  heading={module.title}
  subtitle={`${module.lessons.length} lessons`}
  badge={{
    type: "label",
    value: `${completed}/${total}`,
    variant: completed === total ? "green" : "default"
  }}
>
  <ListGroup variant="seamless">
    {module.lessons.map((lesson) => (
      <List
        key={lesson.id}
        title={lesson.title}
        subtitle={lesson.duration}
        status={getStatus(lesson)}
        active={currentLessonId === lesson.id}
        onClick={() => navigateToLesson(lesson.id)}
      />
    ))}
  </ListGroup>
</AccordionItem>
```

### Progress Card Pattern

```tsx
<Card
  heading={course.title}
  description={`${progress}% complete`}
  image={course.thumbnail}
  direction="horizontal"
>
  <div className="w-full bg-tatva-background-tertiary rounded-full h-2 mt-2">
    <div
      className="bg-lms-coral-500 h-2 rounded-full"
      style={{ width: `${progress}%` }}
    />
  </div>
  <Button
    variant="primary"
    size="sm"
    className="mt-3"
    onClick={() => continueLearning(courseId)}
  >
    Continue
  </Button>
</Card>
```
