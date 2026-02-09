import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SignUpForm } from "@/modules/auth/presentation/pages/sign-up/components/sign-up-form";

const mockReplace = vi.fn();
const mockExecute = vi.fn();
const mockSearchParams = vi.fn().mockReturnValue(null);

vi.mock("@/common/routing/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: mockSearchParams,
  }),
}));
vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => ({
    resolve: (name: string) =>
      name === "signUpWithEmailUseCase" ? { execute: mockExecute } : {},
  }),
}));

describe("SignUpForm", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockExecute.mockClear();
    mockSearchParams.mockReturnValue(null);
  });

  it("renders email, password, confirmPassword, fullName and submit", () => {
    render(<SignUpForm />);
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  it("shows error when submit fails", async () => {
    const user = userEvent.setup();
    mockExecute.mockResolvedValue({
      success: false,
      error: "email-already-in-use",
    });
    render(<SignUpForm />);
    await user.type(screen.getByPlaceholderText("you@example.com"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "Password1!");
    await user.type(screen.getByLabelText("Confirm password"), "Password1!");
    await user.type(screen.getByLabelText("Full name (optional)"), "Alice");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("calls router.replace with / when submit succeeds without returnUrl", async () => {
    const user = userEvent.setup();
    mockExecute.mockResolvedValue({ success: true });
    render(<SignUpForm />);
    await user.type(screen.getByPlaceholderText("you@example.com"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "Password1!");
    await user.type(screen.getByLabelText("Confirm password"), "Password1!");
    await user.type(screen.getByLabelText("Full name (optional)"), "Alice");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("calls router.replace with returnUrl when submit succeeds", async () => {
    const user = userEvent.setup();
    mockSearchParams.mockReturnValue("/app/books");
    mockExecute.mockResolvedValue({ success: true });
    render(<SignUpForm />);
    await user.type(screen.getByPlaceholderText("you@example.com"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "Password1!");
    await user.type(screen.getByLabelText("Confirm password"), "Password1!");
    await user.type(screen.getByLabelText("Full name (optional)"), "Alice");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/app/books");
    });
  });

  it("preserves returnUrl in sign-in link when returnUrl is present", () => {
    mockSearchParams.mockReturnValue("/profile");
    render(<SignUpForm />);
    const signInLink = screen.getByRole("link", { name: /sign in/i });
    expect(signInLink).toHaveAttribute(
      "href",
      "/auth/sign-in?returnUrl=%2Fprofile",
    );
  });

  it("uses default sign-in link when no returnUrl", () => {
    render(<SignUpForm />);
    const signInLink = screen.getByRole("link", { name: /sign in/i });
    expect(signInLink).toHaveAttribute("href", "/auth/sign-in");
  });
});
