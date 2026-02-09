import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getResolvedTheme } from "@/common/utils/theme";

describe("getResolvedTheme", () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      value: originalMatchMedia,
      writable: true,
    });
  });

  it("returns light when theme is light", () => {
    expect(getResolvedTheme("light")).toBe("light");
  });

  it("returns dark when theme is dark", () => {
    expect(getResolvedTheme("dark")).toBe("dark");
  });

  it("returns light when theme is system and prefers light", () => {
    Object.defineProperty(window, "matchMedia", {
      value: vi.fn((query: string) => ({
        matches: query === "(prefers-color-scheme: light)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
      writable: true,
    });
    expect(getResolvedTheme("system")).toBe("light");
  });

  it("returns dark when theme is system and prefers dark", () => {
    Object.defineProperty(window, "matchMedia", {
      value: vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
      writable: true,
    });
    expect(getResolvedTheme("system")).toBe("dark");
  });

  it("returns dark when window is undefined (SSR)", () => {
    const win = globalThis.window;
    Object.defineProperty(globalThis, "window", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    expect(getResolvedTheme("system")).toBe("dark");
    Object.defineProperty(globalThis, "window", {
      value: win,
      writable: true,
      configurable: true,
    });
  });
});
