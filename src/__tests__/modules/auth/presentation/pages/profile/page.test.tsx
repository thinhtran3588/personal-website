import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthType } from "@/modules/auth/domain/types";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";
import { ProfilePage } from "@/modules/auth/presentation/pages/profile/page";

const mockUpdateProfileExecute = vi.fn();
const mockUpdatePasswordExecute = vi.fn();
const mockDeleteAccountExecute = vi.fn();
const mockLogEventExecute = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: (message: string) => mockToastSuccess(message),
    error: (message: string) => mockToastError(message),
  },
}));
vi.mock("@/common/routing/navigation", () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => ({
    resolve: (name: string) =>
      name === "updateProfileUseCase"
        ? { execute: mockUpdateProfileExecute }
        : name === "updatePasswordUseCase"
          ? { execute: mockUpdatePasswordExecute }
          : name === "deleteAccountUseCase"
            ? { execute: mockDeleteAccountExecute }
            : name === "logEventUseCase"
              ? { execute: mockLogEventExecute }
              : {},
  }),
}));

const mockUser = {
  id: "uid-1",
  email: "a@b.com",
  displayName: "Alice",
  photoURL: null,
  authType: AuthType.Email,
};

describe("ProfilePage", () => {
  beforeEach(() => {
    mockUpdateProfileExecute.mockClear();
    mockUpdatePasswordExecute.mockClear();
    mockDeleteAccountExecute.mockClear();
    mockLogEventExecute.mockClear();
    mockToastSuccess.mockClear();
    mockToastError.mockClear();
    useAuthUserStore.setState({
      user: { ...mockUser },
      loading: false,
    });
  });

  it("renders title, readonly form, Edit, Change password, and Delete account buttons", () => {
    render(<ProfilePage />);

    expect(
      screen.getByRole("heading", { name: "Profile" }),
    ).toBeInTheDocument();
    expect(screen.getByText("a@b.com")).toBeInTheDocument();
    const fullNameInput = screen.getByRole("textbox", { name: /full name/i });
    expect(fullNameInput).toHaveDisplayValue("Alice");
    expect(fullNameInput).toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: /^Edit$/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /change password/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /delete account/i }),
    ).toBeInTheDocument();
  });

  it("hides buttons when user is null", () => {
    useAuthUserStore.setState({ user: null, loading: false });

    render(<ProfilePage />);

    expect(
      screen.getByRole("heading", { name: "Profile" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^Edit$/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /change password/i }),
    ).not.toBeInTheDocument();
  });

  it("hides buttons when loading", () => {
    useAuthUserStore.setState({ user: mockUser, loading: true });

    render(<ProfilePage />);

    expect(screen.getByTestId("profile-loading")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^Edit$/i }),
    ).not.toBeInTheDocument();
  });

  it("hides Change password button when authType is not email", () => {
    useAuthUserStore.setState({
      user: { ...mockUser, authType: AuthType.Google },
      loading: false,
    });

    render(<ProfilePage />);

    expect(screen.getByRole("button", { name: /^Edit$/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /change password/i }),
    ).not.toBeInTheDocument();
  });

  it("switches to edit mode with editable form when Edit is clicked", async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    await user.click(screen.getByRole("button", { name: /^Edit$/i }));

    const fullNameInput = screen.getByRole("textbox", { name: /full name/i });
    expect(fullNameInput).toHaveDisplayValue("Alice");
    expect(fullNameInput).not.toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: /^Save$/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Cancel$/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^Edit$/i }),
    ).not.toBeInTheDocument();
  });

  it("does not call updateProfileUseCase and returns to view mode when displayName is unchanged", async () => {
    const user = userEvent.setup();

    render(<ProfilePage />);
    await user.click(screen.getByRole("button", { name: /^Edit$/i }));
    await user.click(screen.getByRole("button", { name: /^Save$/i }));

    expect(mockUpdateProfileExecute).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /^Edit$/i })).toBeInTheDocument();
  });

  it("updates auth store and returns to view mode when profile update succeeds", async () => {
    const user = userEvent.setup();
    mockUpdateProfileExecute.mockResolvedValue({ success: true });

    render(<ProfilePage />);
    await user.click(screen.getByRole("button", { name: /^Edit$/i }));
    await user.clear(screen.getByRole("textbox", { name: /full name/i }));
    await user.type(
      screen.getByRole("textbox", { name: /full name/i }),
      "Alice Updated",
    );
    await user.click(screen.getByRole("button", { name: /^Save$/i }));

    await waitFor(() => {
      expect(mockUpdateProfileExecute).toHaveBeenCalledWith({
        displayName: "Alice Updated",
      });
    });
    expect(mockLogEventExecute).toHaveBeenCalledWith({
      eventName: "profile_updated",
      params: { field: "display_name" },
    });
    expect(mockToastSuccess).toHaveBeenCalledWith("Profile updated.");
    expect(useAuthUserStore.getState().user?.displayName).toBe("Alice Updated");
    expect(screen.getByRole("button", { name: /^Edit$/i })).toBeInTheDocument();
  });

  it("shows error toast when profile update fails", async () => {
    const user = userEvent.setup();
    mockUpdateProfileExecute.mockResolvedValue({
      success: false,
      error: "generic",
    });

    render(<ProfilePage />);
    await user.click(screen.getByRole("button", { name: /^Edit$/i }));
    await user.clear(screen.getByRole("textbox", { name: /full name/i }));
    await user.type(
      screen.getByRole("textbox", { name: /full name/i }),
      "New Name",
    );
    await user.click(screen.getByRole("button", { name: /^Save$/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Something went wrong. Please try again.",
      );
    });
    expect(mockLogEventExecute).not.toHaveBeenCalled();
  });

  it("cancels edit and returns to view mode when Cancel is clicked", async () => {
    const user = userEvent.setup();

    render(<ProfilePage />);
    await user.click(screen.getByRole("button", { name: /^Edit$/i }));
    await user.clear(screen.getByRole("textbox", { name: /full name/i }));
    await user.type(
      screen.getByRole("textbox", { name: /full name/i }),
      "Changed Name",
    );
    await user.click(screen.getByRole("button", { name: /^Cancel$/i }));

    expect(screen.getByRole("button", { name: /^Edit$/i })).toBeInTheDocument();
    const fullNameInput = screen.getByRole("textbox", { name: /full name/i });
    expect(fullNameInput).toHaveDisplayValue("Alice");
    expect(fullNameInput).toHaveAttribute("readonly");
  });

  it("opens change password modal and shows success on update", async () => {
    const user = userEvent.setup();
    mockUpdatePasswordExecute.mockResolvedValue({ success: true });

    render(<ProfilePage />);
    await user.click(screen.getByRole("button", { name: /change password/i }));

    expect(
      screen.getByRole("heading", { name: "Update password" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Current password")).toBeInTheDocument();
    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm new password")).toBeInTheDocument();

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
    expect(mockLogEventExecute).toHaveBeenCalledWith({
      eventName: "password_changed",
    });
    expect(mockToastSuccess).toHaveBeenCalledWith("Password updated.");
  });

  it("resets password modal when closed", async () => {
    const user = userEvent.setup();

    render(<ProfilePage />);
    await user.click(screen.getByRole("button", { name: /change password/i }));
    expect(
      screen.getByRole("heading", { name: "Update password" }),
    ).toBeInTheDocument();
    await user.click(screen.getByTestId("dialog-overlay"));
    expect(
      screen.queryByRole("heading", { name: "Update password" }),
    ).not.toBeInTheDocument();
  });

  it("shows error when password update fails", async () => {
    const user = userEvent.setup();
    mockUpdatePasswordExecute.mockResolvedValue({
      success: false,
      error: "invalid-credentials",
    });

    render(<ProfilePage />);
    await user.click(screen.getByRole("button", { name: /change password/i }));
    await user.type(screen.getByLabelText("Current password"), "WrongPass1!");
    await user.type(screen.getByLabelText("New password"), "NewPass1!");
    await user.type(screen.getByLabelText("Confirm new password"), "NewPass1!");
    await user.click(
      screen.getByRole("button", { name: /^Update password$/i }),
    );

    await waitFor(() => {
      const alerts = screen.getAllByRole("alert");
      expect(alerts.length).toBeGreaterThan(0);
    });
  });

  it("opens delete account modal and shows success on deletion", async () => {
    const user = userEvent.setup();
    mockDeleteAccountExecute.mockResolvedValue({ success: true });

    render(<ProfilePage />);
    await user.click(screen.getByRole("button", { name: /delete account/i }));

    expect(
      screen.getByRole("heading", { name: "Delete account" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/This action is permanent/)).toBeInTheDocument();

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
    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Your account has been deleted.",
    );
  });

  it("shows Delete account button for non-email auth types", () => {
    useAuthUserStore.setState({
      user: { ...mockUser, authType: AuthType.Google },
      loading: false,
    });

    render(<ProfilePage />);

    expect(
      screen.getByRole("button", { name: /delete account/i }),
    ).toBeInTheDocument();
  });
});
