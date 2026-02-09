"use client";

import { useEffect, useRef, useState } from "react";

import { ChevronDownIcon } from "@/common/components/icons";
import { Link, usePathname } from "@/common/routing/navigation";
import { cn } from "@/common/utils/cn";

export type DocItem = {
  label: string;
  href: string;
};

type DocumentsDropdownProps = {
  documentsLabel: string;
  items: DocItem[];
};

export function DocumentsDropdown({
  documentsLabel,
  items,
}: DocumentsDropdownProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isActive = pathname.startsWith("/docs");

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className={cn(
          "nav-link-indicator relative flex items-center gap-1 py-1 text-[var(--text-muted)] transition hover:text-[var(--text-primary)]",
          "after:absolute after:bottom-0 after:left-0 after:block after:h-0.5 after:w-full after:origin-left after:bg-[var(--text-primary)] after:transition-transform after:duration-300 after:content-['']",
          isActive
            ? "font-bold text-[var(--text-primary)] after:scale-x-100"
            : "after:scale-x-0",
        )}
        aria-label={documentsLabel}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {documentsLabel}
        <ChevronDownIcon
          className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")}
        />
      </button>
      {isOpen ? (
        <div
          className="glass-dropdown pointer-events-auto absolute left-0 z-40 mt-2 flex min-w-48 flex-col gap-0.5 rounded-2xl px-2 py-2 text-sm [color:var(--text-primary)]"
          role="menu"
          aria-label={documentsLabel}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className={cn(
                "rounded-lg px-3 py-2 font-medium transition hover:bg-[var(--glass-highlight)] hover:text-[var(--text-primary)]",
                pathname === item.href
                  ? "bg-[var(--glass-highlight)] text-[var(--text-primary)]"
                  : "text-[var(--text-muted)]",
              )}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
