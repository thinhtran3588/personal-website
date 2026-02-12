import { describe, expect, it, vi } from "vitest";

import { getWindowHost } from "@/common/utils/browser";

describe("getWindowHost", () => {
  it("returns host when window is defined", () => {
    // In JSDOM window is defined
    expect(getWindowHost()).toBeTruthy();
  });

  it("returns empty string when window is undefined", () => {
    vi.stubGlobal("window", undefined);
    expect(getWindowHost()).toBe("");
    vi.unstubAllGlobals();
  });
});
