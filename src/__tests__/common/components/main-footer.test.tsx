import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MainFooter } from "@/common/components/main-footer";

describe("MainFooter", () => {
  it("renders copyright text", () => {
    render(<MainFooter copyright="© 2026 Test. All rights reserved." />);

    expect(
      screen.getByText("© 2026 Test. All rights reserved."),
    ).toBeInTheDocument();
  });

  it("renders footer element", () => {
    render(<MainFooter copyright="© 2026 Test. All rights reserved." />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
