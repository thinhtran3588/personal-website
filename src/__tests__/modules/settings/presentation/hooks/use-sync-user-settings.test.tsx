import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";
import { useSyncUserSettings } from "@/modules/settings/presentation/hooks/use-sync-user-settings";
import { useUserSettingsStore } from "@/modules/settings/presentation/hooks/use-user-settings-store";

let mockResolve: (key: string) => unknown;
vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => ({
    resolve: (key: string) => mockResolve(key),
  }),
}));

function SyncConsumer() {
  useSyncUserSettings();
  return null;
}

describe("useSyncUserSettings", () => {
  beforeEach(() => {
    useUserSettingsStore.setState({ settings: {} });
    useAuthUserStore.setState({ user: null, loading: false });
    vi.clearAllMocks();
    mockResolve = vi.fn();
  });

  it("does not update store when use case returns success false", async () => {
    useUserSettingsStore.setState({ settings: { locale: "en" } });
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return {
          execute: () =>
            Promise.resolve({ success: false, error: "unavailable" }),
        };
      }
      return undefined;
    };

    render(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(useUserSettingsStore.getState().settings).toEqual({
        locale: "en",
      });
    });
  });

  it("loads settings and updates store when use case resolves", async () => {
    const settings = { locale: "vi", theme: "dark" };
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return {
          execute: () => Promise.resolve({ success: true, data: settings }),
        };
      }
      return undefined;
    };

    render(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(useUserSettingsStore.getState().settings).toEqual(settings);
    });
  });

  it("calls load with userId when user is signed in", async () => {
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
    const execute = vi.fn().mockResolvedValue({ success: true, data: null });
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return { execute };
      }
      return undefined;
    };

    render(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(execute).toHaveBeenCalledWith({ userId: "uid-1" });
    });
  });

  it("calls load with null userId when user is not signed in", async () => {
    const execute = vi.fn().mockResolvedValue({ success: true, data: null });
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return { execute };
      }
      return undefined;
    };

    render(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(execute).toHaveBeenCalledWith({ userId: null });
    });
  });

  it("does not load settings from Firestore while auth is still loading", () => {
    useAuthUserStore.setState({ user: null, loading: true });
    const execute = vi.fn().mockResolvedValue({ success: true, data: null });
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return { execute };
      }
      return undefined;
    };

    render(<SyncConsumer />);

    expect(execute).not.toHaveBeenCalled();
  });

  it("updates store with theme when remote settings include theme", async () => {
    const settings = { locale: "en", theme: "dark" as const };
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return {
          execute: () => Promise.resolve({ success: true, data: settings }),
        };
      }
      return undefined;
    };

    render(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(useUserSettingsStore.getState().settings).toEqual(settings);
    });
  });

  it("updates store with local only when remote is null", async () => {
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
    useUserSettingsStore.setState({ settings: { locale: "en" } });
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return {
          execute: () => Promise.resolve({ success: true, data: null }),
        };
      }
      return undefined;
    };

    render(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(useUserSettingsStore.getState().settings).toEqual({
        locale: "en",
      });
    });
  });

  it("does not call load again when user signs out after initial load", async () => {
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
    const execute = vi.fn().mockResolvedValue({ success: true, data: null });
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return { execute };
      }
      return undefined;
    };

    const { rerender } = render(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(execute).toHaveBeenCalledWith({ userId: "uid-1" });
    });

    act(() => {
      useAuthUserStore.setState({ user: null, loading: false });
    });
    rerender(<SyncConsumer />);

    expect(execute).toHaveBeenCalledTimes(1);
  });

  it("calls load again when user signs in after initial load", async () => {
    const execute = vi.fn().mockResolvedValue({ success: true, data: null });
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return { execute };
      }
      return undefined;
    };

    const { rerender } = render(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(execute).toHaveBeenCalledWith({ userId: null });
    });

    const callCountAfterInitial = execute.mock.calls.length;

    act(() => {
      useAuthUserStore.setState({
        user: {
          id: "uid-2",
          email: "b@c.com",
          displayName: "Bob",
          photoURL: null,
          authType: "email",
        },
        loading: false,
      });
    });
    rerender(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(execute).toHaveBeenCalledWith({ userId: "uid-2" });
    });
    expect(execute.mock.calls.length).toBeGreaterThan(callCountAfterInitial);
  });
});
