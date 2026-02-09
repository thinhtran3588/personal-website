import { beforeEach, describe, expect, it, vi } from "vitest";

import { SetAnalyticsUserUseCase } from "@/modules/analytics/application/set-analytics-user-use-case";
import type { AnalyticsService } from "@/modules/analytics/domain/interfaces";

describe("SetAnalyticsUserUseCase", () => {
  let useCase: SetAnalyticsUserUseCase;
  let mockAnalyticsService: AnalyticsService;

  beforeEach(() => {
    mockAnalyticsService = {
      logEvent: vi.fn(),
      setUserId: vi.fn(),
    };
    useCase = new SetAnalyticsUserUseCase(mockAnalyticsService);
  });

  it("calls analyticsService.setUserId with the provided user ID", async () => {
    await useCase.execute({ userId: "user-123" });
    expect(mockAnalyticsService.setUserId).toHaveBeenCalledWith("user-123");
  });

  it("calls analyticsService.setUserId with null to clear user", async () => {
    await useCase.execute({ userId: null });
    expect(mockAnalyticsService.setUserId).toHaveBeenCalledWith(null);
  });
});
