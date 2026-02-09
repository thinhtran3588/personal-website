"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { useContainer } from "@/common/hooks/use-container";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";
import type { SaveUserSettingsUseCase } from "@/modules/settings/application/save-user-settings-use-case";
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
  const t = useTranslations("settings");
  const container = useContainer();
  const user = useAuthUserStore((s) => s.user);
  const settings = useUserSettingsStore((s) => s.settings);
  const setSettings = useUserSettingsStore((s) => s.setSettings);

  const persistLocale = useCallback(
    (locale: string) => {
      const next = { ...settings, locale };
      setSettings(next);
      if (!user?.id) return;
      const useCase = container.resolve(
        "saveUserSettingsUseCase",
      ) as SaveUserSettingsUseCase;
      useCase.execute({ userId: user.id, settings: next }).then((result) => {
        if (!result.success) toast.error(t("error.saveFailed"));
      });
    },
    [container, user, settings, setSettings, t],
  );

  const persistTheme = useCallback(
    (theme: UserSettings["theme"]) => {
      if (theme === undefined) return;
      const next = { ...settings, theme };
      setSettings(next);
      if (!user?.id) return;
      const useCase = container.resolve(
        "saveUserSettingsUseCase",
      ) as SaveUserSettingsUseCase;
      useCase.execute({ userId: user.id, settings: next }).then((result) => {
        if (!result.success) toast.error(t("error.saveFailed"));
      });
    },
    [container, user, settings, setSettings, t],
  );

  return { settings, setSettings, persistLocale, persistTheme };
}
