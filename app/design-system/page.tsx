"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Text,
  Button,
  Badge,
  Card,
  Accordion,
  AccordionItem,
  Icon,
  Tabs,
  Checkbox,
  Switch,
  Input,
  Textarea,
  Select,
  Chip,
  Tag,
  Divider,
  Loader,
  Radio,
  RadioGroup,
  Avatar,
  AvatarGroup,
  Slider,
  Stepper,
  Skeleton,
  Tooltip,
  Breadcrumbs,
  KeyValue,
  KeyValueGroup,
  List,
  ListGroup,
  toast,
  Toaster,
} from "@/components";

// ============================================================================
// Color Palette Data
// ============================================================================

const lmsPrimaryColors = [
  { name: "50", value: "#EFF6FF" },
  { name: "100", value: "#DBEAFE" },
  { name: "200", value: "#BFDBFE" },
  { name: "300", value: "#93C5FD" },
  { name: "400", value: "#60A5FA" },
  { name: "500", value: "#3B82F6" },
  { name: "600", value: "#2563EB" },
  { name: "700", value: "#1D4ED8" },
  { name: "800", value: "#1E40AF" },
  { name: "900", value: "#1E3A8A" },
];

const lmsCoralColors = [
  { name: "50", value: "#FFF7F5" },
  { name: "100", value: "#FFF5F2" },
  { name: "200", value: "#FFDCD0" },
  { name: "300", value: "#FFC8B2" },
  { name: "400", value: "#FFB494" },
  { name: "500", value: "#FF7F50" },
  { name: "600", value: "#E66437" },
  { name: "700", value: "#C85028" },
];

// ============================================================================
// Component Showcase Wrapper
// ============================================================================

function ComponentShowcase({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="p-8 rounded-xl border border-tatva-border bg-tatva-background-primary">
        <div className="flex justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}

function ColorSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-16 h-16 rounded-lg border border-tatva-border shadow-sm"
        style={{ backgroundColor: value }}
      />
      <Text variant="body-xs" tone="secondary">{name}</Text>
      <Text variant="body-xs" tone="tertiary">{value}</Text>
    </div>
  );
}

// ============================================================================
// Tab Content Components
// ============================================================================

