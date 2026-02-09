import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ButtonGroup } from "@/common/components/button-group";

describe("ButtonGroup", () => {
  it("renders children", () => {
    render(
      <ButtonGroup>
        <button type="button">Save</button>
        <button type="button">Cancel</button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("applies justify-end class when justifyEnd is true", () => {
    const { container } = render(
      <ButtonGroup justifyEnd>
        <button type="button">Done</button>
      </ButtonGroup>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("justify-end");
  });

  it("does not apply justify-end when justifyEnd is false", () => {
    const { container } = render(
      <ButtonGroup>
        <button type="button">Done</button>
      </ButtonGroup>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toHaveClass("justify-end");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ButtonGroup className="custom-class">
        <button type="button">Done</button>
      </ButtonGroup>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-class");
  });
});
