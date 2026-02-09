import { render, screen } from "@testing-library/react";

import messages from "@/application/localization/en.json";
import { ContactPage } from "@/modules/landing-page/presentation/pages/contact/page";

const contactMessages = messages.modules.contact.pages.contact;

describe("ContactPage", () => {
  it("renders the page title", async () => {
    render(await ContactPage());

    expect(
      screen.getByRole("heading", { name: contactMessages.title }),
    ).toBeInTheDocument();
  });

  it("renders the subtitle with support email link", async () => {
    render(await ContactPage());

    const emailLinks = screen.getAllByRole("link", {
      name: "quangthinhtran3588@gmail.com",
    });
    expect(emailLinks.length).toBeGreaterThanOrEqual(1);
    expect(emailLinks[0]).toHaveAttribute(
      "href",
      "mailto:quangthinhtran3588@gmail.com",
    );
  });

  it("renders the email note section with support email", async () => {
    render(await ContactPage());

    expect(
      screen.getByText(contactMessages.emailNote, { exact: false }),
    ).toBeInTheDocument();
  });

  it("renders the back to home button", async () => {
    render(await ContactPage());

    expect(
      screen.getByRole("link", {
        name: messages.common.navigation.backToHome,
      }),
    ).toBeInTheDocument();
  });
});
