"use client";

import { LanguageSelector } from "@/modules/settings/presentation/components/language-selector";
import { ThemeSelector } from "@/modules/settings/presentation/components/theme-selector";

export function SettingsHeaderSlot() {
  return (
    <>
      <ThemeSelector />
      <LanguageSelector />
    </>
  );
}
