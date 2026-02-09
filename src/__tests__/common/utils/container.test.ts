import { describe, expect, it, vi } from "vitest";

describe("container", () => {
  it("getContainer throws when container not initialized", async () => {
    vi.resetModules();
    const mod = await import("@/common/utils/container");
    expect(() => mod.getContainer()).toThrow("Container not initialized");
  });

  it("getContainerOrNull returns null when container not initialized", async () => {
    vi.resetModules();
    const mod = await import("@/common/utils/container");
    expect(mod.getContainerOrNull()).toBeNull();
  });

  it("setContainer and getContainerOrNull return the set container", async () => {
    vi.resetModules();
    const mod = await import("@/common/utils/container");
    const c = mod.createContainer();
    mod.setContainer(c);
    expect(mod.getContainerOrNull()).toBe(c);
  });

  it("getContainer returns same instance on subsequent calls", async () => {
    vi.resetModules();
    const mod = await import("@/common/utils/container");
    const c = mod.createContainer();
    mod.setContainer(c);
    const a = mod.getContainer();
    const b = mod.getContainer();
    expect(a).toBe(b);
  });
});
