"use client";

import { useEffect } from "react";

import { getResolvedTheme } from "@/common/utils/theme";
import { useUserSettingsStore } from "@/modules/settings/presentation/hooks/use-user-settings-store";

function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
}

const DEFAULT_THEME = "system" as const;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = (useUserSettingsStore((s) => s.settings.theme) ??
    DEFAULT_THEME) as "system" | "light" | "dark";

  useEffect(() => {
    const resolved = getResolvedTheme(theme);
    applyTheme(resolved);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: light)");
    const listener = () => applyTheme(getResolvedTheme("system"));
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  return <>{children}</>;
}