function ColorsTab() {
  return (
    <div className="space-y-12">
      {/* LMS Primary Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">LMS Primary (Blue)</h3>
        <Text variant="body-sm" tone="secondary">
          Used for primary actions, navigation, links, and interactive elements.
        </Text>
        <div className="flex flex-wrap gap-4">
          {lmsPrimaryColors.map((color) => (
            <ColorSwatch key={color.name} {...color} />
          ))}
        </div>
      </div>

      {/* LMS Coral Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">LMS Coral (Accent)</h3>
        <Text variant="body-sm" tone="secondary">
          Used for achievements, progress indicators, highlights, and emotional moments.
        </Text>
        <div className="flex flex-wrap gap-4">
          {lmsCoralColors.map((color) => (
            <ColorSwatch key={color.name} {...color} />
          ))}
        </div>
      </div>

      {/* Semantic Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Semantic Colors</h3>
        <Text variant="body-sm" tone="secondary">
          Softer, muted tones used for toasts and status indicators.
        </Text>
        <div className="space-y-6">
          {/* Success/Positive */}
          <div>
            <div className="mb-2"><Text variant="label-md" tone="secondary">Success / Positive</Text></div>
            <div className="flex flex-wrap gap-4">
              <ColorSwatch name="Background" value="#E5EDE2" />
              <ColorSwatch name="Content" value="#5C8A50" />
            </div>
          </div>
          {/* Warning */}
          <div>
            <div className="mb-2"><Text variant="label-md" tone="secondary">Warning</Text></div>
            <div className="flex flex-wrap gap-4">
              <ColorSwatch name="Background" value="#F5ECD7" />
              <ColorSwatch name="Content" value="#A0823C" />
            </div>
          </div>
          {/* Error/Danger */}
          <div>
            <div className="mb-2"><Text variant="label-md" tone="secondary">Error / Danger</Text></div>
            <div className="flex flex-wrap gap-4">
              <ColorSwatch name="Background" value="#FBEAEA" />
              <ColorSwatch name="Content" value="#C84646" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypographyTab() {
  return (
    <div className="space-y-12">
      {/* Font System */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-lms-primary-50 border border-lms-primary-200">
          <h4 className="text-base font-semibold text-lms-primary-700 mb-2">Plus Jakarta Sans</h4>
          <p className="text-sm text-lms-primary-600">
            Primary font for headings (SemiBold/Bold) and body text (Regular).
          </p>
        </div>
        <div className="p-6 rounded-xl bg-lms-coral-50 border border-lms-coral-200">
          <h4 className="text-base font-semibold text-lms-coral-700 mb-2 font-reading">Lora (Serif)</h4>
          <p className="text-sm text-lms-coral-600">
            Used for long-form reading: course articles, lesson content.
          </p>
        </div>
      </div>

      {/* Text Component Variants */}
      <ComponentShowcase title="Text Variants">
        <div className="flex flex-col gap-3 w-full max-w-2xl">
          <Text variant="display-sm">Display Small</Text>
          <Text variant="heading-lg">Heading Large</Text>
          <Text variant="heading-md">Heading Medium</Text>
          <Text variant="heading-sm">Heading Small</Text>
          <Text variant="heading-xs">Heading Extra Small</Text>
          <Text variant="body-xl">Body Extra Large - for hero/display paragraphs</Text>
          <Text variant="body-lg">Body Large - for emphasized paragraphs</Text>
          <Text variant="body-md">Body Medium - default body text</Text>
          <Text variant="body-sm">Body Small - secondary information</Text>
          <Text variant="body-xs">Body Extra Small - captions and metadata</Text>
          <Text variant="label-md">Label Medium - form labels and buttons</Text>
          <Text variant="label-sm">Label Small - small form labels and tags</Text>
        </div>
      </ComponentShowcase>

      {/* Text Tones */}
      <ComponentShowcase title="Text Tones">
        <div className="flex flex-col gap-3 w-full max-w-md">
          <Text variant="body-md" tone="default">Default tone</Text>
          <Text variant="body-md" tone="secondary">Secondary tone</Text>
          <Text variant="body-md" tone="tertiary">Tertiary tone</Text>
          <Text variant="body-md" tone="brand">Brand tone</Text>
          <Text variant="body-md" tone="danger">Danger tone</Text>
          <Text variant="body-md" tone="positive">Positive tone</Text>
          <Text variant="body-md" tone="warning">Warning tone</Text>
        </div>
      </ComponentShowcase>
    </div>
  );
}

function InputsTab() {
  return (
    <div className="space-y-12">
      {/* All Sizes */}
      <ComponentShowcase title="All Sizes">
        <div className="flex flex-col gap-6 w-[300px]">
          <Input label="Medium (36px)" icon="search" placeholder="Search..." size="md" />
          <Input label="Large (44px)" icon="search" placeholder="Search..." size="lg" />
          <Input label="Extra Large (52px)" icon="search" placeholder="Search..." size="xl" />
        </div>
      </ComponentShowcase>

      {/* All States */}
      <ComponentShowcase title="All States">
        <div className="flex flex-col gap-tatva-8 w-[264px]">
          <Input label="Default" placeholder="Placeholder" helperText="Hint" />
          <Input label="Filled" placeholder="Placeholder" defaultValue="Filled value" />
          <Input label="With Icon" placeholder="Search..." icon="search" />
          <Input label="With Prefix" prefix="https://" placeholder="example.com" />
          <Input label="Error" error="Error message" defaultValue="Invalid value" />
          <Input label="Disabled" placeholder="Placeholder" disabled />
        </div>
      </ComponentShowcase>

      {/* Input Types */}
      <ComponentShowcase title="All Types">
        <div className="flex flex-col gap-tatva-8 w-[264px]">
          <Input label="Text" type="text" placeholder="Enter text" />
          <Input label="Email" type="email" placeholder="email@example.com" />
          <Input label="Password" type="password" placeholder="Enter password" />
          <Input label="Number" type="number" placeholder="0" />
          <Input label="Search" type="search" placeholder="Search..." icon="search" />
          <Input label="Tel" type="tel" placeholder="+1 (555) 000-0000" />
        </div>
      </ComponentShowcase>

      {/* Textarea */}
      <ComponentShowcase title="Textarea">
        <div className="flex flex-col gap-tatva-8 w-[400px]">
          <Textarea label="Default" placeholder="Enter description..." rows={3} />
          <Textarea label="With Helper" placeholder="Enter description..." helperText="Max 500 characters" rows={3} />
          <Textarea label="Error State" placeholder="Enter description..." error="This field is required" rows={3} />
          <Textarea label="Disabled" placeholder="Enter description..." disabled rows={3} />
        </div>
      </ComponentShowcase>
    </div>
  );
}

function SelectsTab() {
  const options = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
    { value: "4", label: "Option 4" },
  ];

  return (
    <div className="space-y-12">
      {/* Select Sizes */}
      <ComponentShowcase title="Select Sizes">
        <div className="flex flex-col gap-tatva-8 w-[264px]">
          <Select label="Size M (36px)" placeholder="Choose option..." options={options} size="md" />
          <Select label="Size L (44px)" placeholder="Choose option..." options={options} size="lg" />
          <Select label="Size XL (54px)" placeholder="Choose option..." options={options} size="xl" />
        </div>
      </ComponentShowcase>

      {/* Select States */}
      <ComponentShowcase title="Select States">
        <div className="flex flex-col gap-tatva-8 w-[264px]">
          <Select label="Default" placeholder="Choose option..." options={options} />
          <Select label="With Helper Text" placeholder="Choose option..." options={options} />
          <Select label="Error" placeholder="Choose option..." options={options} error="Selection required" />
          <Select label="Disabled" placeholder="Choose option..." options={options} disabled />
        </div>
      </ComponentShowcase>
    </div>
  );
}

function ButtonsTab() {
  return (
    <div className="space-y-12">
      {/* Button Variants */}
      <ComponentShowcase title="All Variants">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </ComponentShowcase>

      {/* Button Sizes */}
      <ComponentShowcase title="All Sizes">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </ComponentShowcase>

      {/* Button States */}
      <ComponentShowcase title="All States">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Default</Button>
          <Button variant="primary" isLoading>Loading</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </ComponentShowcase>

      {/* Button with Icons */}
      <ComponentShowcase title="With Icons">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" icon="plus">With Icon</Button>
          <Button variant="outline" icon="download">Download</Button>
          <Button variant="ghost" icon="settings">Settings</Button>
          <Button variant="primary" icon="arrow-right" iconPosition="right">Continue</Button>
        </div>
      </ComponentShowcase>

      {/* Icon Only Buttons */}
      <ComponentShowcase title="Icon Only">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" icon="plus" size="sm" />
          <Button variant="outline" icon="edit" size="md" />
          <Button variant="ghost" icon="trash" size="lg" />
        </div>
      </ComponentShowcase>
    </div>
  );
}

function BadgesTab() {
  return (
    <div className="space-y-12">
      {/* Badge Variants */}
      <ComponentShowcase title="All Variants">
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="brand">Brand</Badge>
          <Badge variant="coral">Coral</Badge>
          <Badge variant="green">Green</Badge>
          <Badge variant="orange">Orange</Badge>
          <Badge variant="indigo">Indigo</Badge>
          <Badge variant="red">Red</Badge>
          <Badge variant="yellow">Yellow</Badge>
          <Badge variant="pink">Pink</Badge>
        </div>
      </ComponentShowcase>

      {/* Badge Sizes */}
      <ComponentShowcase title="All Sizes">
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="indigo" size="sm">Small</Badge>
          <Badge variant="indigo" size="md">Medium</Badge>
          <Badge variant="indigo" size="lg">Large</Badge>
        </div>
      </ComponentShowcase>

      {/* Badge Types */}
      <ComponentShowcase title="All Types">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Badge type="label" variant="green">Label</Badge>
            <Text variant="body-xs" tone="tertiary">Label</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Badge type="number" variant="orange">42</Badge>
            <Text variant="body-xs" tone="tertiary">Number</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Badge type="dot" variant="red" />
            <Text variant="body-xs" tone="tertiary">Dot</Text>
          </div>
        </div>
      </ComponentShowcase>

      {/* Chips */}
      <ComponentShowcase title="Chips">
        <div className="flex flex-wrap items-center gap-4">
          <Chip onRemove={() => {}}>Default Chip</Chip>
          <Chip variant="brand" onRemove={() => {}}>Brand Chip</Chip>
          <Chip onRemove={() => {}}>Removable</Chip>
        </div>
      </ComponentShowcase>

      {/* Tags */}
      <ComponentShowcase title="Tags">
        <div className="flex flex-wrap items-center gap-4">
          <Tag>Default Tag</Tag>
          <Tag variant="brand">Brand Tag</Tag>
        </div>
      </ComponentShowcase>
    </div>
  );
}

function FormControlsTab() {
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");
  const [sliderValue, setSliderValue] = useState([50]);

  return (
    <div className="space-y-12">
      {/* Checkbox */}
      <ComponentShowcase title="Checkbox">
        <div className="flex flex-col gap-4 w-[300px]">
          <Checkbox label="Unchecked" />
          <Checkbox label="Checked" defaultChecked />
          <Checkbox label="Another option" />
          <Checkbox label="Disabled" disabled />
          <Checkbox label="Disabled checked" disabled defaultChecked />
        </div>
      </ComponentShowcase>

      {/* Switch */}
      <ComponentShowcase title="Switch">
        <div className="flex flex-col gap-4 w-[300px]">
          <Switch label="Off" />
          <Switch label="On" defaultChecked />
          <Switch label="Disabled off" disabled />
          <Switch label="Disabled on" disabled defaultChecked />
        </div>
      </ComponentShowcase>

      {/* Radio Group */}
      <ComponentShowcase title="Radio Group">
        <div className="w-[300px]">
          <RadioGroup value={radioValue} onValueChange={setRadioValue}>
            <Radio value="option1" label="Option 1" />
            <Radio value="option2" label="Option 2" />
            <Radio value="option3" label="Option 3" />
            <Radio value="option4" label="Option 4 (disabled)" disabled />
          </RadioGroup>
        </div>
      </ComponentShowcase>

      {/* Slider */}
      <ComponentShowcase title="Slider">
        <div className="flex flex-col gap-8 w-[300px]">
          <Slider value={sliderValue} onValueChange={setSliderValue} />
          <Slider defaultValue={[25, 75]} />
          <Slider defaultValue={[50]} disabled />
        </div>
      </ComponentShowcase>
    </div>
  );
}

function AvatarsTab() {
  return (
    <div className="space-y-12">
      {/* Avatar Sizes */}
      <ComponentShowcase title="All Sizes">
        <div className="flex items-end gap-4">
          <div className="flex flex-col items-center gap-2">
            <Avatar size="xs" fallback="JD" />
            <Text variant="body-xs" tone="tertiary">XS</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar size="sm" fallback="JD" />
            <Text variant="body-xs" tone="tertiary">SM</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar size="md" fallback="JD" />
            <Text variant="body-xs" tone="tertiary">MD</Text>
          </div>
        </div>
      </ComponentShowcase>

      {/* Avatar Variants */}
      <ComponentShowcase title="Variants">
        <div className="flex items-center gap-4">
          <Avatar fallback="JD" />
          <Avatar fallback="JS" />
          <Avatar fallback="BW" />
          <Avatar fallback="AB" />
        </div>
      </ComponentShowcase>

      {/* Avatar Group */}
      <ComponentShowcase title="Avatar Group">
        <AvatarGroup
          avatars={[
            { fallback: "JD" },
            { fallback: "JS" },
            { fallback: "BW" },
            { fallback: "AB" },
            { fallback: "CD" },
          ]}
          max={4}
        />
      </ComponentShowcase>
    </div>
  );
}

function LoadersTab() {
  return (
    <div className="space-y-12">
      {/* Circular Loader Sizes */}
      <ComponentShowcase title="Circular Loader - Sizes">
        <div className="flex items-end gap-8">
          <div className="flex flex-col items-center gap-2">
            <Loader size="sm" />
            <Text variant="body-xs" tone="tertiary">Small</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Loader size="md" />
            <Text variant="body-xs" tone="tertiary">Medium</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Loader size="lg" />
            <Text variant="body-xs" tone="tertiary">Large</Text>
          </div>
        </div>
      </ComponentShowcase>

      {/* Circular Loader with Progress */}
      <ComponentShowcase title="Circular Loader - With Progress">
        <div className="flex items-center gap-8">
          <Loader variant="circular" size="md" value={25} />
          <Loader variant="circular" size="md" value={50} />
          <Loader variant="circular" size="md" value={75} />
          <Loader variant="circular" size="md" value={100} />
        </div>
      </ComponentShowcase>

      {/* Linear Loader */}
      <ComponentShowcase title="Linear Loader">
        <div className="w-[300px] space-y-4">
          <Loader variant="linear" />
          <Loader variant="linear" value={50} />
          <Loader variant="linear" value={100} />
        </div>
      </ComponentShowcase>
    </div>
  );
}

function DividersTab() {
  return (
    <div className="space-y-12">
      {/* Divider Variants */}
      <ComponentShowcase title="Divider Variants">
        <div className="w-[400px] space-y-6">
          <div>
            <Text variant="body-sm" tone="secondary">Primary (default)</Text>
            <div className="mt-2">
              <Divider />
            </div>
          </div>
          <div>
            <Text variant="body-sm" tone="secondary">Secondary</Text>
            <div className="mt-2">
              <Divider variant="secondary" />
            </div>
          </div>
          <div>
            <Text variant="body-sm" tone="secondary">Tertiary</Text>
            <div className="mt-2">
              <Divider variant="tertiary" />
            </div>
          </div>
        </div>
      </ComponentShowcase>

      {/* Divider with Text - using custom layout since hr can't have children */}
      <ComponentShowcase title="Divider with Text">
        <div className="w-[400px] space-y-6">
          <div className="flex items-center gap-4">
            <Divider />
            <Text variant="body-sm" tone="tertiary">OR</Text>
            <Divider />
          </div>
          <div className="flex items-center gap-4">
            <Divider />
            <Text variant="body-sm" tone="tertiary">Continue with</Text>
            <Divider />
          </div>
        </div>
      </ComponentShowcase>
    </div>
  );
}

function ToastsTab() {
  return (
    <div className="space-y-12">
      {/* Toast Triggers */}
      <ComponentShowcase title="Toast Variants">
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="primary"
            onClick={() => toast.info("This is an info toast")}
          >
            Info Toast
          </Button>
          <Button
            variant="primary"
            onClick={() => toast.success("Changes saved successfully!")}
          >
            Success Toast
          </Button>
          <Button
            variant="primary"
            onClick={() => toast.warning("Please review your input")}
          >
            Warning Toast
          </Button>
          <Button
            variant="destructive"
            onClick={() => toast.error("Something went wrong")}
          >
            Error Toast
          </Button>
        </div>
      </ComponentShowcase>

      {/* Toast with Description */}
      <ComponentShowcase title="Toast with Description">
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            onClick={() =>
              toast.success({
                title: "Course Enrolled",
                description: "You have successfully enrolled in AI Fundamentals",
              })
            }
          >
            Success with Description
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.error({
                title: "Enrollment Failed",
                description: "Please check your payment details and try again",
              })
            }
          >
            Error with Description
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.warning({
                title: "Session Expiring",
                description: "Your session will expire in 5 minutes",
              })
            }
          >
            Warning with Description
          </Button>
        </div>
      </ComponentShowcase>

      {/* Toast Duration */}
      <ComponentShowcase title="Custom Duration">
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="ghost"
            onClick={() =>
              toast.info({
                title: "Quick notification",
                duration: 2000,
              })
            }
          >
            Short (2s)
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              toast.info({
                title: "Standard notification",
                duration: 4000,
              })
            }
          >
            Standard (4s)
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              toast.info({
                title: "Long notification",
                description: "This toast stays visible for 8 seconds",
                duration: 8000,
              })
            }
          >
            Long (8s)
          </Button>
        </div>
      </ComponentShowcase>

      {/* Dismiss All */}
      <ComponentShowcase title="Dismiss Toasts">
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              toast.info("First notification");
              toast.success("Second notification");
              toast.warning("Third notification");
            }}
          >
            Show Multiple Toasts
          </Button>
          <Button variant="secondary" onClick={() => toast.dismissAll()}>
            Dismiss All
          </Button>
        </div>
      </ComponentShowcase>
    </div>
  );
}

