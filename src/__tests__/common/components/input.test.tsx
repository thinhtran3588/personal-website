import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Input } from "@/common/components/input";

describe("Input (common/components)", () => {
  it("renders a text input", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("forwards ref to the input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("shows password toggle when type is password", () => {
    render(<Input type="password" aria-label="Password" />);
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByLabelText("Show password"));
    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(screen.getByLabelText("Hide password"));
    expect(input).toHaveAttribute("type", "password");
  });
});
