import { beforeEach, describe, expect, it, vi } from "vitest";

import { LogEventUseCase } from "@/modules/analytics/application/log-event-use-case";
import type { AnalyticsService } from "@/modules/analytics/domain/interfaces";

describe("LogEventUseCase", () => {
  let useCase: LogEventUseCase;
  let mockAnalyticsService: AnalyticsService;

  beforeEach(() => {
    mockAnalyticsService = {
      logEvent: vi.fn(),
      setUserId: vi.fn(),
    };
    useCase = new LogEventUseCase(mockAnalyticsService);
  });

  it("calls analyticsService.logEvent with event name and params", async () => {
    await useCase.execute({
      eventName: "button_click",
      params: { button_id: "cta" },
    });
    expect(mockAnalyticsService.logEvent).toHaveBeenCalledWith("button_click", {
      button_id: "cta",
    });
  });

  it("calls analyticsService.logEvent without params when not provided", async () => {
    await useCase.execute({ eventName: "page_view" });
    expect(mockAnalyticsService.logEvent).toHaveBeenCalledWith(
      "page_view",
      undefined,
    );
  });
});
