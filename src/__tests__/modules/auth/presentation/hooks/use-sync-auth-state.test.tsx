import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AuthUser } from "@/modules/auth/domain/types";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";
import { useSyncAuthState } from "@/modules/auth/presentation/hooks/use-sync-auth-state";

let mockResolve: (key: string) => unknown;
vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => ({
    resolve: (key: string) => mockResolve(key),
  }),
}));

function SyncConsumer() {
  useSyncAuthState();
  return null;
}

describe("useSyncAuthState", () => {
  beforeEach(() => {
    useAuthUserStore.setState({ user: null, loading: true });
    vi.clearAllMocks();
    mockResolve = vi.fn();
  });

  it("subscribes to auth state and updates store when callback fires", () => {
    let callback: (user: AuthUser | null) => void = () => {};
    mockResolve = (key: string) => {
      if (key === "getAuthStateSubscriptionUseCase") {
        return {
          execute: () => ({
            subscribe: (cb: typeof callback) => {
              callback = cb;
              return () => {};
            },
          }),
        };
      }
      return undefined;
    };

    render(<SyncConsumer />);

    expect(useAuthUserStore.getState().loading).toBe(true);

    callback({
      id: "uid-1",
      email: "a@b.com",
      displayName: "Alice",
      photoURL: null,
      authType: "email",
    });

    expect(useAuthUserStore.getState().user).toEqual({
      id: "uid-1",
      email: "a@b.com",
      displayName: "Alice",
      photoURL: null,
      authType: "email",
    });
    expect(useAuthUserStore.getState().loading).toBe(false);
  });

  it("sets user to null when callback receives null", () => {
    let callback: (user: AuthUser | null) => void = () => {};
    mockResolve = (key: string) => {
      if (key === "getAuthStateSubscriptionUseCase") {
        return {
          execute: () => ({
            subscribe: (cb: (user: AuthUser | null) => void) => {
              callback = cb;
              return () => {};
            },
          }),
        };
      }
      return undefined;
    };

    render(<SyncConsumer />);
    callback(null);

    expect(useAuthUserStore.getState().user).toBeNull();
    expect(useAuthUserStore.getState().loading).toBe(false);
  });
});
