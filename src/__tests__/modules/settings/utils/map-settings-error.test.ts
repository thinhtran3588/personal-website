import { describe, expect, it } from "vitest";

import { mapSettingsError } from "@/modules/settings/utils/map-settings-error";

describe("mapSettingsError", () => {
  it("returns unavailable for Error with permission in message", () => {
    expect(mapSettingsError(new Error("permission denied"))).toBe(
      "unavailable",
    );
  });

  it("returns unavailable for Error with unavailable in message", () => {
    expect(mapSettingsError(new Error("unavailable"))).toBe("unavailable");
  });

  it("returns unavailable for Error with network in message", () => {
    expect(mapSettingsError(new Error("network unavailable"))).toBe(
      "unavailable",
    );
  });

  it("returns unavailable for Error with only network in message", () => {
    expect(mapSettingsError(new Error("network error"))).toBe("unavailable");
  });

  it("returns unavailable for Error with failed to fetch in message", () => {
    expect(mapSettingsError(new Error("failed to fetch"))).toBe("unavailable");
  });

  it("returns generic for Error with unknown message", () => {
    expect(mapSettingsError(new Error("something went wrong"))).toBe("generic");
  });

  it("returns generic when err is not an Error instance", () => {
    expect(mapSettingsError("string error")).toBe("generic");
    expect(mapSettingsError(null)).toBe("generic");
  });

  it("returns generic for Error with empty message", () => {
    expect(mapSettingsError(new Error())).toBe("generic");
  });

  it("returns generic for Error-like object with undefined message", () => {
    const err = Object.create(Error.prototype);
    expect(mapSettingsError(err)).toBe("generic");
  });

  it("handles Error with message undefined via nullish coalescing", () => {
    const err = new Error();
    Object.defineProperty(err, "message", {
      value: undefined,
      configurable: true,
    });
    expect(mapSettingsError(err)).toBe("generic");
  });
});
