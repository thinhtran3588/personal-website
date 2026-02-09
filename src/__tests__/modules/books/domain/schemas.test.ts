import { describe, expect, it } from "vitest";

import {
  bookFormSchema,
  bookUpdateSchema,
} from "@/modules/books/domain/schemas";

describe("bookFormSchema", () => {
  it("accepts valid input", () => {
    const result = bookFormSchema.safeParse({
      title: "A Book",
      description: "A description",
      authors: ["Author"],
      genres: [],
      links: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = bookFormSchema.safeParse({
      title: "",
      description: "desc",
      authors: ["Author"],
      genres: [],
      links: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects title over 200 characters", () => {
    const result = bookFormSchema.safeParse({
      title: "a".repeat(201),
      description: "desc",
      authors: ["Author"],
      genres: [],
      links: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty authors", () => {
    const result = bookFormSchema.safeParse({
      title: "Title",
      description: "desc",
      authors: [],
      genres: [],
      links: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("bookUpdateSchema", () => {
  it("accepts partial input", () => {
    const result = bookUpdateSchema.safeParse({ title: "New Title" });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = bookUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});
