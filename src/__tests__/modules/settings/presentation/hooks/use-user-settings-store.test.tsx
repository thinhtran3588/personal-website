import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";
import {
  useUserSettings,
  useUserSettingsStore,
} from "@/modules/settings/presentation/hooks/use-user-settings-store";

let mockResolve: (key: string) => unknown;
const mockExecute = vi.fn();
const mockToastError = vi.fn();
vi.mock("sonner", () => ({
  toast: { error: (message: string) => mockToastError(message) },
}));
vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => ({
    resolve: (key: string) => mockResolve(key),
  }),
}));

describe("useUserSettingsStore", () => {
  beforeEach(() => {
    useUserSettingsStore.setState({ settings: {} });
    localStorage.clear();
  });

  it("has initial empty settings", () => {
    expect(useUserSettingsStore.getState().settings).toEqual({});
  });

  it("setSettings updates settings", () => {
    useUserSettingsStore.getState().setSettings({
      locale: "en",
      theme: "dark",
    });
    expect(useUserSettingsStore.getState().settings).toEqual({
      locale: "en",
      theme: "dark",
    });
    useUserSettingsStore.getState().setSettings({});
    expect(useUserSettingsStore.getState().settings).toEqual({});
  });
});

describe("useUserSettings", () => {
  beforeEach(() => {
    useUserSettingsStore.setState({ settings: {} });
    useAuthUserStore.setState({ user: null, loading: false });
    mockExecute.mockReset().mockResolvedValue({ success: true });
    mockToastError.mockClear();
    mockResolve = (key: string) => {
      if (key === "saveUserSettingsUseCase") {
        return { execute: mockExecute };
      }
      return undefined;
    };
  });

  it("persistLocale updates store but does not call save use case when user is null", async () => {
    const { result } = renderHook(() => useUserSettings());

    await act(async () => {
      result.current.persistLocale("vi");
    });

    expect(useUserSettingsStore.getState().settings.locale).toBe("vi");
    expect(mockExecute).not.toHaveBeenCalled();
  });

  it("persistTheme updates store but does not call save use case when user is null", async () => {
    const { result } = renderHook(() => useUserSettings());

    await act(async () => {
      result.current.persistTheme("dark");
    });

    expect(useUserSettingsStore.getState().settings.theme).toBe("dark");
    expect(mockExecute).not.toHaveBeenCalled();
  });

  it("persistLocale passes userId when user is signed in", async () => {
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

    const { result } = renderHook(() => useUserSettings());

    await act(async () => {
      result.current.persistLocale("zh");
    });

    expect(mockExecute).toHaveBeenCalledWith({
      userId: "uid-1",
      settings: { locale: "zh" },
    });
  });

  it("persistTheme does nothing when theme is undefined", async () => {
    const { result } = renderHook(() => useUserSettings());

    await act(async () => {
      result.current.persistTheme(undefined);
    });

    expect(mockExecute).not.toHaveBeenCalled();
  });

  it("persistTheme passes userId when user is signed in", async () => {
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

    const { result } = renderHook(() => useUserSettings());

    await act(async () => {
      result.current.persistTheme("light");
    });

    expect(mockExecute).toHaveBeenCalledWith({
      userId: "uid-1",
      settings: { theme: "light" },
    });
  });

  it("shows toast error when save use case returns success false for persistLocale", async () => {
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
    mockExecute.mockResolvedValue({ success: false });

    const { result } = renderHook(() => useUserSettings());

    await act(async () => {
      result.current.persistLocale("vi");
    });

    await act(async () => {});

    expect(mockToastError).toHaveBeenCalled();
  });

  it("shows toast error when save use case returns success false for persistTheme", async () => {
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
    mockExecute.mockResolvedValue({ success: false });

    const { result } = renderHook(() => useUserSettings());

    await act(async () => {
      result.current.persistTheme("dark");
    });

    await act(async () => {});

    expect(mockToastError).toHaveBeenCalled();
  });
});
