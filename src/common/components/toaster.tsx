"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "border border-[var(--glass-border)] bg-[var(--glass-bg-strong)] text-[var(--text-primary)] backdrop-blur-xl",
          success: "text-green-500",
          error: "text-red-500",
        },
      }}
    />
  );
}
