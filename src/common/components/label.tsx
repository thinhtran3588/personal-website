import { forwardRef } from "react";

import { cn } from "@/common/utils/cn";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm leading-none font-medium text-[var(--text-primary)] peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = "Label";

export { Label };
