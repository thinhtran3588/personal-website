"use client";

import { useCallback } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { UserSettings } from "@/modules/settings/domain/types";

type UserSettingsState = {
  settings: UserSettings;
  setSettings: (settings: UserSettings) => void;
};

const STORAGE_KEY = "user-settings";

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set) => ({
      settings: {},
      setSettings: (settings) => set({ settings }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
);

export type UseUserSettingsReturn = {
  settings: UserSettings;
  setSettings: (settings: UserSettings) => void;
  persistLocale: (locale: string) => void;
  persistTheme: (theme: UserSettings["theme"]) => void;
};

export function useUserSettings(): UseUserSettingsReturn {
  const settings = useUserSettingsStore((s) => s.settings);
  const setSettings = useUserSettingsStore((s) => s.setSettings);

  const persistLocale = useCallback(
    (locale: string) => {
      setSettings({ ...settings, locale });
    },
    [settings, setSettings],
  );

  const persistTheme = useCallback(
    (theme: UserSettings["theme"]) => {
      if (theme === undefined) return;
      setSettings({ ...settings, theme });
    },
    [settings, setSettings],
  );

  return { settings, setSettings, persistLocale, persistTheme };
}
