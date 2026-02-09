"use client";

import { forwardRef } from "react";

import { cn } from "@/common/utils/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const textareaBaseClass =
  "flex min-h-[2.5rem] w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-sm transition-colors placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:border-[var(--glass-border)] focus-visible:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-50";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(textareaBaseClass, className)}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
