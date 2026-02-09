import { describe, expect, it } from "vitest";

import { cn } from "@/common/utils/cn";

describe("cn", () => {
  it("merges single class string", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("merges multiple class strings", () => {
    expect(cn("foo", "bar")).toContain("foo");
    expect(cn("foo", "bar")).toContain("bar");
  });

  it("handles tailwind merge for conflicting classes", () => {
    const result = cn("p-4", "p-2");
    expect(result).toBe("p-2");
  });

  it("handles undefined and false", () => {
    expect(cn("foo", undefined, false, "bar")).toContain("foo");
    expect(cn("foo", undefined, false, "bar")).toContain("bar");
  });

  it("handles conditional object", () => {
    expect(cn({ foo: true, bar: false })).toContain("foo");
    expect(cn({ foo: true, bar: false })).not.toContain("bar");
  });
});
