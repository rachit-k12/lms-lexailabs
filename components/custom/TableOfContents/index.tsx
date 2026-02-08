"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Text } from "@/components";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface TocItem {
  id: string;
  title: string;
  level: 1 | 2 | 3;
}

export interface TableOfContentsProps {
  /** List of headings to display */
  items: TocItem[];
  /** Currently active heading ID */
  activeId?: string;
  /** Handler when a heading is clicked */
  onItemClick?: (id: string) => void;
  /** Title for the TOC section */
  title?: string;
  /** Additional class names */
  className?: string;
}

// ============================================================================
// Hook for scroll spy
// ============================================================================

function useScrollSpy(ids: string[], offset: number = 100) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      let currentId = "";

      for (const id of ids) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= offset) {
            currentId = id;
          }
        }
      }

      setActiveId(currentId);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ids, offset]);

  return activeId;
}

// ============================================================================
// Component
// ============================================================================

export function TableOfContents({
  items,
  activeId: controlledActiveId,
  onItemClick,
  title = "On this page",
  className,
}: TableOfContentsProps) {
  const ids = items.map((item) => item.id);
  const scrollSpyActiveId = useScrollSpy(ids);
  const activeId = controlledActiveId ?? scrollSpyActiveId;

  const handleClick = (id: string) => {
    if (onItemClick) {
      onItemClick(id);
    } else {
      // Default scroll behavior
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className={cn("sticky top-tatva-8", className)}>
      <Text variant="label-sm" tone="tertiary" className="mb-tatva-4">
        {title}
      </Text>

      <ul className="space-y-tatva-3">
        {items.map((item) => {
          const isActive = item.id === activeId;
          const indent = item.level === 1 ? "" : item.level === 2 ? "pl-tatva-4" : "pl-tatva-8";

          return (
            <li key={item.id}>
              <button
                onClick={() => handleClick(item.id)}
                className={cn(
                  "block w-full text-left py-tatva-2 transition-colors cursor-pointer",
                  indent,
                  isActive
                    ? "text-tatva-brand-primary"
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Text
                  variant="body-sm"
                  className={cn(
                    "line-clamp-2 transition-colors",
                    isActive ? "text-lms-primary-600 font-medium" : "opacity-70"
                  )}
                >
                  {item.title}
                </Text>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default TableOfContents;
