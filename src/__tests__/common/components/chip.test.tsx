import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Chip } from "@/common/components/chip";

describe("Chip", () => {
  it("renders string children", () => {
    render(<Chip>Tag</Chip>);
    expect(screen.getByText("Tag")).toBeInTheDocument();
  });

  it("renders remove button with aria-label from string children when onRemove is provided", () => {
    render(<Chip onRemove={vi.fn()}>mytag</Chip>);
    expect(
      screen.getByRole("button", { name: "Remove mytag" }),
    ).toBeInTheDocument();
  });

  it("renders remove button with aria-label 'Remove tag' when children is not a string", () => {
    render(
      <Chip onRemove={vi.fn()}>
        <span>Custom</span>
      </Chip>,
    );
    expect(
      screen.getByRole("button", { name: "Remove tag" }),
    ).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>x</Chip>);
    await user.click(screen.getByRole("button", { name: "Remove x" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("disables remove button when disabled is true", () => {
    render(
      <Chip onRemove={vi.fn()} disabled>
        y
      </Chip>,
    );
    expect(screen.getByRole("button", { name: "Remove y" })).toBeDisabled();
  });

  it("does not render remove button when onRemove is not provided", () => {
    render(<Chip>solo</Chip>);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
