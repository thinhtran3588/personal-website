"use client";

import { initializeContainer } from "@/application/register-container";
import { getContainerOrNull } from "@/common/utils/container";

export function AppInitializer() {
  if (getContainerOrNull() === null) {
    initializeContainer();
  }

  return null;
}