function ListsTab() {
  return (
    <div className="space-y-12">
      {/* Basic List */}
      <ComponentShowcase title="Basic List Items">
        <div className="w-full max-w-md">
          <ListGroup>
            <List title="Introduction to AI" subtitle="Learn the basics of artificial intelligence" />
            <List title="Machine Learning Fundamentals" subtitle="Understanding ML algorithms" />
            <List title="Deep Learning Concepts" subtitle="Neural networks and beyond" />
          </ListGroup>
        </div>
      </ComponentShowcase>

      {/* List with Icons */}
      <ComponentShowcase title="List with Icons">
        <div className="w-full max-w-md">
          <ListGroup>
            <List
              title="Video Lessons"
              subtitle="12 video tutorials"
              icon={<Icon name="play" size="sm" tone="primary" />}
            />
            <List
              title="Reading Materials"
              subtitle="8 articles and guides"
              icon={<Icon name="file-02" size="sm" tone="primary" />}
            />
            <List
              title="Quizzes"
              subtitle="5 practice tests"
              icon={<Icon name="help-circle" size="sm" tone="primary" />}
            />
          </ListGroup>
        </div>
      </ComponentShowcase>

      {/* List with Status */}
      <ComponentShowcase title="List with Status (Course Progress)">
        <div className="w-full max-w-md">
          <ListGroup>
            <List title="Module 1: Getting Started" status="completed" />
            <List title="Module 2: Core Concepts" status="completed" />
            <List title="Module 3: Advanced Topics" status="in-progress" />
            <List title="Module 4: Final Project" status="locked" />
          </ListGroup>
        </div>
      </ComponentShowcase>

      {/* List with Badges */}
      <ComponentShowcase title="List with Badges">
        <div className="w-full max-w-md">
          <ListGroup>
            <List
              title="React Basics"
              badge={{ type: "label", value: "Beginner", variant: "green" }}
            />
            <List
              title="State Management"
              badge={{ type: "label", value: "Intermediate", variant: "orange" }}
            />
            <List
              title="Performance Optimization"
              badge={{ type: "label", value: "Advanced", variant: "red" }}
            />
          </ListGroup>
        </div>
      </ComponentShowcase>

      {/* Clickable List */}
      <ComponentShowcase title="Clickable List Items">
        <div className="w-full max-w-md">
          <ListGroup>
            <List
              title="Course Settings"
              subtitle="Manage your course preferences"
              onClick={() => {}}
            />
            <List
              title="Download Certificate"
              subtitle="Get your completion certificate"
              onClick={() => {}}
            />
            <List
              title="Share Progress"
              subtitle="Share your achievements"
              onClick={() => {}}
            />
          </ListGroup>
        </div>
      </ComponentShowcase>

      {/* List Sizes */}
      <ComponentShowcase title="List Sizes">
        <div className="w-full max-w-md space-y-6">
          <div>
            <div className="mb-2"><Text variant="body-sm" tone="secondary">Extra Small</Text></div>
            <ListGroup>
              <List title="XS List Item" size="xs" />
            </ListGroup>
          </div>
          <div>
            <div className="mb-2"><Text variant="body-sm" tone="secondary">Small</Text></div>
            <ListGroup>
              <List title="Small List Item" size="sm" />
            </ListGroup>
          </div>
          <div>
            <div className="mb-2"><Text variant="body-sm" tone="secondary">Medium (Default)</Text></div>
            <ListGroup>
              <List title="Medium List Item" size="md" />
            </ListGroup>
          </div>
          <div>
            <div className="mb-2"><Text variant="body-sm" tone="secondary">Large</Text></div>
            <ListGroup>
              <List title="Large List Item" size="lg" />
            </ListGroup>
          </div>
        </div>
      </ComponentShowcase>

      {/* Seamless Variant */}
      <ComponentShowcase title="Seamless Variant (for Sidebars)">
        <div className="w-full max-w-md p-4 bg-tatva-background-secondary rounded-lg">
          <ListGroup variant="seamless">
            <List title="Dashboard" icon={<Icon name="home-03" size="sm" />} onClick={() => {}} rounded="md" />
            <List title="My Courses" icon={<Icon name="book-open" size="sm" />} onClick={() => {}} rounded="md" />
            <List title="Certificates" icon={<Icon name="certificate-01" size="sm" />} onClick={() => {}} rounded="md" active />
            <List title="Settings" icon={<Icon name="settings-01" size="sm" />} onClick={() => {}} rounded="md" />
          </ListGroup>
        </div>
      </ComponentShowcase>
    </div>
  );
}

