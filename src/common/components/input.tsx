"use client";

import { forwardRef, useState } from "react";

import { EyeIcon, EyeOffIcon } from "@/common/components/icons";
import { cn } from "@/common/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const inputBaseClass =
  "flex h-11 w-full rounded-full border border-[var(--glass-border)] bg-[var(--glass-highlight)] px-4 py-1 text-sm text-[var(--text-primary)] shadow-sm transition-all duration-[var(--duration-normal)] ease-[var(--ease-spring)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-50";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    if (isPassword) {
      return (
        <div className="relative flex w-full items-center">
          <input
            type={showPassword ? "text" : "password"}
            className={cn(inputBaseClass, "pr-10", className)}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 flex size-6 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] focus-visible:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </button>
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(inputBaseClass, className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
