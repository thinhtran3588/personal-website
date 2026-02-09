import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import {
  useUserSettings,
  useUserSettingsStore,
} from "@/modules/settings/presentation/hooks/use-user-settings-store";

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
  });

  it("persistLocale updates store with new locale", () => {
    const { result } = renderHook(() => useUserSettings());

    act(() => {
      result.current.persistLocale("vi");
    });

    expect(useUserSettingsStore.getState().settings.locale).toBe("vi");
  });

  it("persistTheme updates store with new theme", () => {
    const { result } = renderHook(() => useUserSettings());

    act(() => {
      result.current.persistTheme("dark");
    });

    expect(useUserSettingsStore.getState().settings.theme).toBe("dark");
  });

  it("persistTheme does nothing when theme is undefined", () => {
    useUserSettingsStore.setState({ settings: { theme: "light" } });
    const { result } = renderHook(() => useUserSettings());

    act(() => {
      result.current.persistTheme(undefined);
    });

    expect(useUserSettingsStore.getState().settings.theme).toBe("light");
  });
});
