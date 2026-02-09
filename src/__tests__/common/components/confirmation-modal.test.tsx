import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ConfirmationModal } from "@/common/components/confirmation-modal";

describe("ConfirmationModal", () => {
  it("renders when open with title and description", () => {
    render(
      <ConfirmationModal
        open
        onOpenChange={() => {}}
        title="Confirm Title"
        description="Confirm Description"
        onConfirm={() => {}}
      />,
    );

    expect(
      screen.getByRole("dialog", { name: "Confirm Title" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Confirm Description")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmationModal
        open
        onOpenChange={() => {}}
        title="Confirm"
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onOpenChange with false when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <ConfirmationModal
        open
        onOpenChange={onOpenChange}
        title="Confirm"
        onConfirm={() => {}}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onCancel when provided and cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <ConfirmationModal
        open
        onOpenChange={() => {}}
        title="Confirm"
        onConfirm={() => {}}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("renders custom button texts", () => {
    render(
      <ConfirmationModal
        open
        onOpenChange={() => {}}
        title="Confirm"
        onConfirm={() => {}}
        confirmText="Yes, do it"
        cancelText="No, wait"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Yes, do it" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "No, wait" }),
    ).toBeInTheDocument();
  });
});
