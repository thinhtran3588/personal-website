"use client";

import { useEffect } from "react";

import { useContainer } from "@/common/hooks/use-container";
import type { SetAnalyticsUserUseCase } from "@/modules/analytics/application/set-analytics-user-use-case";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";

export function useSyncAnalyticsUser(): void {
  const container = useContainer();
  const user = useAuthUserStore((s) => s.user);

  useEffect(() => {
    const setAnalyticsUserUseCase = container.resolve(
      "setAnalyticsUserUseCase",
    ) as SetAnalyticsUserUseCase;
    setAnalyticsUserUseCase.execute({ userId: user?.id ?? null });
  }, [container, user]);
}
