"use client";

import * as React from "react";
import Image from "next/image";
import { Text, Icon } from "@/components";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface MDXContentProps {
  /** The content to render */
  children: React.ReactNode;
  /** Additional class names */
  className?: string;
}

// ============================================================================
// Prose Component - Typography styles for MDX/rich content
// ============================================================================

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-none",
        // Use CSS selectors for styling child elements
        "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:text-tatva-content-primary",
        "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-tatva-content-primary [&_h2]:border-b [&_h2]:border-tatva-border [&_h2]:pb-2",
        "[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-tatva-content-primary",
        "[&_h4]:text-lg [&_h4]:font-medium [&_h4]:mb-2 [&_h4]:mt-4 [&_h4]:text-tatva-content-primary",
        "[&_p]:text-tatva-content-secondary [&_p]:leading-relaxed [&_p]:mb-4",
        "[&_a]:text-tatva-brand-primary [&_a]:no-underline hover:[&_a]:underline",
        "[&_ul]:text-tatva-content-secondary [&_ul]:mb-4 [&_ul]:pl-6 [&_ul]:list-disc",
        "[&_ol]:text-tatva-content-secondary [&_ol]:mb-4 [&_ol]:pl-6 [&_ol]:list-decimal",
        "[&_li]:mb-2",
        "[&_code]:rounded [&_code]:bg-tatva-background-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-tatva-content-primary",
        "[&_pre]:rounded-lg [&_pre]:bg-tatva-background-secondary [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:mb-4",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-tatva-brand-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-tatva-content-tertiary [&_blockquote]:my-4",
        "[&_table]:w-full [&_table]:border-collapse",
        "[&_th]:border [&_th]:border-tatva-border [&_th]:bg-tatva-background-secondary [&_th]:p-3 [&_th]:text-left [&_th]:font-medium",
        "[&_td]:border [&_td]:border-tatva-border [&_td]:p-3",
        "[&_img]:rounded-lg [&_img]:shadow-md",
        "[&_strong]:text-tatva-content-primary [&_strong]:font-semibold",
        "[&_em]:text-tatva-content-secondary",
        "[&_hr]:border-tatva-border [&_hr]:my-8",
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================================================
// MDX Component Overrides
// ============================================================================

export const mdxComponents = {
  h1: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h1 id={id} className="scroll-mt-24 text-3xl font-bold mb-6 mt-8 text-tatva-content-primary">
      {children}
    </h1>
  ),
  h2: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h2 id={id} className="scroll-mt-24 text-2xl font-semibold mb-4 mt-8 text-tatva-content-primary border-b border-tatva-border pb-2">
      {children}
    </h2>
  ),
  h3: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h3 id={id} className="scroll-mt-24 text-xl font-semibold mb-3 mt-6 text-tatva-content-primary">
      {children}
    </h3>
  ),
  h4: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h4 id={id} className="scroll-mt-24 text-lg font-medium mb-2 mt-4 text-tatva-content-primary">
      {children}
    </h4>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="text-tatva-content-secondary leading-relaxed mb-4">
      {children}
    </p>
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a
      href={href}
      className="text-tatva-brand-primary hover:underline"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside mb-4 text-tatva-content-secondary space-y-2 pl-4">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-inside mb-4 text-tatva-content-secondary space-y-2 pl-4">
      {children}
    </ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="text-tatva-content-secondary">{children}</li>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-tatva-brand-primary pl-4 italic text-tatva-content-tertiary my-4">
      {children}
    </blockquote>
  ),
  code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="rounded bg-tatva-background-secondary px-1.5 py-0.5 font-mono text-sm text-tatva-content-primary">
          {children}
        </code>
      );
    }
    return (
      <code className={cn("block", className)}>
        {children}
      </code>
    );
  },
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="rounded-lg bg-tatva-background-secondary p-4 overflow-x-auto mb-4 font-mono text-sm">
      {children}
    </pre>
  ),
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full border-collapse">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="border border-tatva-border bg-tatva-background-secondary p-3 text-left font-medium text-tatva-content-primary">
      {children}
    </th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="border border-tatva-border p-3 text-tatva-content-secondary">
      {children}
    </td>
  ),
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    src ? (
      <span className="relative block my-4 aspect-video w-full overflow-hidden rounded-lg shadow-md">
        <Image src={src} alt={alt || ""} fill className="object-cover" />
      </span>
    ) : null
  ),
  hr: () => <hr className="border-tatva-border my-8" />,
};

