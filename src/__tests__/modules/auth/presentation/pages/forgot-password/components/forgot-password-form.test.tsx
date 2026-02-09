import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ForgotPasswordForm } from "@/modules/auth/presentation/pages/forgot-password/components/forgot-password-form";

const mockExecute = vi.fn();

vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => ({
    resolve: () => ({ execute: mockExecute }),
  }),
}));

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    mockExecute.mockReset();
  });

  it("renders email field and submit button", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset link/i }),
    ).toBeInTheDocument();
  });

  it("shows success message and back link after successful submit", async () => {
    mockExecute.mockResolvedValue({ success: true });
    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "a@b.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/we've sent a reset link/i)).toBeInTheDocument();
    });
    expect(
      screen.getByRole("link", { name: /back to sign in/i }),
    ).toBeInTheDocument();
  });

  it("shows error message when submit fails", async () => {
    mockExecute.mockResolvedValue({
      success: false,
      error: "invalid-credentials",
    });
    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "a@b.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
