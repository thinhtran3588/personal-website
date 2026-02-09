import { describe, expect, it } from "vitest";

import { normalizeSearchText } from "@/modules/books/utils/normalize-search-text";

describe("normalizeSearchText", () => {
  it("returns empty string for empty or whitespace input", () => {
    expect(normalizeSearchText("")).toBe("");
    expect(normalizeSearchText("   ")).toBe("");
  });

  it("lowercases the text", () => {
    expect(normalizeSearchText("Hello")).toBe("hello");
    expect(normalizeSearchText("TITLE")).toBe("title");
  });

  it("removes diacritics / tone marks", () => {
    expect(normalizeSearchText("Café")).toBe("cafe");
    expect(normalizeSearchText("Zürich")).toBe("zurich");
    expect(normalizeSearchText("Naïve")).toBe("naive");
    expect(normalizeSearchText("Müller")).toBe("muller");
    expect(normalizeSearchText("São Paulo")).toBe("sao paulo");
  });

  it("trims whitespace before normalizing", () => {
    expect(normalizeSearchText("  foo  ")).toBe("foo");
  });

  it("truncates to maxLength when provided", () => {
    const long = "a".repeat(600);
    expect(normalizeSearchText(long, 500)).toHaveLength(500);
    expect(normalizeSearchText(long, 500)).toBe("a".repeat(500));
  });

  it("uses default max length of 500 when not provided", () => {
    const long = "b".repeat(600);
    expect(normalizeSearchText(long)).toHaveLength(500);
  });

  it("does not truncate when under maxLength", () => {
    const short = "hello";
    expect(normalizeSearchText(short, 10)).toBe("hello");
  });
});
