import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthType } from "@/modules/auth/domain/types";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";
import { ProfileForm } from "@/modules/auth/presentation/pages/profile/components/profile-form";

vi.mock("@/common/routing/navigation", () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockUser = {
  id: "uid-1",
  email: "a@b.com",
  displayName: "Alice",
  photoURL: null,
  authType: AuthType.Email,
};

describe("ProfileForm", () => {
  beforeEach(() => {
    useAuthUserStore.setState({
      user: { ...mockUser },
      loading: false,
    });
  });

  it("renders loading skeleton when loading", () => {
    useAuthUserStore.setState({ user: mockUser, loading: true });

    render(<ProfileForm readonly />);

    expect(screen.getByTestId("profile-loading")).toBeInTheDocument();
  });

  it("returns null when user is null", () => {
    useAuthUserStore.setState({ user: null, loading: false });

    const { container } = render(<ProfileForm readonly />);

    expect(container.firstChild).toBeNull();
  });

  it("renders email label, readonly displayName input, and hides buttons in readonly mode", () => {
    const { container } = render(<ProfileForm readonly />);

    expect(screen.getByText("a@b.com")).toBeInTheDocument();
    expect(screen.getByTestId("profile-email-auth-icon")).toBeInTheDocument();
    expect(screen.getByText("Full name")).toBeInTheDocument();
    const fullNameInput = screen.getByRole("textbox", { name: /full name/i });
    expect(fullNameInput).toHaveDisplayValue("Alice");
    expect(fullNameInput).toHaveAttribute("readonly");
    expect(
      screen.queryByRole("button", { name: /^Save$/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^Cancel$/i }),
    ).not.toBeInTheDocument();
    expect(container.querySelector('button[type="submit"]')).toBeNull();
  });

  it("renders editable displayName input when not readonly", () => {
    render(<ProfileForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    const fullNameInput = screen.getByRole("textbox", { name: /full name/i });
    expect(fullNameInput).toHaveDisplayValue("Alice");
    expect(fullNameInput).not.toHaveAttribute("readonly");
  });

  it("shows Save and Cancel buttons when not readonly and handlers provided", () => {
    render(<ProfileForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByRole("button", { name: /^Save$/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Cancel$/i }),
    ).toBeInTheDocument();
  });

  it("shows only Save button when onCancel is not provided", () => {
    render(<ProfileForm onSubmit={vi.fn()} />);

    expect(screen.getByRole("button", { name: /^Save$/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^Cancel$/i }),
    ).not.toBeInTheDocument();
  });

  it("shows only Cancel button when onSubmit is not provided", () => {
    const { container } = render(<ProfileForm onCancel={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: /^Cancel$/i }),
    ).toBeInTheDocument();
    expect(container.querySelector('button[type="submit"]')).toBeNull();
  });

  it("calls onSubmit with form data when submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ProfileForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.clear(screen.getByRole("textbox", { name: /full name/i }));
    await user.type(screen.getByRole("textbox", { name: /full name/i }), "Bob");
    await user.click(screen.getByRole("button", { name: /^Save$/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ displayName: "Bob" });
    });
  });

  it("does not call onSubmit when form is submitted in readonly mode", () => {
    const onSubmit = vi.fn();
    const { container } = render(<ProfileForm readonly onSubmit={onSubmit} />);
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
    act(() => {
      form?.requestSubmit();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("resets form and calls onCancel when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<ProfileForm onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.clear(screen.getByRole("textbox", { name: /full name/i }));
    await user.type(
      screen.getByRole("textbox", { name: /full name/i }),
      "Changed",
    );
    await user.click(screen.getByRole("button", { name: /^Cancel$/i }));

    expect(onCancel).toHaveBeenCalled();
    expect(
      screen.getByRole("textbox", { name: /full name/i }),
    ).toHaveDisplayValue("Alice");
  });

  it("renders em dash when user has no email", () => {
    useAuthUserStore.setState({
      user: { ...mockUser, email: null },
      loading: false,
    });

    render(<ProfileForm readonly />);

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows auth icon when authType is other", () => {
    useAuthUserStore.setState({
      user: { ...mockUser, authType: AuthType.Other },
      loading: false,
    });

    render(<ProfileForm readonly />);

    expect(screen.getByTestId("profile-email-auth-icon")).toBeInTheDocument();
  });

  it("shows auth icon when authType is unknown", () => {
    useAuthUserStore.setState({
      user: {
        ...mockUser,
        authType: "unknown-provider" as AuthType,
      },
      loading: false,
    });

    render(<ProfileForm readonly />);

    expect(screen.getByTestId("profile-email-auth-icon")).toBeInTheDocument();
  });

  it("shows empty readonly input for displayName when displayName is undefined", () => {
    useAuthUserStore.setState({
      user: {
        ...mockUser,
        displayName: undefined as unknown as string | null,
      },
      loading: false,
    });

    render(<ProfileForm readonly />);

    const fullNameInput = screen.getByRole("textbox", { name: /full name/i });
    expect(fullNameInput).toHaveDisplayValue("");
    expect(fullNameInput).toHaveAttribute("readonly");
  });

  it("shows empty readonly input for displayName when displayName is null", () => {
    useAuthUserStore.setState({
      user: { ...mockUser, displayName: null },
      loading: false,
    });

    render(<ProfileForm readonly />);

    const fullNameInput = screen.getByRole("textbox", { name: /full name/i });
    expect(fullNameInput).toHaveDisplayValue("");
    expect(fullNameInput).toHaveAttribute("readonly");
  });

  it("shows empty textbox when not readonly and displayName is null", () => {
    useAuthUserStore.setState({
      user: { ...mockUser, displayName: null },
      loading: false,
    });

    render(<ProfileForm onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("textbox", { name: /full name/i }),
    ).toHaveDisplayValue("");
  });

  it("shows empty textbox when not readonly and displayName is undefined", () => {
    useAuthUserStore.setState({
      user: {
        ...mockUser,
        displayName: undefined as unknown as string | null,
      },
      loading: false,
    });

    render(<ProfileForm onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("textbox", { name: /full name/i }),
    ).toHaveDisplayValue("");
  });

  it("disables Save button while submitting", async () => {
    let resolveSubmit: () => void;
    const submitPromise = new Promise<void>((r) => {
      resolveSubmit = r;
    });
    const onSubmit = vi.fn().mockReturnValue(submitPromise);
    const user = userEvent.setup();
    render(<ProfileForm onSubmit={onSubmit} />);

    await user.clear(screen.getByRole("textbox", { name: /full name/i }));
    await user.type(
      screen.getByRole("textbox", { name: /full name/i }),
      "New Name",
    );
    await user.click(screen.getByRole("button", { name: /^Save$/i }));

    expect(screen.getByRole("button", { name: /^Save$/i })).toBeDisabled();
    resolveSubmit!();
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it("resets form when cancel is clicked and displayName is null", async () => {
    const user = userEvent.setup();
    useAuthUserStore.setState({
      user: { ...mockUser, displayName: null },
      loading: false,
    });

    render(<ProfileForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    await user.type(
      screen.getByRole("textbox", { name: /full name/i }),
      "New Name",
    );
    await user.click(screen.getByRole("button", { name: /^Cancel$/i }));

    expect(
      screen.getByRole("textbox", { name: /full name/i }),
    ).toHaveDisplayValue("");
  });
});
