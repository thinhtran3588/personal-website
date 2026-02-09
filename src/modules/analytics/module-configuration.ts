import { asFunction, type AwilixContainer } from "awilix";

import { LogEventUseCase } from "@/modules/analytics/application/log-event-use-case";
import { SetAnalyticsUserUseCase } from "@/modules/analytics/application/set-analytics-user-use-case";
import {
  FirebaseAnalyticsService,
  type GetAnalyticsInstance,
} from "@/modules/analytics/infrastructure/services/firebase-analytics-service";

type AnalyticsCradle = {
  analyticsService: InstanceType<typeof FirebaseAnalyticsService>;
  getAnalyticsInstance: GetAnalyticsInstance;
};

export function registerModule(container: AwilixContainer<object>): void {
  container.register({
    analyticsService: asFunction(
      (c: AnalyticsCradle) =>
        new FirebaseAnalyticsService(c.getAnalyticsInstance),
    ).singleton(),
    logEventUseCase: asFunction(
      (c: AnalyticsCradle) => new LogEventUseCase(c.analyticsService),
    ).singleton(),
    setAnalyticsUserUseCase: asFunction(
      (c: AnalyticsCradle) => new SetAnalyticsUserUseCase(c.analyticsService),
    ).singleton(),
  });
}
