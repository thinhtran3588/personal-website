import { render, screen } from "@testing-library/react";

import { SimplePage } from "@/common/components/simple-page";

describe("SimplePage", () => {
  it("renders title and CTA with default href", () => {
    render(<SimplePage title="Page Title" ctaLabel="Go home" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Page Title" }),
    ).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Go home" });
    expect(link).toHaveAttribute("href", "/");
  });

  it("uses custom href when provided", () => {
    render(<SimplePage title="Done" href="/dashboard" ctaLabel="Dashboard" />);
    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link).toHaveAttribute("href", "/dashboard");
  });
});
