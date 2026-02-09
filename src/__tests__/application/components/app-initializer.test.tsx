import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppInitializer } from "@/application/components/app-initializer";

const [mockInitializeContainer, mockGetContainerOrNull] = vi.hoisted(() => [
  vi.fn(),
  vi.fn(),
]);

vi.mock("@/application/register-container", () => ({
  initializeContainer: mockInitializeContainer,
}));

vi.mock("@/common/utils/container", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/common/utils/container")>();
  return {
    ...mod,
    getContainerOrNull: (...args: unknown[]) => mockGetContainerOrNull(...args),
  };
});

describe("AppInitializer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls initializeContainer when container is null", () => {
    mockGetContainerOrNull.mockReturnValue(null);

    render(<AppInitializer />);

    expect(mockInitializeContainer).toHaveBeenCalledTimes(1);
  });

  it("does not call initializeContainer when container is already set", () => {
    mockGetContainerOrNull.mockReturnValue({});

    render(<AppInitializer />);

    expect(mockInitializeContainer).not.toHaveBeenCalled();
  });
});
