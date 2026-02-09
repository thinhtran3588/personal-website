import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SignInForm } from "@/modules/auth/presentation/pages/sign-in/components/sign-in-form";

const mockReplace = vi.fn();
const mockExecute = vi.fn();
const mockGoogleExecute = vi.fn();
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
      name === "signInWithEmailUseCase"
        ? { execute: mockExecute }
        : name === "signInWithGoogleUseCase"
          ? { execute: mockGoogleExecute }
          : {},
  }),
}));

describe("SignInForm", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockExecute.mockClear();
    mockGoogleExecute.mockClear();
    mockSearchParams.mockReturnValue(null);
  });

  it("renders email, password, Google button and submit", () => {
    render(<SignInForm />);
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue with google/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in with email/i }),
    ).toBeInTheDocument();
  });

  it("shows error when submit fails", async () => {
    const user = userEvent.setup();
    mockExecute.mockResolvedValue({
      success: false,
      error: "invalid-credentials",
    });
    render(<SignInForm />);
    await user.type(screen.getByPlaceholderText("you@example.com"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "password1!");
    await user.click(
      screen.getByRole("button", { name: /sign in with email/i }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("calls router.replace with / when Google sign-in succeeds without returnUrl", async () => {
    const user = userEvent.setup();
    mockGoogleExecute.mockResolvedValue({ success: true });
    render(<SignInForm />);
    await user.click(
      screen.getByRole("button", { name: /continue with google/i }),
    );
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("calls router.replace with returnUrl when Google sign-in succeeds", async () => {
    const user = userEvent.setup();
    mockSearchParams.mockReturnValue("/profile");
    mockGoogleExecute.mockResolvedValue({ success: true });
    render(<SignInForm />);
    await user.click(
      screen.getByRole("button", { name: /continue with google/i }),
    );
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/profile");
    });
  });

  it("shows error when Google sign-in fails", async () => {
    const user = userEvent.setup();
    mockGoogleExecute.mockResolvedValue({
      success: false,
      error: "invalid-credentials",
    });
    render(<SignInForm />);
    await user.click(
      screen.getByRole("button", { name: /continue with google/i }),
    );
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("calls router.replace with / when submit succeeds without returnUrl", async () => {
    const user = userEvent.setup();
    mockExecute.mockResolvedValue({ success: true });
    render(<SignInForm />);
    await user.type(screen.getByPlaceholderText("you@example.com"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "password1!");
    await user.click(
      screen.getByRole("button", { name: /sign in with email/i }),
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("calls router.replace with returnUrl when submit succeeds", async () => {
    const user = userEvent.setup();
    mockSearchParams.mockReturnValue("/app/books");
    mockExecute.mockResolvedValue({ success: true });
    render(<SignInForm />);
    await user.type(screen.getByPlaceholderText("you@example.com"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "password1!");
    await user.click(
      screen.getByRole("button", { name: /sign in with email/i }),
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/app/books");
    });
  });

  it("preserves returnUrl in sign-up link when returnUrl is present", () => {
    mockSearchParams.mockReturnValue("/profile");
    render(<SignInForm />);
    const signUpLink = screen.getByRole("link", { name: /sign up/i });
    expect(signUpLink).toHaveAttribute(
      "href",
      "/auth/sign-up?returnUrl=%2Fprofile",
    );
  });

  it("uses default sign-up link when no returnUrl", () => {
    render(<SignInForm />);
    const signUpLink = screen.getByRole("link", { name: /sign up/i });
    expect(signUpLink).toHaveAttribute("href", "/auth/sign-up");
  });
});
