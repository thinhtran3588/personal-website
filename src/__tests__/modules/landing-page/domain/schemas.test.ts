import { describe, expect, it } from "vitest";

import { createContactFormSchema } from "@/modules/landing-page/domain/schemas";

const t = (key: string) => key;

describe("createContactFormSchema", () => {
  it("accepts valid contact form data", () => {
    const schema = createContactFormSchema(t);
    const result = schema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      subject: "Inquiry",
      message: "Hello, I have a question.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const schema = createContactFormSchema(t);
    const result = schema.safeParse({
      name: "",
      email: "alice@example.com",
      subject: "Inquiry",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name over 200 characters", () => {
    const schema = createContactFormSchema(t);
    const result = schema.safeParse({
      name: "a".repeat(201),
      email: "alice@example.com",
      subject: "Inquiry",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const schema = createContactFormSchema(t);
    const result = schema.safeParse({
      name: "Alice",
      email: "not-an-email",
      subject: "Inquiry",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty subject", () => {
    const schema = createContactFormSchema(t);
    const result = schema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      subject: "",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects subject over 200 characters", () => {
    const schema = createContactFormSchema(t);
    const result = schema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      subject: "a".repeat(201),
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty message", () => {
    const schema = createContactFormSchema(t);
    const result = schema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      subject: "Inquiry",
      message: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects message over 2000 characters", () => {
    const schema = createContactFormSchema(t);
    const result = schema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      subject: "Inquiry",
      message: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});
