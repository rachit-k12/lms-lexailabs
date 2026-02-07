"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Text, Icon } from "@/components";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface MarkdownContentProps {
  /** Markdown content string to render */
  content: string;
  /** Additional class names */
  className?: string;
  /** Whether content is streaming (for animation effects) */
  isStreaming?: boolean;
}

// ============================================================================
// Code Copy Button
// ============================================================================

function CodeCopyButton({ code }: { code: string }) {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(console.error);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <button
      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700"
      aria-label="Copy code"
      onClick={handleCopy}
    >
      <Icon
        name={isCopied ? "check" : "copy"}
        size="xs"
        className={isCopied ? "text-green-600" : undefined}
      />
      <Text variant="body-xs" className={isCopied ? "text-green-600" : "text-gray-500"}>
        {isCopied ? "Copied!" : "Copy"}
      </Text>
    </button>
  );
}

// ============================================================================
// Custom Markdown Components
// ============================================================================

function MarkdownH1({ children, id }: { children?: React.ReactNode; id?: string }) {
  return (
    <h1 id={id} className="scroll-mt-24 text-3xl font-bold mb-6 mt-8 text-tatva-content-primary">
      {children}
    </h1>
  );
}

function MarkdownH2({ children, id }: { children?: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-2xl font-semibold mb-4 mt-8 text-tatva-content-primary border-b border-tatva-border pb-2">
      {children}
    </h2>
  );
}

function MarkdownH3({ children, id }: { children?: React.ReactNode; id?: string }) {
  return (
    <h3 id={id} className="scroll-mt-24 text-xl font-semibold mb-3 mt-6 text-tatva-content-primary">
      {children}
    </h3>
  );
}

function MarkdownH4({ children, id }: { children?: React.ReactNode; id?: string }) {
  return (
    <h4 id={id} className="scroll-mt-24 text-lg font-medium mb-2 mt-4 text-tatva-content-primary">
      {children}
    </h4>
  );
}

function MarkdownP({ children }: { children?: React.ReactNode }) {
  return (
    <p className="text-tatva-content-secondary leading-relaxed mb-4">
      {children}
    </p>
  );
}

