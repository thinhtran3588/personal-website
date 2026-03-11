import { render, screen } from "@testing-library/react";

import { getYearsOfExperience } from "@/application/config/personal-info";
import messages from "@/application/localization/en.json";
import resumeMessages from "@/application/localization/resume.json";
import { LandingPage } from "@/modules/landing-page/presentation/pages/home/page";

const home = messages.modules.landing.pages.home;
const homeResume = resumeMessages;

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

    const expectedBio = homeResume.summary.replace(
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
      screen.getByRole("heading", { name: homeResume.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: homeResume.tabs.experience }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: homeResume.tabs.skills }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: homeResume.tabs.education }),
    ).toBeInTheDocument();
  });

  it("renders social links", async () => {
    render(await LandingPage());

    expect(
      screen.getByRole("link", { name: homeResume.links[1].label }),
    ).toHaveAttribute("href", "https://github.com/thinhtran3588");
    expect(
      screen.getByRole("link", { name: homeResume.links[0].label }),
    ).toHaveAttribute("href", "https://www.linkedin.com/in/thinhtran3588");
  });

  it("renders skill badges", async () => {
    render(await LandingPage());

    expect(
      screen.getByText(homeResume.bestSkills[4].label),
    ).toBeInTheDocument();
    expect(
      screen.getByText(homeResume.bestSkills[0].label),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(homeResume.bestSkills[3].label).length,
    ).toBeGreaterThanOrEqual(1);
  });
});
