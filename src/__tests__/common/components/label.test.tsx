import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import { Label } from "@/common/components/label";

describe("Label", () => {
  it("renders label with text", () => {
    render(<Label>Email</Label>);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("associates with form control via htmlFor", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    );
    const label = screen.getByText("Email");
    expect(label).toHaveAttribute("for", "email");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Label</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it("merges custom className", () => {
    render(<Label className="custom-class">Label</Label>);
    const label = screen.getByText("Label");
    expect(label).toHaveClass("custom-class");
  });
});
