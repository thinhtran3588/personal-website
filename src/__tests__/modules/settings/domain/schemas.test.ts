import { describe, expect, it } from "vitest";

import { userSettingsSchema } from "@/modules/settings/domain/schemas";

describe("userSettingsSchema", () => {
  it("accepts valid settings with all fields", () => {
    const result = userSettingsSchema.safeParse({
      locale: "en",
      theme: "dark",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = userSettingsSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts partial settings", () => {
    const result = userSettingsSchema.safeParse({ theme: "light" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid theme", () => {
    const result = userSettingsSchema.safeParse({ theme: "invalid" });
    expect(result.success).toBe(false);
  });
});
