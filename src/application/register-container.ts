import { asValue, type AwilixContainer } from "awilix";

import {
  getAnalyticsInstance,
  getAuthInstance,
  getFirestoreInstance,
} from "@/application/config/firebase-config";
import { createContainer, setContainer } from "@/common/utils/container";
import { registerModule as registerAnalyticsModule } from "@/modules/analytics/module-configuration";
import { registerModule as registerAuthModule } from "@/modules/auth/module-configuration";
import { registerModule as registerBooksModule } from "@/modules/books/module-configuration";
import { registerModule as registerDocsModule } from "@/modules/docs/module-configuration";
import { registerModule as registerLandingPageModule } from "@/modules/landing-page/module-configuration";
import { registerModule as registerSettingsModule } from "@/modules/settings/module-configuration";

export function registerContainer(container: AwilixContainer<object>): void {
  container.register({
    getAnalyticsInstance: asValue(getAnalyticsInstance),
    getAuthInstance: asValue(getAuthInstance),
    getFirestoreInstance: asValue(getFirestoreInstance),
  });
  registerAnalyticsModule(container);
  registerAuthModule(container);
  registerBooksModule(container);
  registerDocsModule(container);
  registerLandingPageModule(container);
  registerSettingsModule(container);
}

export function initializeContainer(): void {
  const container = createContainer();
  registerContainer(container);
  setContainer(container);
}