function CardsTab() {
  return (
    <div className="space-y-12">
      {/* Card Variants */}
      <ComponentShowcase title="Card Variants">
        <div className="grid grid-cols-3 gap-6 w-full">
          <Card heading="Default Card" description="This is a default card variant with border" />
          <Card heading="Card without Border" description="This card has no border" noBorder />
          <Card heading="Compact Card" description="This is a compact variant" variant="compact" />
        </div>
      </ComponentShowcase>

      {/* Card with Badge */}
      <ComponentShowcase title="Card with Badge">
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          <Card
            heading="Featured Course"
            description="Learn the fundamentals of AI and machine learning"
            badge={{ type: "dot" }}
          />
          <Card
            heading="Advanced Module"
            description="Deep dive into neural network concepts"
            badge={{ type: "label", value: "New" }}
          />
        </div>
      </ComponentShowcase>

      {/* Card Sizes */}
      <ComponentShowcase title="Card Sizes">
        <div className="flex flex-col gap-6 w-full max-w-lg">
          <Card heading="Small Card" description="This is a small sized card" size="sm" />
          <Card heading="Medium Card" description="This is a medium sized card with more space" size="md" />
          <Card heading="Large Card" description="This is a large sized card with expanded area" size="lg" />
        </div>
      </ComponentShowcase>

      {/* Card Directions */}
      <ComponentShowcase title="Card Directions">
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          <Card heading="Horizontal Layout" description="Content flows horizontally (default)" direction="horizontal" />
          <Card heading="Vertical Layout" description="Content stacks vertically" direction="vertical" />
        </div>
      </ComponentShowcase>

      {/* Card with Icons */}
      <ComponentShowcase title="Card with Icons">
        <div className="grid grid-cols-3 gap-6 w-full">
          <Card
            heading="Video Lessons"
            description="Watch high-quality video tutorials"
            image="play-circle"
          />
          <Card
            heading="Interactive Quizzes"
            description="Test your knowledge with quizzes"
            image="help-circle"
          />
          <Card
            heading="Certificates"
            description="Earn verified certificates"
            image="certificate-01"
          />
        </div>
      </ComponentShowcase>

      {/* Horizontal Cards with Images - All Sizes */}
      <ComponentShowcase title="Horizontal Cards with Images (All Sizes)">
        <div className="flex flex-col gap-6 w-full max-w-2xl">
          <div>
            <div className="mb-2"><Text variant="label-md" tone="secondary">Small</Text></div>
            <Card
              heading="Quick Tutorial"
              description="5 min read"
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop&q=80"
              alt="Abstract geometric"
              size="sm"
              direction="horizontal"
              onClick={() => {}}
            />
          </div>
          <div>
            <div className="mb-2"><Text variant="label-md" tone="secondary">Medium</Text></div>
            <Card
              heading="Introduction to Design Systems"
              description="Learn the principles of modern design thinking and component architecture"
              src="https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=300&h=200&fit=crop&q=80"
              alt="Abstract gradient"
              size="md"
              direction="horizontal"
              onClick={() => {}}
            />
          </div>
          <div>
            <div className="mb-2"><Text variant="label-md" tone="secondary">Large</Text></div>
            <Card
              heading="Complete Machine Learning Course"
              description="Master the fundamentals of machine learning with hands-on projects and real-world applications"
              src="https://plus.unsplash.com/premium_photo-1664443577580-dd2674e9d359?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Neural pattern"
              size="lg"
              direction="horizontal"
              onClick={() => {}}
            />
          </div>
        </div>
      </ComponentShowcase>

      {/* Vertical Cards with Images - All Sizes */}
      <ComponentShowcase title="Vertical Cards with Images (All Sizes)">
        <div className="grid grid-cols-3 gap-6 w-full">
          <div>
            <div className="mb-2"><Text variant="label-md" tone="secondary">Small</Text></div>
            <Card
              heading="Quick Tip"
              description="2 min read"
              src="https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop&q=80"
              alt="Gradient texture"
              size="sm"
              direction="vertical"
              onClick={() => {}}
            />
          </div>
          <div>
            <div className="mb-2"><Text variant="label-md" tone="secondary">Medium</Text></div>
            <Card
              heading="UI Design Basics"
              description="Learn fundamental UI principles"
              src="https://plus.unsplash.com/premium_photo-1664443577580-dd2674e9d359?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Minimal texture"
              size="md"
              direction="vertical"
              onClick={() => {}}
            />
          </div>
          <div>
            <div className="mb-2"><Text variant="label-md" tone="secondary">Large</Text></div>
            <Card
              heading="Product Strategy"
              description="Build and scale successful digital products with proven strategies"
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=400&fit=crop&q=80"
              alt="Gradient background"
              size="lg"
              direction="vertical"
              onClick={() => {}}
            />
          </div>
        </div>
      </ComponentShowcase>

      {/* Image Cards Grid */}
      <ComponentShowcase title="Image Cards Grid">
        <div className="grid grid-cols-4 gap-4 w-full">
          <Card
            heading="Typography"
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop&q=80"
            alt="Abstract"
            size="sm"
            direction="vertical"
            onClick={() => {}}
          />
          <Card
            heading="Color Theory"
            src="https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=300&h=300&fit=crop&q=80"
            alt="Gradient"
            size="sm"
            direction="vertical"
            onClick={() => {}}
          />
          <Card
            heading="Layout"
            src="https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=300&fit=crop&q=80"
            alt="Texture"
            size="sm"
            direction="vertical"
            onClick={() => {}}
          />
          <Card
            heading="Animation"
            src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&h=300&fit=crop&q=80"
            alt="Colors"
            size="sm"
            direction="vertical"
            onClick={() => {}}
          />
        </div>
      </ComponentShowcase>

      {/* Clickable Cards */}
      <ComponentShowcase title="Clickable Cards">
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          <Card
            heading="Click Me"
            description="This card is clickable and shows hover state"
            onClick={() => {}}
          />
          <Card
            heading="Interactive Card"
            description="Hover to see the border highlight"
            onClick={() => {}}
          />
        </div>
      </ComponentShowcase>

      {/* Card with Actions */}
      <ComponentShowcase title="Card with Actions Menu">
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          <Card
            heading="Course Module"
            description="This card has an actions menu"
            actions={[
              { value: "edit", label: "Edit", icon: "edit" },
              { value: "delete", label: "Delete", icon: "trash" },
            ]}
          />
          <Card
            heading="With Top Right Icon"
            description="This card has a favourite icon"
            topRightIcon="favourite"
            onTopRightIconClick={() => {}}
          />
        </div>
      </ComponentShowcase>
    </div>
  );
}

