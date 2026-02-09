import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthType } from "@/modules/auth/domain/types";
import { AuthVerification } from "@/modules/auth/presentation/components/auth-verification";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";

const mockReplace = vi.fn();
const mockPathname = vi.fn().mockReturnValue("/profile");

vi.mock("@/common/routing/navigation", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/common/routing/navigation")>();
  return {
    ...actual,
    useRouter: () => ({ ...actual.useRouter(), replace: mockReplace }),
    usePathname: () => mockPathname(),
  };
});

describe("AuthVerification", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPathname.mockReturnValue("/profile");
  });

  it("shows loading skeleton when loading", () => {
    useAuthUserStore.setState({
      user: null,
      loading: true,
    });

    render(
      <AuthVerification>
        <span>Child content</span>
      </AuthVerification>,
    );

    expect(screen.getByTestId("auth-verification-loading")).toBeInTheDocument();
    expect(screen.queryByText("Child content")).not.toBeInTheDocument();
  });

  it("renders children when user is set", () => {
    useAuthUserStore.setState({
      user: {
        id: "uid-1",
        email: "a@b.com",
        displayName: "Alice",
        photoURL: null,
        authType: AuthType.Email,
      },
      loading: false,
    });

    render(
      <AuthVerification>
        <span>Child content</span>
      </AuthVerification>,
    );

    expect(screen.getByText("Child content")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("redirects to sign-in with returnUrl when no user", async () => {
    useAuthUserStore.setState({ user: null, loading: false });

    render(
      <AuthVerification>
        <span>Child</span>
      </AuthVerification>,
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        "/auth/sign-in?returnUrl=%2Fprofile",
      );
    });
  });

  it("redirects to custom signInPath with returnUrl when no user", async () => {
    useAuthUserStore.setState({ user: null, loading: false });
    mockPathname.mockReturnValue("/app/books");

    render(
      <AuthVerification signInPath="/custom/sign-in">
        <span>Child</span>
      </AuthVerification>,
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        "/custom/sign-in?returnUrl=%2Fapp%2Fbooks",
      );
    });
  });
});
