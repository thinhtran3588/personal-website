import { describe, expect, it } from "vitest";

import { readDocContent } from "@/common/utils/read-doc";

describe("readDocContent", () => {
  it("returns content for valid slug and locale en", async () => {
    const result = await readDocContent("architecture", "en");
    expect(result).toBeTruthy();
    expect(result).toContain("# ");
  });

  it("returns content for valid slug and locale vi", async () => {
    const result = await readDocContent("architecture", "vi");
    expect(result).toBeTruthy();
    expect(result).toContain("# ");
  });

  it("returns content for valid slug and locale zh", async () => {
    const result = await readDocContent("development-guide", "zh");
    expect(result).toBeTruthy();
    expect(result).toContain("# ");
  });

  it("returns null for non-existent slug", async () => {
    const result = await readDocContent("non-existent", "en");
    expect(result).toBe(null);
  });

  it("returns null for non-existent locale variant", async () => {
    const result = await readDocContent("non-existent", "vi");
    expect(result).toBe(null);
  });
});
