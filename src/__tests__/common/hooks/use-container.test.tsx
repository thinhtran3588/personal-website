import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { initializeContainer } from "@/application/register-container";
import { useContainer } from "@/common/hooks/use-container";
import { getContainer } from "@/common/utils/container";

function Consumer() {
  const container = useContainer();
  const isSame = container === getContainer();
  return <span data-testid="result">{isSame ? "ok" : "missing"}</span>;
}

describe("useContainer", () => {
  beforeEach(() => {
    initializeContainer();
  });

  it("returns the same container as getContainer()", () => {
    const { getByTestId } = render(<Consumer />);
    expect(getByTestId("result").textContent).toBe("ok");
  });
});
