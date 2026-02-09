import { render, screen } from "@testing-library/react";

import messages from "@/application/localization/en.json";
import { PrivacyPolicyPage } from "@/modules/landing-page/presentation/pages/privacy-policy/page";
import { TermsOfServicePage } from "@/modules/landing-page/presentation/pages/terms-of-service/page";

describe("Legal pages", () => {
  it("renders the privacy policy placeholder", async () => {
    render(await PrivacyPolicyPage());

    expect(
      screen.getByRole("heading", {
        name: messages.modules.legal.pages["privacy-policy"].title,
      }),
    ).toBeInTheDocument();
  });

  it("renders the terms of service placeholder", async () => {
    render(await TermsOfServicePage());

    expect(
      screen.getByRole("heading", {
        name: messages.modules.legal.pages["terms-of-service"].title,
      }),
    ).toBeInTheDocument();
  });
});
