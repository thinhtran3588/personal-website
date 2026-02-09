import { render, screen } from "@testing-library/react";

import { getYearsOfExperience } from "@/application/config/personal-info";
import messages from "@/application/localization/en.json";
import { LandingPage } from "@/modules/landing-page/presentation/pages/home/page";

const home = messages.modules.landing.pages.home;

describe("LandingPage", () => {
  it("renders the main section with name heading", async () => {
    render(await LandingPage());

    expect(
      screen.getByRole("heading", {
        name: home.main.name,
      }),
    ).toBeInTheDocument();
  });

  it("renders the bio text", async () => {
    render(await LandingPage());

    const expectedBio = home.main.bio.replace(
      "{yearsOfExperience}",
      String(getYearsOfExperience()),
    );
    expect(screen.getByText(expectedBio)).toBeInTheDocument();
  });

  it("renders all service cards", async () => {
    render(await LandingPage());

    const serviceKeys = [
      "fullstack",
      "blockchain",
      "devops",
      "consultant",
    ] as const;

    for (const key of serviceKeys) {
      expect(
        screen.getByRole("heading", {
          name: home.services.items[key].title,
        }),
      ).toBeInTheDocument();
    }
  });

  it("renders resume section with tab labels", async () => {
    render(await LandingPage());

    expect(
      screen.getByRole("heading", { name: home.resume.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: home.resume.tabs.experience }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: home.resume.tabs.skills }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: home.resume.tabs.education }),
    ).toBeInTheDocument();
  });

  it("renders social links", async () => {
    render(await LandingPage());

    expect(
      screen.getByRole("link", { name: home.main.social.github }),
    ).toHaveAttribute("href", "https://github.com/thinhtran3588");
    expect(
      screen.getByRole("link", { name: home.main.social.linkedin }),
    ).toHaveAttribute("href", "https://www.linkedin.com/in/thinhtran3588");
  });

  it("renders skill badges", async () => {
    render(await LandingPage());

    expect(screen.getByText(home.main.skills.solidity)).toBeInTheDocument();
    expect(screen.getByText(home.main.skills.react)).toBeInTheDocument();
    expect(
      screen.getAllByText(home.main.skills.nodejs).length,
    ).toBeGreaterThanOrEqual(1);
  });
});
