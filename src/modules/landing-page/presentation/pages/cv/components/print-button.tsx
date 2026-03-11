"use client";

import { cn } from "@/common/utils/cn";

type PrintButtonProps = {
  label: string;
  className?: string;
};

export function PrintButton({ label, className }: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className={cn(
        "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900",
        className,
      )}
    >
      {label}
    </button>
  );
}
