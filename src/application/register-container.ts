import type { AwilixContainer } from "awilix";

import { createContainer, setContainer } from "@/common/utils/container";
import { registerModule as registerLandingPageModule } from "@/modules/landing-page/module-configuration";
import { registerModule as registerSettingsModule } from "@/modules/settings/module-configuration";

export function registerContainer(container: AwilixContainer<object>): void {
  registerLandingPageModule(container);
  registerSettingsModule(container);
}

export function initializeContainer(): void {
  const container = createContainer();
  registerContainer(container);
  setContainer(container);
}
