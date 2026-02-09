import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DialogClose, Modal } from "@/common/components/modal";

describe("Modal", () => {
  it("renders when open with title and children", () => {
    render(
      <Modal open onOpenChange={() => {}} title="Modal title">
        <p>Modal body</p>
      </Modal>,
    );

    expect(
      screen.getByRole("dialog", { name: "Modal title" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Modal body")).toBeInTheDocument();
  });

  it("does not render dialog when closed", () => {
    render(
      <Modal open={false} onOpenChange={() => {}} title="Modal title">
        <p>Modal body</p>
      </Modal>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onOpenChange with false when dialog is closed via overlay or escape", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} title="Title">
        <p>Content</p>
      </Modal>,
    );

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders optional description when provided", () => {
    render(
      <Modal
        open
        onOpenChange={() => {}}
        title="Title"
        description="Optional description"
      >
        <p>Body</p>
      </Modal>,
    );

    expect(screen.getByRole("dialog", { name: "Title" })).toBeInTheDocument();
    expect(screen.getByText("Optional description")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("DialogClose inside modal content closes and calls onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} title="Title">
        <DialogClose asChild>
          <button type="button">Cancel</button>
        </DialogClose>
      </Modal>,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
