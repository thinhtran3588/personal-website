import { render, screen } from "@testing-library/react";

import messages from "@/application/localization/en.json";
import { LandingPage } from "@/modules/landing-page/presentation/pages/home/page";

const docItems = messages.modules.landing.pages.home.docs.items;

describe("LandingPage", () => {
  it("renders the hero headline and main app CTA", async () => {
    render(await LandingPage());

    expect(
      screen.getByRole("heading", {
        name: messages.modules.landing.pages.home.hero.title,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: messages.common.navigation.goToApp,
      }),
    ).toBeInTheDocument();
  });

  it("renders documentation cards as links to the corresponding doc pages", async () => {
    render(await LandingPage());

    const expectedLinks = [
      { title: docItems.architecture.title, href: "/docs/architecture" },
      {
        title: docItems.codingConventions.title,
        href: "/docs/coding-conventions",
      },
      { title: docItems.development.title, href: "/docs/development-guide" },
      { title: docItems.testing.title, href: "/docs/testing-guide" },
      { title: docItems.firebase.title, href: "/docs/firebase-integration" },
      { title: docItems.deployment.title, href: "/docs/deployment" },
    ];

    for (const { title, href } of expectedLinks) {
      const heading = screen.getByRole("heading", { name: title });
      const link = heading.closest("a");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", href);
    }
  });
});
