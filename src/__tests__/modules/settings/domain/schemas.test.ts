import { describe, expect, it } from "vitest";

import { userSettingsSchema } from "@/modules/settings/domain/schemas";

describe("userSettingsSchema", () => {
  it("accepts empty object", () => {
    expect(userSettingsSchema.parse({})).toEqual({});
  });

  it("accepts locale and theme", () => {
    expect(userSettingsSchema.parse({ locale: "en", theme: "dark" })).toEqual({
      locale: "en",
      theme: "dark",
    });
  });

  it("accepts valid theme values", () => {
    expect(userSettingsSchema.parse({ theme: "light" }).theme).toBe("light");
    expect(userSettingsSchema.parse({ theme: "system" }).theme).toBe("system");
  });

  it("rejects invalid theme", () => {
    expect(() => userSettingsSchema.parse({ theme: "invalid" })).toThrow();
  });
});
