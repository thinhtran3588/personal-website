import { describe, expect, it } from "vitest";

import { mapAuthErrorCode } from "@/modules/auth/utils/map-auth-error";

describe("mapAuthErrorCode", () => {
  it("maps auth/invalid-credential to invalid-credentials", () => {
    expect(mapAuthErrorCode("auth/invalid-credential")).toBe(
      "invalid-credentials",
    );
  });

  it("maps auth/user-not-found to invalid-credentials", () => {
    expect(mapAuthErrorCode("auth/user-not-found")).toBe("invalid-credentials");
  });

  it("maps auth/wrong-password to invalid-credentials", () => {
    expect(mapAuthErrorCode("auth/wrong-password")).toBe("invalid-credentials");
  });

  it("maps auth/too-many-requests to too-many-requests", () => {
    expect(mapAuthErrorCode("auth/too-many-requests")).toBe(
      "too-many-requests",
    );
  });

  it("maps auth/email-already-in-use to email-already-in-use", () => {
    expect(mapAuthErrorCode("auth/email-already-in-use")).toBe(
      "email-already-in-use",
    );
  });

  it("maps auth/requires-recent-login to requires-recent-login", () => {
    expect(mapAuthErrorCode("auth/requires-recent-login")).toBe(
      "requires-recent-login",
    );
  });

  it("returns generic for unknown code", () => {
    expect(mapAuthErrorCode("auth/other")).toBe("generic");
  });

  it("returns generic for undefined", () => {
    expect(mapAuthErrorCode(undefined)).toBe("generic");
  });
});
