import {
  logEvent as firebaseLogEvent,
  setUserId as firebaseSetUserId,
} from "firebase/analytics";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  FirebaseAnalyticsService,
  type GetAnalyticsInstance,
} from "@/modules/analytics/infrastructure/services/firebase-analytics-service";

describe("FirebaseAnalyticsService", () => {
  let service: FirebaseAnalyticsService;
  let mockGetAnalyticsInstance: ReturnType<typeof vi.fn<GetAnalyticsInstance>>;

  beforeEach(() => {
    mockGetAnalyticsInstance = vi.fn();
    vi.mocked(firebaseLogEvent).mockReset();
    vi.mocked(firebaseSetUserId).mockReset();
    service = new FirebaseAnalyticsService(mockGetAnalyticsInstance);
  });

  it("logEvent does nothing when analytics instance is null", () => {
    mockGetAnalyticsInstance.mockReturnValue(null);
    service.logEvent("test_event", { key: "value" });
    expect(firebaseLogEvent).not.toHaveBeenCalled();
  });

  it("logEvent calls firebaseLogEvent with correct params when analytics is available", () => {
    const mockAnalytics = {} as import("firebase/analytics").Analytics;
    mockGetAnalyticsInstance.mockReturnValue(mockAnalytics);
    service.logEvent("test_event", { key: "value" });
    expect(firebaseLogEvent).toHaveBeenCalledWith(mockAnalytics, "test_event", {
      key: "value",
    });
  });

  it("logEvent calls firebaseLogEvent without params when none provided", () => {
    const mockAnalytics = {} as import("firebase/analytics").Analytics;
    mockGetAnalyticsInstance.mockReturnValue(mockAnalytics);
    service.logEvent("test_event");
    expect(firebaseLogEvent).toHaveBeenCalledWith(
      mockAnalytics,
      "test_event",
      undefined,
    );
  });

  it("setUserId does nothing when analytics instance is null", () => {
    mockGetAnalyticsInstance.mockReturnValue(null);
    service.setUserId("user-123");
    expect(firebaseSetUserId).not.toHaveBeenCalled();
  });

  it("setUserId calls firebaseSetUserId with user ID when analytics is available", () => {
    const mockAnalytics = {} as import("firebase/analytics").Analytics;
    mockGetAnalyticsInstance.mockReturnValue(mockAnalytics);
    service.setUserId("user-123");
    expect(firebaseSetUserId).toHaveBeenCalledWith(mockAnalytics, "user-123");
  });

  it("setUserId calls firebaseSetUserId with null to clear user", () => {
    const mockAnalytics = {} as import("firebase/analytics").Analytics;
    mockGetAnalyticsInstance.mockReturnValue(mockAnalytics);
    service.setUserId(null);
    expect(firebaseSetUserId).toHaveBeenCalledWith(mockAnalytics, null);
  });
});
