"use client";

import { XIcon } from "@/common/components/icons";
import { cn } from "@/common/utils/cn";

export type ChipVariant =
  | "primary"
  | "default"
  | "secondary"
  | "outline"
  | "destructive";

export type ChipProps = {
  children: React.ReactNode;
  variant?: ChipVariant;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
};

const variantClasses: Record<ChipVariant, string> = {
  primary: "chip-primary",
  default: "chip-default",
  secondary: "chip-secondary",
  outline: "chip-outline",
  destructive: "chip-destructive",
};

const removeButtonClasses: Record<ChipVariant, string> = {
  primary:
    "text-white/90 hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
  default:
    "text-[var(--text-primary)] hover:bg-[var(--glass-border)] hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none",
  secondary:
    "text-[var(--text-muted)] hover:bg-[var(--glass-border)] hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none",
  outline:
    "text-[var(--text-muted)] hover:bg-[var(--glass-highlight)] hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none",
  destructive:
    "text-white/90 hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
};

export function Chip({
  children,
  variant = "default",
  onRemove,
  disabled = false,
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        "tag-pill inline-flex items-center gap-1 rounded-full py-0.5 pl-2 text-xs",
        variantClasses[variant],
        onRemove ? "pr-1" : "px-2",
        className,
      )}
    >
      <span className="max-w-[12rem] truncate">{children}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full disabled:pointer-events-none disabled:opacity-50",
            removeButtonClasses[variant],
          )}
          aria-label={`Remove ${typeof children === "string" ? children : "tag"}`}
        >
          <XIcon className="size-3" />
        </button>
      ) : null}
    </span>
  );
}
