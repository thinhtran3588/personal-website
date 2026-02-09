import { beforeEach, describe, expect, it } from "vitest";

import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";

describe("useAuthUserStore", () => {
  beforeEach(() => {
    useAuthUserStore.setState({ user: null, loading: true });
  });

  it("has initial user null and loading true", () => {
    expect(useAuthUserStore.getState().user).toBeNull();
    expect(useAuthUserStore.getState().loading).toBe(true);
  });

  it("setAuthState updates user and loading", () => {
    const user = {
      id: "1",
      email: "a@b.com",
      displayName: "Alice",
      photoURL: null,
      authType: "email" as const,
    };

    useAuthUserStore.getState().setAuthState(user, false);

    expect(useAuthUserStore.getState().user).toEqual(user);
    expect(useAuthUserStore.getState().loading).toBe(false);
  });

  it("setAuthState can set user to null and loading to false", () => {
    useAuthUserStore.getState().setAuthState(null, false);

    expect(useAuthUserStore.getState().user).toBeNull();
    expect(useAuthUserStore.getState().loading).toBe(false);
  });
});
