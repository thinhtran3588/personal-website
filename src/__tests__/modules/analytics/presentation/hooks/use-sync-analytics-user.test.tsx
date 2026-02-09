import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSyncAnalyticsUser } from "@/modules/analytics/presentation/hooks/use-sync-analytics-user";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";

const mockExecute = vi.fn();
let mockResolve: (key: string) => unknown;

vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => ({
    resolve: (key: string) => mockResolve(key),
  }),
}));

function SyncConsumer() {
  useSyncAnalyticsUser();
  return null;
}

describe("useSyncAnalyticsUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecute.mockClear();
    useAuthUserStore.setState({ user: null, loading: true });
    mockResolve = (key: string) => {
      if (key === "setAnalyticsUserUseCase") {
        return { execute: mockExecute };
      }
      return undefined;
    };
  });

  it("sets analytics user ID when user is signed in", () => {
    useAuthUserStore.setState({
      user: {
        id: "uid-1",
        email: "a@b.com",
        displayName: "Alice",
        photoURL: null,
        authType: "email",
      },
      loading: false,
    });

    render(<SyncConsumer />);

    expect(mockExecute).toHaveBeenCalledWith({ userId: "uid-1" });
  });

  it("sets analytics user ID to null when user is signed out", () => {
    useAuthUserStore.setState({ user: null, loading: false });

    render(<SyncConsumer />);

    expect(mockExecute).toHaveBeenCalledWith({ userId: null });
  });
});
