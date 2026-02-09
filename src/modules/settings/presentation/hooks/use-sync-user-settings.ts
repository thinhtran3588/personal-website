"use client";

import { useEffect, useRef } from "react";

import { useContainer } from "@/common/hooks/use-container";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";
import type { LoadUserSettingsUseCase } from "@/modules/settings/application/load-user-settings-use-case";
import { useUserSettingsStore } from "@/modules/settings/presentation/hooks/use-user-settings-store";

export function useSyncUserSettings(): void {
  const container = useContainer();
  const user = useAuthUserStore((s) => s.user);
  const authLoading = useAuthUserStore((s) => s.loading);
  const setSettings = useUserSettingsStore((s) => s.setSettings);
  const hasCompletedInitialLoad = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    const shouldLoad = !hasCompletedInitialLoad.current || user?.id != null;
    if (!shouldLoad) return;

    hasCompletedInitialLoad.current = true;
    const useCase = container.resolve(
      "loadUserSettingsUseCase",
    ) as LoadUserSettingsUseCase;
    const local = useUserSettingsStore.getState().settings;
    useCase.execute({ userId: user?.id ?? null }).then((result) => {
      if (!result.success) return;
      const remote = result.data;
      const merged = remote ? { ...local, ...remote } : local;
      setSettings(merged);
    });
  }, [container, user?.id, authLoading, setSettings]);
}
