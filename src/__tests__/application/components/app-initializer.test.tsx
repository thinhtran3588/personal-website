import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppInitializer } from "@/application/components/app-initializer";

const [
  mockInitializeContainer,
  mockGetContainerOrNull,
  mockUseSyncAuthState,
  mockUseSyncUserSettings,
  mockUseSyncAnalyticsUser,
] = vi.hoisted(() => [vi.fn(), vi.fn(), vi.fn(), vi.fn(), vi.fn()]);

vi.mock("@/application/register-container", () => ({
  initializeContainer: mockInitializeContainer,
}));

vi.mock("@/common/utils/container", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/common/utils/container")>();
  return {
    ...mod,
    getContainerOrNull: (...args: unknown[]) => mockGetContainerOrNull(...args),
  };
});

vi.mock("@/modules/auth/presentation/hooks/use-sync-auth-state", () => ({
  useSyncAuthState: (...args: unknown[]) => mockUseSyncAuthState(...args),
}));

vi.mock("@/modules/settings/presentation/hooks/use-sync-user-settings", () => ({
  useSyncUserSettings: (...args: unknown[]) => mockUseSyncUserSettings(...args),
}));

vi.mock(
  "@/modules/analytics/presentation/hooks/use-sync-analytics-user",
  () => ({
    useSyncAnalyticsUser: (...args: unknown[]) =>
      mockUseSyncAnalyticsUser(...args),
  }),
);

describe("AppInitializer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls initializeContainer when container is null", () => {
    mockGetContainerOrNull.mockReturnValue(null);

    render(<AppInitializer />);

    expect(mockInitializeContainer).toHaveBeenCalledTimes(1);
    expect(mockUseSyncAuthState).toHaveBeenCalled();
    expect(mockUseSyncUserSettings).toHaveBeenCalled();
    expect(mockUseSyncAnalyticsUser).toHaveBeenCalled();
  });

  it("does not call initializeContainer when container is already set", () => {
    mockGetContainerOrNull.mockReturnValue({});

    render(<AppInitializer />);

    expect(mockInitializeContainer).not.toHaveBeenCalled();
    expect(mockUseSyncAuthState).toHaveBeenCalled();
    expect(mockUseSyncUserSettings).toHaveBeenCalled();
    expect(mockUseSyncAnalyticsUser).toHaveBeenCalled();
  });
});
