import { describe, expect, it } from "vitest";

import {
  getForgotPasswordSchema,
  getProfileSchema,
  getSignInSchema,
  getSignUpSchema,
  getUpdatePasswordSchema,
  profileSchema,
} from "@/modules/auth/domain/schemas";

const t = (key: string) => key;

describe("getSignInSchema", () => {
  it("accepts valid email and password", () => {
    const schema = getSignInSchema(t);
    const result = schema.safeParse({
      email: "a@b.com",
      password: "short",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const schema = getSignInSchema(t);
    const result = schema.safeParse({
      email: "invalid",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const schema = getSignInSchema(t);
    const result = schema.safeParse({
      email: "a@b.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password over 20 chars", () => {
    const schema = getSignInSchema(t);
    const result = schema.safeParse({
      email: "a@b.com",
      password: "a".repeat(21),
    });
    expect(result.success).toBe(false);
  });
});

describe("getSignUpSchema", () => {
  it("accepts valid input when password and confirmPassword match", () => {
    const schema = getSignUpSchema(t);
    const result = schema.safeParse({
      email: "a@b.com",
      password: "ValidPass1!",
      confirmPassword: "ValidPass1!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects when password and confirmPassword do not match", () => {
    const schema = getSignUpSchema(t);
    const result = schema.safeParse({
      email: "a@b.com",
      password: "ValidPass1!",
      confirmPassword: "OtherPass1!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects weak password (no uppercase)", () => {
    const schema = getSignUpSchema(t);
    const result = schema.safeParse({
      email: "a@b.com",
      password: "validpass1!",
      confirmPassword: "validpass1!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 chars", () => {
    const schema = getSignUpSchema(t);
    const result = schema.safeParse({
      email: "a@b.com",
      password: "Ab1!",
      confirmPassword: "Ab1!",
    });
    expect(result.success).toBe(false);
  });
});

describe("getForgotPasswordSchema", () => {
  it("accepts valid email", () => {
    const schema = getForgotPasswordSchema(t);
    const result = schema.safeParse({ email: "a@b.com" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const schema = getForgotPasswordSchema(t);
    const result = schema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
  });
});

describe("profileSchema", () => {
  it("accepts optional displayName", () => {
    const result = profileSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts displayName within max length", () => {
    const result = profileSchema.safeParse({
      displayName: "Alice",
    });
    expect(result.success).toBe(true);
  });

  it("rejects displayName over 200 chars", () => {
    const result = profileSchema.safeParse({
      displayName: "a".repeat(201),
    });
    expect(result.success).toBe(false);
  });
});

describe("getProfileSchema", () => {
  it("accepts optional displayName", () => {
    const schema = getProfileSchema(t);
    const result = schema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe("getUpdatePasswordSchema", () => {
  it("accepts valid input when new and confirm match", () => {
    const schema = getUpdatePasswordSchema(t);
    const result = schema.safeParse({
      oldPassword: "old",
      newPassword: "NewValid1!",
      confirmPassword: "NewValid1!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects when newPassword and confirmPassword do not match", () => {
    const schema = getUpdatePasswordSchema(t);
    const result = schema.safeParse({
      oldPassword: "old",
      newPassword: "NewValid1!",
      confirmPassword: "OtherNew1!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty oldPassword", () => {
    const schema = getUpdatePasswordSchema(t);
    const result = schema.safeParse({
      oldPassword: "",
      newPassword: "NewValid1!",
      confirmPassword: "NewValid1!",
    });
    expect(result.success).toBe(false);
  });
});