function AccordionsTab() {
  return (
    <div className="space-y-12">
      {/* Basic Accordion */}
      <ComponentShowcase title="Basic Accordion">
        <div className="w-full max-w-lg">
          <Accordion heading="What is Lex AI?" defaultExpanded>
            Lex AI is a comprehensive learning management system designed to help you master AI skills through interactive courses and hands-on projects.
          </Accordion>
          <Accordion heading="How do I get started?">
            Simply create an account, browse our course catalog, and enroll in any course that interests you. You can start learning immediately.
          </Accordion>
          <Accordion heading="Are certificates included?">
            Yes! Upon completing a course, you will receive a verified certificate that you can share on LinkedIn or add to your resume.
          </Accordion>
        </div>
      </ComponentShowcase>

      {/* Accordion Sizes */}
      <ComponentShowcase title="Accordion Sizes">
        <div className="w-full max-w-lg">
          <Accordion heading="Small Size (default)" size="sm">
            This accordion uses the small size variant with compact spacing.
          </Accordion>
          <Accordion heading="Medium Size" size="md">
            This accordion uses the medium size variant with more generous spacing.
          </Accordion>
        </div>
      </ComponentShowcase>

      {/* Accordion Variants */}
      <ComponentShowcase title="Accordion Variants">
        <div className="w-full max-w-lg">
          <Accordion heading="Normal Variant (default)" variant="normal">
            Normal variant uses heading typography for the title.
          </Accordion>
          <Accordion heading="Heading-Only Variant" variant="heading-only">
            Heading-only variant uses body typography with secondary tone.
          </Accordion>
        </div>
      </ComponentShowcase>
    </div>
  );
}

