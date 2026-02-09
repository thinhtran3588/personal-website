import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { initializeContainer } from "@/application/register-container";
import { useContainer } from "@/common/hooks/use-container";
import { getContainer } from "@/common/utils/container";

function Consumer() {
  const container = useContainer();
  const isSame = container === getContainer();
  const hasAuth = container.resolve("authService") !== undefined;
  return (
    <span data-testid="result">{isSame && hasAuth ? "ok" : "missing"}</span>
  );
}

describe("useContainer", () => {
  beforeEach(() => {
    initializeContainer();
  });

  it("returns the same container as getContainer() and can resolve dependencies", () => {
    const { getByTestId } = render(<Consumer />);
    expect(getByTestId("result").textContent).toBe("ok");
  });
});
