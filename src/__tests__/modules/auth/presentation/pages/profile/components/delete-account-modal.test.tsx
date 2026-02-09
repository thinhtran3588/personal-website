import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthType } from "@/modules/auth/domain/types";
import { DeleteAccountModal } from "@/modules/auth/presentation/pages/profile/components/delete-account-modal";

const mockDeleteAccountExecute = vi.fn();
const mockLogEventExecute = vi.fn();

vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => ({
    resolve: (name: string) =>
      name === "deleteAccountUseCase"
        ? { execute: mockDeleteAccountExecute }
        : name === "logEventUseCase"
          ? { execute: mockLogEventExecute }
          : {},
  }),
}));

describe("DeleteAccountModal", () => {
  const mockOnOpenChange = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    mockDeleteAccountExecute.mockClear();
    mockLogEventExecute.mockClear();
    mockOnOpenChange.mockClear();
    mockOnSuccess.mockClear();
  });

  describe("email auth type", () => {
    it("renders modal with confirmation and password fields when open", () => {
      render(
        <DeleteAccountModal
          open={true}
          onOpenChange={mockOnOpenChange}
          userId="uid-1"
          authType={AuthType.Email}
          onSuccess={mockOnSuccess}
        />,
      );

      expect(
        screen.getByRole("heading", { name: "Delete account" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/This action is permanent and cannot be undone/),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Type DELETE to confirm"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Your current password"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Delete my account/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /^Cancel$/i }),
      ).toBeInTheDocument();
    });

    it("does not render when closed", () => {
      render(
        <DeleteAccountModal
          open={false}
          onOpenChange={mockOnOpenChange}
          userId="uid-1"
          authType={AuthType.Email}
          onSuccess={mockOnSuccess}
        />,
      );

      expect(
        screen.queryByRole("heading", { name: "Delete account" }),
      ).not.toBeInTheDocument();
    });

    it("shows validation error when confirmation is empty", async () => {
      const user = userEvent.setup();

      render(
        <DeleteAccountModal
          open={true}
          onOpenChange={mockOnOpenChange}
          userId="uid-1"
          authType={AuthType.Email}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: /Delete my account/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Please type DELETE to confirm/i),
        ).toBeInTheDocument();
      });
      expect(mockDeleteAccountExecute).not.toHaveBeenCalled();
    });

    it("shows validation error when confirmation text does not match DELETE", async () => {
      const user = userEvent.setup();

      render(
        <DeleteAccountModal
          open={true}
          onOpenChange={mockOnOpenChange}
          userId="uid-1"
          authType={AuthType.Email}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.type(
        screen.getByPlaceholderText("Type DELETE to confirm"),
        "delete",
      );
      await user.type(
        screen.getByPlaceholderText("Your current password"),
        "pass",
      );
      await user.click(
        screen.getByRole("button", { name: /Delete my account/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText(/You must type DELETE exactly/i),
        ).toBeInTheDocument();
      });
      expect(mockDeleteAccountExecute).not.toHaveBeenCalled();
    });

    it("shows validation error when password is empty", async () => {
      const user = userEvent.setup();

      render(
        <DeleteAccountModal
          open={true}
          onOpenChange={mockOnOpenChange}
          userId="uid-1"
          authType={AuthType.Email}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.type(
        screen.getByPlaceholderText("Type DELETE to confirm"),
        "DELETE",
      );
      await user.click(
        screen.getByRole("button", { name: /Delete my account/i }),
      );

      await waitFor(() => {
        expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      });
      expect(mockDeleteAccountExecute).not.toHaveBeenCalled();
    });

    it("calls deleteAccountUseCase with password and onSuccess when form is valid", async () => {
      const user = userEvent.setup();
      mockDeleteAccountExecute.mockResolvedValue({ success: true });

      render(
        <DeleteAccountModal
          open={true}
          onOpenChange={mockOnOpenChange}
          userId="uid-1"
          authType={AuthType.Email}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.type(
        screen.getByPlaceholderText("Type DELETE to confirm"),
        "DELETE",
      );
      await user.type(
        screen.getByPlaceholderText("Your current password"),
        "my-password",
      );
      await user.click(
        screen.getByRole("button", { name: /Delete my account/i }),
      );

      await waitFor(() => {
        expect(mockDeleteAccountExecute).toHaveBeenCalledWith({
          userId: "uid-1",
          password: "my-password",
        });
      });
      expect(mockLogEventExecute).toHaveBeenCalledWith({
        eventName: "account_deleted",
      });
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("shows invalid-credentials error when password is wrong", async () => {
      const user = userEvent.setup();
      mockDeleteAccountExecute.mockResolvedValue({
        success: false,
        error: "invalid-credentials",
      });

      render(
        <DeleteAccountModal
          open={true}
          onOpenChange={mockOnOpenChange}
          userId="uid-1"
          authType={AuthType.Email}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.type(
        screen.getByPlaceholderText("Type DELETE to confirm"),
        "DELETE",
      );
      await user.type(
        screen.getByPlaceholderText("Your current password"),
        "wrong-pass",
      );
      await user.click(
        screen.getByRole("button", { name: /Delete my account/i }),
      );

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          /Incorrect password/i,
        );
      });
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it("shows generic error when delete account fails", async () => {
      const user = userEvent.setup();
      mockDeleteAccountExecute.mockResolvedValue({
        success: false,
        error: "generic",
      });

      render(
        <DeleteAccountModal
          open={true}
          onOpenChange={mockOnOpenChange}
          userId="uid-1"
          authType={AuthType.Email}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.type(
        screen.getByPlaceholderText("Type DELETE to confirm"),
        "DELETE",
      );
      await user.type(
        screen.getByPlaceholderText("Your current password"),
        "pass",
      );
      await user.click(
        screen.getByRole("button", { name: /Delete my account/i }),
      );

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it("shows generic error when delete account fails with unknown error code", async () => {
      const user = userEvent.setup();
      mockDeleteAccountExecute.mockResolvedValue({
        success: false,
        error: "unknown-error-code",
      });

      render(
        <DeleteAccountModal
          open={true}
          onOpenChange={mockOnOpenChange}
          userId="uid-1"
          authType={AuthType.Email}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.type(
        screen.getByPlaceholderText("Type DELETE to confirm"),
        "DELETE",
      );
      await user.type(
        screen.getByPlaceholderText("Your current password"),
        "pass",
      );
      await user.click(
        screen.getByRole("button", { name: /Delete my account/i }),
      );

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          /Failed to delete account/i,
        );
      });
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it("shows requires-recent-login error when credential is too old", async () => {
      const user = userEvent.setup();
      mockDeleteAccountExecute.mockResolvedValue({
        success: false,
        error: "requires-recent-login",
      });

      render(
        <DeleteAccountModal
          open={true}
          onOpenChange={mockOnOpenChange}
          userId="uid-1"
          authType={AuthType.Email}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.type(
        screen.getByPlaceholderText("Type DELETE to confirm"),
        "DELETE",
      );
      await user.type(
        screen.getByPlaceholderText("Your current password"),
        "pass",
      );
      await user.click(
        screen.getByRole("button", { name: /Delete my account/i }),
      );

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          /sign out and sign back in/i,
        );
      });
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it("resets form and clears error when modal is closed via overlay", async () => {
      const user = userEvent.setup();
      mockDeleteAccountExecute.mockResolvedValue({
        success: false,
        error: "generic",
      });

      render(
        <DeleteAccountModal
          open={true}
          onOpenChange={mockOnOpenChange}
          userId="uid-1"
          authType={AuthType.Email}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.type(
        screen.getByPlaceholderText("Type DELETE to confirm"),
        "DELETE",
      );
      await user.type(
        screen.getByPlaceholderText("Your current password"),
        "pass",
      );
      await user.click(
        screen.getByRole("button", { name: /Delete my account/i }),
      );

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("dialog-overlay"));

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("works without onSuccess callback", async () => {
      const user = userEvent.setup();
      mockDeleteAccountExecute.mockResolvedValue({ success: true });

      render(
        <DeleteAccountModal
          open={true}
          onOpenChange={mockOnOpenChange}
          userId="uid-1"
          authType={AuthType.Email}
        />,
      );

      await user.type(
        screen.getByPlaceholderText("Type DELETE to confirm"),
        "DELETE",
      );
      await user.type(
        screen.getByPlaceholderText("Your current password"),
        "pass",
      );
      await user.click(
        screen.getByRole("button", { name: /Delete my account/i }),
      );

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("google auth type", () => {
    it("does not render password field for Google auth", () => {
      render(
        <DeleteAccountModal
          open={true}
          onOpenChange={mockOnOpenChange}
          userId="uid-1"
          authType={AuthType.Google}
          onSuccess={mockOnSuccess}
        />,
      );

      expect(
        screen.getByPlaceholderText("Type DELETE to confirm"),
      ).toBeInTheDocument();
      expect(
        screen.queryByPlaceholderText("Your current password"),
      ).not.toBeInTheDocument();
    });

    it("calls deleteAccountUseCase without password for Google auth", async () => {
      const user = userEvent.setup();
      mockDeleteAccountExecute.mockResolvedValue({ success: true });

      render(
        <DeleteAccountModal
          open={true}
          onOpenChange={mockOnOpenChange}
          userId="uid-1"
          authType={AuthType.Google}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.type(
        screen.getByPlaceholderText("Type DELETE to confirm"),
        "DELETE",
      );
      await user.click(
        screen.getByRole("button", { name: /Delete my account/i }),
      );

      await waitFor(() => {
        expect(mockDeleteAccountExecute).toHaveBeenCalledWith({
          userId: "uid-1",
          password: undefined,
        });
      });
      expect(mockLogEventExecute).toHaveBeenCalledWith({
        eventName: "account_deleted",
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    it("shows error when Google reauthentication fails", async () => {
      const user = userEvent.setup();
      mockDeleteAccountExecute.mockResolvedValue({
        success: false,
        error: "generic",
      });

      render(
        <DeleteAccountModal
          open={true}
          onOpenChange={mockOnOpenChange}
          userId="uid-1"
          authType={AuthType.Google}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.type(
        screen.getByPlaceholderText("Type DELETE to confirm"),
        "DELETE",
      );
      await user.click(
        screen.getByRole("button", { name: /Delete my account/i }),
      );

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          /Failed to delete account/i,
        );
      });
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});
