import { render, screen } from "@testing-library/react";

import { BackToHomeButton } from "@/common/components/back-to-home-button";

describe("BackToHomeButton", () => {
  it("renders back to home link with correct href", () => {
    render(<BackToHomeButton />);
    const link = screen.getByRole("link", { name: /back to home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders with secondary button styling via asChild", () => {
    render(<BackToHomeButton />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("data-slot", "button");
  });
});
