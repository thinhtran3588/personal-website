import { render, screen } from "@testing-library/react";

import messages from "@/application/localization/en.json";
import { AuthLayout } from "@/modules/auth/presentation/components/auth-layout";

describe("AuthLayout", () => {
  it("renders the layout shell with children and back to home link", async () => {
    render(
      await AuthLayout({
        children: (
          <h1 className="text-3xl font-semibold text-white">
            {messages.modules.auth.pages["sign-in"].title}
          </h1>
        ),
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: messages.modules.auth.pages["sign-in"].title,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: messages.common.navigation.backToHome }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("auth-center-area")).toBeInTheDocument();
  });

  it("hides language selector when showLanguageSelector is false", async () => {
    render(
      await AuthLayout({
        children: <span data-testid="child">Content</span>,
        showLanguageSelector: false,
      }),
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByTestId("auth-center-area")).toBeInTheDocument();
  });
});
