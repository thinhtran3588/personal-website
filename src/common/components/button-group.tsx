"use client";

import type { ReactNode } from "react";

import { cn } from "@/common/utils/cn";

type ButtonGroupProps = {
  children: ReactNode;
  className?: string;
  justifyEnd?: boolean;
};

export function ButtonGroup({
  children,
  className,
  justifyEnd = false,
}: ButtonGroupProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 px-4",
        justifyEnd && "justify-end",
        className,
      )}
    >
      {children}
    </div>
  );
}
