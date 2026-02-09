import { isSupportedLocale, routing } from "../../../common/routing/routing";

describe("routing", () => {
  it("exposes the default locale", () => {
    expect(routing.defaultLocale).toBe("en");
  });

  it("includes the supported locales", () => {
    expect(routing.locales).toEqual(["en", "vi", "zh"]);
  });

  it("detects supported locales", () => {
    expect(isSupportedLocale("en")).toBe(true);
    expect(isSupportedLocale("vi")).toBe(true);
    expect(isSupportedLocale("fr")).toBe(false);
    expect(isSupportedLocale()).toBe(false);
  });
});