function SkeletonsTab() {
  return (
    <div className="space-y-12">
      {/* Skeleton Shapes */}
      <ComponentShowcase title="Skeleton Shapes">
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Skeleton width={64} height={64} className="rounded-full" />
            <Text variant="body-xs" tone="tertiary">Circle</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton width={64} height={64} className="rounded-lg" />
            <Text variant="body-xs" tone="tertiary">Square</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton width={128} height={16} className="rounded" />
            <Text variant="body-xs" tone="tertiary">Line</Text>
          </div>
        </div>
      </ComponentShowcase>

      {/* Card Skeleton */}
      <ComponentShowcase title="Card Loading State">
        <div className="w-[300px] p-4 border border-tatva-border rounded-xl space-y-4">
          <Skeleton width="100%" height={128} className="rounded-lg" />
          <Skeleton width="75%" height={16} className="rounded" />
          <Skeleton width="50%" height={16} className="rounded" />
          <div className="flex gap-2">
            <Skeleton width={64} height={24} className="rounded-full" />
            <Skeleton width={64} height={24} className="rounded-full" />
          </div>
        </div>
      </ComponentShowcase>

      {/* List Skeleton */}
      <ComponentShowcase title="List Loading State">
        <div className="w-[400px] space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton width={40} height={40} className="rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton width="75%" height={16} className="rounded" />
                <Skeleton width="50%" height={12} className="rounded" />
              </div>
            </div>
          ))}
        </div>
      </ComponentShowcase>

      {/* Skeleton Variants */}
      <ComponentShowcase title="Shimmer Variants">
        <div className="flex gap-8">
          <div className="space-y-2">
            <Text variant="label-md" tone="secondary">Default (Neutral)</Text>
            <div className="w-[200px] space-y-2">
              <Skeleton width="100%" height={16} className="rounded" />
              <Skeleton width="75%" height={16} className="rounded" />
              <Skeleton width="50%" height={16} className="rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <Text variant="label-md" tone="secondary">Warm (Coral Tint)</Text>
            <div className="w-[200px] space-y-2">
              <Skeleton width="100%" height={16} className="rounded" variant="warm" />
              <Skeleton width="75%" height={16} className="rounded" variant="warm" />
              <Skeleton width="50%" height={16} className="rounded" variant="warm" />
            </div>
          </div>
        </div>
      </ComponentShowcase>
    </div>
  );
}

