import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ChangePasswordModal } from "@/modules/auth/presentation/pages/profile/components/change-password-modal";

const mockUpdatePasswordExecute = vi.fn();
const mockLogEventExecute = vi.fn();

vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => ({
    resolve: (name: string) =>
      name === "updatePasswordUseCase"
        ? { execute: mockUpdatePasswordExecute }
        : name === "logEventUseCase"
          ? { execute: mockLogEventExecute }
          : {},
  }),
}));

describe("ChangePasswordModal", () => {
  const mockOnOpenChange = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    mockUpdatePasswordExecute.mockClear();
    mockLogEventExecute.mockClear();
    mockOnOpenChange.mockClear();
    mockOnSuccess.mockClear();
  });

  it("renders modal with password form when open", () => {
    render(
      <ChangePasswordModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Update password" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Current password")).toBeInTheDocument();
    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm new password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Update password$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Cancel$/i }),
    ).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <ChangePasswordModal
        open={false}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />,
    );

    expect(
      screen.queryByRole("heading", { name: "Update password" }),
    ).not.toBeInTheDocument();
  });

  it("calls updatePasswordUseCase and onSuccess when form is submitted successfully", async () => {
    const user = userEvent.setup();
    mockUpdatePasswordExecute.mockResolvedValue({ success: true });

    render(
      <ChangePasswordModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />,
    );

    await user.type(screen.getByLabelText("Current password"), "OldPass1!");
    await user.type(screen.getByLabelText("New password"), "NewPass1!");
    await user.type(screen.getByLabelText("Confirm new password"), "NewPass1!");
    await user.click(
      screen.getByRole("button", { name: /^Update password$/i }),
    );

    await waitFor(() => {
      expect(mockUpdatePasswordExecute).toHaveBeenCalledWith({
        oldPassword: "OldPass1!",
        newPassword: "NewPass1!",
      });
    });
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("shows error when password update fails", async () => {
    const user = userEvent.setup();
    mockUpdatePasswordExecute.mockResolvedValue({
      success: false,
      error: "invalid-credentials",
    });

    render(
      <ChangePasswordModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />,
    );

    await user.type(screen.getByLabelText("Current password"), "WrongPass1!");
    await user.type(screen.getByLabelText("New password"), "NewPass1!");
    await user.type(screen.getByLabelText("Confirm new password"), "NewPass1!");
    await user.click(
      screen.getByRole("button", { name: /^Update password$/i }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("resets form and clears error when modal is closed via overlay", async () => {
    const user = userEvent.setup();
    mockUpdatePasswordExecute.mockResolvedValue({
      success: false,
      error: "invalid-credentials",
    });

    render(
      <ChangePasswordModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />,
    );

    await user.type(screen.getByLabelText("Current password"), "WrongPass1!");
    await user.type(screen.getByLabelText("New password"), "NewPass1!");
    await user.type(screen.getByLabelText("Confirm new password"), "NewPass1!");
    await user.click(
      screen.getByRole("button", { name: /^Update password$/i }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("dialog-overlay"));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("works without onSuccess callback", async () => {
    const user = userEvent.setup();
    mockUpdatePasswordExecute.mockResolvedValue({ success: true });

    render(<ChangePasswordModal open={true} onOpenChange={mockOnOpenChange} />);

    await user.type(screen.getByLabelText("Current password"), "OldPass1!");
    await user.type(screen.getByLabelText("New password"), "NewPass1!");
    await user.type(screen.getByLabelText("Confirm new password"), "NewPass1!");
    await user.click(
      screen.getByRole("button", { name: /^Update password$/i }),
    );

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("shows validation errors for invalid input", async () => {
    const user = userEvent.setup();

    render(
      <ChangePasswordModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /^Update password$/i }),
    );

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });
    expect(mockUpdatePasswordExecute).not.toHaveBeenCalled();
  });

  it("shows error when passwords do not match", async () => {
    const user = userEvent.setup();

    render(
      <ChangePasswordModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />,
    );

    await user.type(screen.getByLabelText("Current password"), "OldPass1!");
    await user.type(screen.getByLabelText("New password"), "NewPass1!");
    await user.type(
      screen.getByLabelText("Confirm new password"),
      "DifferentPass1!",
    );
    await user.click(
      screen.getByRole("button", { name: /^Update password$/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/match/i)).toBeInTheDocument();
    });
    expect(mockUpdatePasswordExecute).not.toHaveBeenCalled();
  });
});