// ============================================================================
// MDX Content Wrapper Component
// ============================================================================

export function MDXContent({ children, className }: MDXContentProps) {
  return (
    <article className={cn("mdx-content", className)}>
      <Prose>{children}</Prose>
    </article>
  );
}

// ============================================================================
// Code Block Component with Copy Button
// ============================================================================

export function CodeBlock({
  children,
  language,
  filename,
  showLineNumbers = false,
}: {
  children: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-lg border border-tatva-border overflow-hidden">
      {/* Header */}
      {(filename || language) && (
        <div className="flex items-center justify-between bg-tatva-background-tertiary px-4 py-2 border-b border-tatva-border">
          <Text variant="body-xs" tone="tertiary" className="font-mono">
            {filename || language}
          </Text>
          <button
            onClick={handleCopy}
            className="text-tatva-content-tertiary hover:text-tatva-content-secondary transition-colors"
          >
            <Text variant="body-xs">{copied ? "Copied!" : "Copy"}</Text>
          </button>
        </div>
      )}

      {/* Code */}
      <pre className="bg-tatva-background-secondary p-4 overflow-x-auto">
        <code className={cn("font-mono text-sm", showLineNumbers && "table")}>
          {showLineNumbers
            ? children.split("\n").map((line, i) => (
                <span key={i} className="table-row">
                  <span className="table-cell pr-4 text-tatva-content-quaternary select-none text-right w-8">
                    {i + 1}
                  </span>
                  <span className="table-cell text-tatva-content-primary">{line}</span>
                </span>
              ))
            : children}
        </code>
      </pre>
    </div>
  );
}

// ============================================================================
// Callout/Admonition Component
// ============================================================================

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "warning" | "error" | "success";
  title?: string;
  children: React.ReactNode;
}) {
  const config = {
    info: {
      icon: "info" as const,
      containerClass: "border-lms-primary-200 bg-lms-primary-50",
      iconBgClass: "bg-lms-primary-100",
      iconClass: "text-lms-primary-600",
      titleClass: "text-lms-primary-800",
    },
    warning: {
      icon: "warning" as const,
      containerClass: "border-amber-200 bg-amber-50",
      iconBgClass: "bg-amber-100",
      iconClass: "text-amber-600",
      titleClass: "text-amber-800",
    },
    error: {
      icon: "error" as const,
      containerClass: "border-red-200 bg-red-50",
      iconBgClass: "bg-red-100",
      iconClass: "text-red-600",
      titleClass: "text-red-800",
    },
    success: {
      icon: "check" as const,
      containerClass: "border-green-200 bg-green-50",
      iconBgClass: "bg-green-100",
      iconClass: "text-green-600",
      titleClass: "text-green-800",
    },
  };

  const { icon, containerClass, iconBgClass, iconClass, titleClass } = config[type];

  return (
    <div className={cn(
      "my-6 flex gap-4 rounded-xl border p-4",
      containerClass
    )}>
      <div className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg",
        iconBgClass
      )}>
        <Icon name={icon} size="md" className={iconClass} />
      </div>
      <div className="flex-1 pt-0.5">
        <Text variant="label-md" className={cn("mb-1", titleClass)}>
          {title || type.charAt(0).toUpperCase() + type.slice(1)}
        </Text>
        <div className="text-tatva-content-secondary text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

export default MDXContent;
