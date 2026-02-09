import { createContainer, InjectionMode } from "awilix";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { registerModule } from "@/modules/analytics/module-configuration";

describe("analytics module-configuration", () => {
  let container: ReturnType<typeof createContainer>;

  beforeEach(() => {
    container = createContainer({ injectionMode: InjectionMode.PROXY });
    container.register({
      getAnalyticsInstance: {
        resolve: () => vi.fn(() => null),
      },
    });
    registerModule(container);
  });

  it("resolves analyticsService", () => {
    const service = container.resolve("analyticsService") as {
      logEvent: () => void;
      setUserId: () => void;
    };
    expect(service).toBeDefined();
    expect(typeof service.logEvent).toBe("function");
    expect(typeof service.setUserId).toBe("function");
  });

  it("resolves logEventUseCase with execute method", () => {
    const useCase = container.resolve("logEventUseCase") as {
      execute: () => unknown;
    };
    expect(useCase).toBeDefined();
    expect(typeof useCase.execute).toBe("function");
  });

  it("resolves setAnalyticsUserUseCase with execute method", () => {
    const useCase = container.resolve("setAnalyticsUserUseCase") as {
      execute: () => unknown;
    };
    expect(useCase).toBeDefined();
    expect(typeof useCase.execute).toBe("function");
  });

  it("analyticsService is a singleton", () => {
    const a = container.resolve("analyticsService");
    const b = container.resolve("analyticsService");
    expect(a).toBe(b);
  });

  it("logEventUseCase is a singleton", () => {
    const a = container.resolve("logEventUseCase");
    const b = container.resolve("logEventUseCase");
    expect(a).toBe(b);
  });

  it("setAnalyticsUserUseCase is a singleton", () => {
    const a = container.resolve("setAnalyticsUserUseCase");
    const b = container.resolve("setAnalyticsUserUseCase");
    expect(a).toBe(b);
  });
});