function MarkdownA({ href, children }: { href?: string; children?: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-lms-primary-600 hover:text-lms-primary-700 hover:underline transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

function MarkdownUl({ children }: { children?: React.ReactNode }) {
  return (
    <ul className="list-disc list-inside mb-4 text-tatva-content-secondary space-y-2 pl-4">
      {children}
    </ul>
  );
}

function MarkdownOl({ children }: { children?: React.ReactNode }) {
  return (
    <ol className="list-decimal list-inside mb-4 text-tatva-content-secondary space-y-2 pl-4">
      {children}
    </ol>
  );
}

function MarkdownLi({ children }: { children?: React.ReactNode }) {
  return (
    <li className="text-tatva-content-secondary">{children}</li>
  );
}

function MarkdownBlockquote({ children }: { children?: React.ReactNode }) {
  return (
    <blockquote className="border-l-4 border-lms-primary-400 bg-lms-primary-50 pl-4 pr-4 py-3 italic text-tatva-content-tertiary my-4 rounded-r-lg">
      {children}
    </blockquote>
  );
}

function MarkdownTable({ children }: { children?: React.ReactNode }) {
  return (
    <div className="overflow-x-auto mb-4 rounded-lg border border-tatva-border">
      <table className="w-full border-collapse">
        {children}
      </table>
    </div>
  );
}

function MarkdownTh({ children }: { children?: React.ReactNode }) {
  return (
    <th className="border-b border-tatva-border bg-tatva-background-secondary p-3 text-left font-medium text-tatva-content-primary">
      {children}
    </th>
  );
}

function MarkdownTd({ children }: { children?: React.ReactNode }) {
  return (
    <td className="border-b border-tatva-border p-3 text-tatva-content-secondary">
      {children}
    </td>
  );
}

function MarkdownHr() {
  return <hr className="border-tatva-border my-8" />;
}

// Code component with syntax highlighting
function MarkdownCode({
  inline,
  className,
  children,
  ...props
}: {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  // Ensure we're working with a string and trim whitespace
  const codeContent = typeof children === "string" ? children.trim() : String(children || "").trim();

  // Check if it's inline code (single backticks)
  if (
    inline ||
    (!className && // No language class
      !codeContent.includes("\n") && // No line breaks
      codeContent.length < 100) // Reasonably short
  ) {
    return (
      <code
        className="bg-lms-primary-50 text-lms-primary-700 rounded-md px-1.5 py-0.5 text-sm font-mono"
        {...props}
      >
        {codeContent}
      </code>
    );
  }

  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  return (
    <div className="relative my-6 overflow-hidden rounded-xl border border-gray-200 max-w-full">
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2.5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Icon name="code" size="sm" className="text-gray-400" />
          <Text variant="body-xs" className="font-mono text-gray-600">
            {language || "code"}
          </Text>
        </div>
        <CodeCopyButton code={codeContent} />
      </div>

      {/* Code content */}
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        PreTag="div"
        showLineNumbers
        lineNumberStyle={{
          minWidth: "2.5rem",
          paddingRight: "1rem",
          color: "#9ca3af",
          userSelect: "none",
        }}
        customStyle={{
          margin: 0,
          border: "none",
          borderRadius: 0,
          padding: "1rem",
          backgroundColor: "#fafafa",
        }}
        codeTagProps={{
          style: {
            fontFamily: "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace)",
            fontSize: "0.875rem",
            lineHeight: "1.7",
          },
        }}
      >
        {codeContent}
      </SyntaxHighlighter>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function MarkdownContent({
  content,
  className,
  isStreaming = false,
}: MarkdownContentProps) {
  const [displayedContent, setDisplayedContent] = React.useState(content);
  const contentQueueRef = React.useRef(content);
  const animationFrameRef = React.useRef<number | null>(null);
  const lastUpdateTimeRef = React.useRef(Date.now());

  // Handle streaming animation
  React.useEffect(() => {
    contentQueueRef.current = content;

    if (!isStreaming) {
      setDisplayedContent(content);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animate = (): void => {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateTimeRef.current;
      const CHARS_PER_UPDATE = 15;
      const UPDATE_INTERVAL_MS = 30;

      if (timeSinceLastUpdate >= UPDATE_INTERVAL_MS) {
        setDisplayedContent((prev) => {
          const targetContent = contentQueueRef.current;
          if (prev.length < targetContent.length) {
            const nextChunk = targetContent.slice(prev.length, prev.length + CHARS_PER_UPDATE);
            lastUpdateTimeRef.current = now;
            return prev + nextChunk;
          }
          return prev;
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [content, isStreaming]);

  const contentToRender = isStreaming ? displayedContent : content;

  return (
    <article className={cn("markdown-content max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h1: ({ node, ...props }) => <MarkdownH1 {...props} />,
          h2: ({ node, ...props }) => <MarkdownH2 {...props} />,
          h3: ({ node, ...props }) => <MarkdownH3 {...props} />,
          h4: ({ node, ...props }) => <MarkdownH4 {...props} />,
          p: ({ node, ...props }) => <MarkdownP {...props} />,
          a: ({ node, ...props }) => <MarkdownA {...props} />,
          ul: ({ node, ...props }) => <MarkdownUl {...props} />,
          ol: ({ node, ...props }) => <MarkdownOl {...props} />,
          li: ({ node, ...props }) => <MarkdownLi {...props} />,
          blockquote: ({ node, ...props }) => <MarkdownBlockquote {...props} />,
          table: ({ node, ...props }) => <MarkdownTable {...props} />,
          th: ({ node, ...props }) => <MarkdownTh {...props} />,
          td: ({ node, ...props }) => <MarkdownTd {...props} />,
          hr: () => <MarkdownHr />,
          code: ({ node, className, children, ...props }) => {
            // Detect if inline based on className (block code has language-* class)
            const codeString = String(children || "").trim();
            const isInline = !className && !codeString.includes("\n");
            return (
              <MarkdownCode inline={isInline} className={className} {...props}>
                {children}
              </MarkdownCode>
            );
          },
        }}
      >
        {contentToRender}
      </ReactMarkdown>
    </article>
  );
}

export default MarkdownContent;