function BreadcrumbsTab() {
  return (
    <div className="space-y-12">
      {/* Basic Breadcrumbs */}
      <ComponentShowcase title="Basic Breadcrumbs">
        <Breadcrumbs
          items={[
            { label: "Home", href: "#" },
            { label: "Courses", href: "#" },
            { label: "AI Fundamentals" },
          ]}
        />
      </ComponentShowcase>

      {/* Long Breadcrumbs */}
      <ComponentShowcase title="Long Path">
        <Breadcrumbs
          items={[
            { label: "Home", href: "#" },
            { label: "Courses", href: "#" },
            { label: "Machine Learning", href: "#" },
            { label: "Deep Learning", href: "#" },
            { label: "Neural Networks" },
          ]}
        />
      </ComponentShowcase>

      {/* With Icons */}
      <ComponentShowcase title="With Home Icon">
        <Breadcrumbs
          items={[
            { label: "Home", href: "#" },
            { label: "Dashboard", href: "#" },
            { label: "Settings" },
          ]}
        />
      </ComponentShowcase>
    </div>
  );
}

function KeyValuesTab() {
  return (
    <div className="space-y-12">
      {/* Basic KeyValue */}
      <ComponentShowcase title="Basic Key-Value Pairs">
        <div className="w-[300px] space-y-4">
          <KeyValue label="Course Name" value="AI Fundamentals" />
          <KeyValue label="Duration" value="8 weeks" />
          <KeyValue label="Level" value="Beginner" />
          <KeyValue label="Instructor" value="Dr. Jane Smith" />
        </div>
      </ComponentShowcase>

      {/* KeyValue Group */}
      <ComponentShowcase title="Key-Value Group">
        <div className="w-[400px]">
          <KeyValueGroup columns={2} gap="lg">
            <KeyValue label="Enrolled" value="1,234 students" />
            <KeyValue label="Rating" value="4.8 / 5.0" />
            <KeyValue label="Completion Rate" value="89%" />
            <KeyValue label="Last Updated" value="Jan 2026" />
          </KeyValueGroup>
        </div>
      </ComponentShowcase>

      {/* Vertical Layout */}
      <ComponentShowcase title="Vertical Layout">
        <div className="flex gap-8">
          <KeyValue label="Total Courses" value="24" direction="vertical" />
          <KeyValue label="Completed" value="18" direction="vertical" />
          <KeyValue label="In Progress" value="4" direction="vertical" />
          <KeyValue label="Certificates" value="12" direction="vertical" />
        </div>
      </ComponentShowcase>
    </div>
  );
}

