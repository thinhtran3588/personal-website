import { render } from "@testing-library/react";

import { Toaster } from "@/common/components/toaster";

describe("Toaster", () => {
  it("renders without throwing", () => {
    expect(() => render(<Toaster />)).not.toThrow();
  });
});
