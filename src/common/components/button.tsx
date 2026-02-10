"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
} from "react";

import { LoaderIcon } from "@/common/components/icons";
import { cn } from "@/common/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-[var(--duration-normal)] ease-[var(--ease-spring)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "btn-primary rounded-full border-0 bg-[linear-gradient(135deg,var(--accent)_0%,var(--accent-electric)_50%,var(--accent-purple)_100%)] text-white shadow-[0_4px_12px_var(--accent-glow)] hover:opacity-95 hover:shadow-[0_6px_16px_var(--accent-glow)] hover:translate-y-[-1px] hover:scale-[1.02] active:scale-[0.98]",
        default:
          "btn-default glass-panel rounded-full text-[var(--text-primary)] shadow-[0_8px_24px_var(--accent-glow)] hover:translate-y-[-1px] hover:shadow-[0_12px_28px_var(--accent-glow)] active:scale-[0.98] focus-visible:bg-[var(--surface-soft)]",
        secondary:
          "btn-secondary glass-panel rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] active:scale-[0.98] focus-visible:bg-[var(--surface-soft)] focus-visible:text-[var(--text-primary)]",
        outline:
          "btn-outline border border-[var(--glass-border)] bg-transparent rounded-full text-[var(--text-primary)] hover:bg-[var(--glass-highlight)] active:scale-[0.98] focus-visible:bg-[var(--glass-highlight)]",
        ghost:
          "text-[var(--text-muted)] hover:bg-[var(--glass-highlight)] hover:text-[var(--text-primary)] active:scale-[0.98] focus-visible:bg-[var(--glass-highlight)] focus-visible:text-[var(--text-primary)]",
        link: "text-[var(--accent)] underline-offset-4 hover:underline focus-visible:bg-[var(--glass-highlight)] focus-visible:no-underline",
        destructive:
          "btn-destructive bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] focus-visible:bg-red-700",
      },
      size: {
        default: "h-11 min-w-24 px-5 py-2.5",
        sm: "h-9 min-w-20 rounded-full px-4 text-xs",
        lg: "h-12 min-w-28 rounded-full px-6 text-base",
        icon: "h-11 w-11 rounded-full",
        "icon-sm": "h-9 w-9 rounded-full",
        "icon-lg": "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const slotClassName = cn(buttonVariants({ variant, size, className }));
    if (asChild) {
      const childArray = Children.toArray(children);
      const singleChild =
        childArray.length === 1 && isValidElement(childArray[0])
          ? (childArray[0] as ReactElement<{
              ref?: React.Ref<HTMLButtonElement>;
              className?: string;
            }>)
          : null;
      if (singleChild) {
        const childProps = singleChild.props as Record<string, unknown> & {
          ref?: React.Ref<HTMLButtonElement>;
          className?: string;
        };
        // Ref callback runs on mount/unmount only; refs are not read during render.
        /* eslint-disable-next-line react-hooks/refs */
        return cloneElement(singleChild, {
          ...childProps,
          ...props,
          className: cn(slotClassName, childProps.className),
          ref: (value: HTMLButtonElement | null) => {
            if (typeof ref === "function") ref(value);
            else if (ref != null)
              (
                ref as React.MutableRefObject<HTMLButtonElement | null>
              ).current = value;
            if (typeof childProps.ref === "function") childProps.ref(value);
            else if (childProps.ref != null)
              (
                childProps.ref as React.MutableRefObject<HTMLButtonElement | null>
              ).current = value;
          },
          "data-slot": "button",
        } as Record<string, unknown>);
      }
    }
    return (
      <button
        ref={ref}
        className={slotClassName}
        data-slot="button"
        disabled={disabled ?? loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <LoaderIcon className="size-4 shrink-0" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