function SteppersTab() {
  return (
    <div className="space-y-12">
      {/* Basic Stepper */}
      <ComponentShowcase title="Basic Stepper">
        <div className="w-full max-w-2xl">
          <Stepper
            steps={[
              { label: "Account" },
              { label: "Profile" },
              { label: "Preferences" },
              { label: "Complete" },
            ]}
            currentStep={1}
          />
        </div>
      </ComponentShowcase>

      {/* Completed Steps */}
      <ComponentShowcase title="With Completed Steps">
        <div className="w-full max-w-2xl">
          <Stepper
            steps={[
              { label: "Account" },
              { label: "Profile" },
              { label: "Preferences" },
              { label: "Complete" },
            ]}
            currentStep={2}
          />
        </div>
      </ComponentShowcase>

      {/* All Complete */}
      <ComponentShowcase title="All Steps Complete">
        <div className="w-full max-w-2xl">
          <Stepper
            steps={[
              { label: "Account" },
              { label: "Profile" },
              { label: "Preferences" },
              { label: "Complete" },
            ]}
            currentStep={4}
          />
        </div>
      </ComponentShowcase>
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState("colors");

  const tabs = [
    { value: "colors", label: "Colors" },
    { value: "typography", label: "Typography" },
    { value: "inputs", label: "Inputs" },
    { value: "selects", label: "Selects" },
    { value: "buttons", label: "Buttons" },
    { value: "badges", label: "Badges & Tags" },
    { value: "form-controls", label: "Form Controls" },
    { value: "avatars", label: "Avatars" },
    { value: "lists", label: "Lists" },
    { value: "cards", label: "Cards" },
    { value: "accordions", label: "Accordions" },
    { value: "steppers", label: "Steppers" },
    { value: "breadcrumbs", label: "Breadcrumbs" },
    { value: "key-values", label: "Key-Values" },
    { value: "skeletons", label: "Skeletons" },
    { value: "loaders", label: "Loaders" },
    { value: "dividers", label: "Dividers" },
    { value: "toasts", label: "Toasts" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "colors":
        return <ColorsTab />;
      case "typography":
        return <TypographyTab />;
      case "inputs":
        return <InputsTab />;
      case "selects":
        return <SelectsTab />;
      case "buttons":
        return <ButtonsTab />;
      case "badges":
        return <BadgesTab />;
      case "form-controls":
        return <FormControlsTab />;
      case "avatars":
        return <AvatarsTab />;
      case "lists":
        return <ListsTab />;
      case "cards":
        return <CardsTab />;
      case "accordions":
        return <AccordionsTab />;
      case "steppers":
        return <SteppersTab />;
      case "breadcrumbs":
        return <BreadcrumbsTab />;
      case "key-values":
        return <KeyValuesTab />;
      case "skeletons":
        return <SkeletonsTab />;
      case "loaders":
        return <LoadersTab />;
      case "dividers":
        return <DividersTab />;
      case "toasts":
        return <ToastsTab />;
      default:
        return <ColorsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-tatva-background-secondary">
      {/* Header */}
      <div className="bg-tatva-background-primary border-b border-tatva-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Design System</h1>
              <Text variant="body-sm" tone="secondary">
                Lex AI LMS - Component Library
              </Text>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="indigo">Plus Jakarta Sans</Badge>
              <Badge variant="orange">Lora</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-tatva-background-primary border-b border-tatva-border">
        <div className="w-full overflow-x-auto">
          <div className="flex justify-center px-8 pt-4">
            <Tabs
              tabs={tabs}
              value={activeTab}
              onValueChange={setActiveTab}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {renderTabContent()}
      </div>

      {/* Toast Provider */}
      <Toaster />
    </div>
  );
}
