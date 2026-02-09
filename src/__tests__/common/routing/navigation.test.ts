import { vi } from "vitest";

vi.mock("next-intl/navigation", () => ({
  createNavigation: vi.fn((routing) => ({
    Link: "LinkComponent",
    redirect: () => `redirect:${routing.defaultLocale}`,
    usePathname: () => "/",
    useRouter: () => ({ push: vi.fn() }),
  })),
}));

describe("navigation", () => {
  it("exports navigation helpers from createNavigation", async () => {
    const { Link, redirect, usePathname, useRouter } =
      await import("../../../common/routing/navigation");

    expect(Link).toBe("LinkComponent");
    expect(typeof redirect).toBe("function");
    expect(usePathname()).toBe("/");
    expect(useRouter()).toEqual({ push: expect.any(Function) });
  });
});
