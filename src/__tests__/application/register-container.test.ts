import { beforeEach, describe, expect, it } from "vitest";

import { initializeContainer } from "@/application/register-container";
import { getContainer, getContainerOrNull } from "@/common/utils/container";

describe("register-container", () => {
  beforeEach(() => {
    initializeContainer();
  });

  it("getContainerOrNull returns container after initializeContainer", () => {
    expect(getContainerOrNull()).not.toBeNull();
  });

  it("returns the same container instance on subsequent calls", () => {
    const a = getContainer();
    const b = getContainer();
    expect(a).toBe(b);
  });
});
