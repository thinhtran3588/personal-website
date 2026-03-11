import { render, screen } from "@testing-library/react";

import { getYearsOfExperience } from "@/application/config/personal-info";
import messages from "@/application/localization/en.json";
import resumeMessages from "@/application/localization/resume.json";
import { CvPage } from "@/modules/landing-page/presentation/pages/cv/page";

const cvMessages = messages.modules.landing.pages.cv;
const home = messages.modules.landing.pages.home;
const resume = resumeMessages;

describe("CvPage", () => {
  it("renders name, headline, and summary", async () => {
    render(await CvPage());

    expect(
      screen.getByRole("heading", { name: home.badge }),
    ).toBeInTheDocument();
    expect(screen.getByText(resume.headline)).toBeInTheDocument();

    const expectedSummary = resume.summary.replace(
      "{yearsOfExperience}",
      String(getYearsOfExperience()),
    );
    expect(screen.getByText(expectedSummary)).toBeInTheDocument();
  });

  it("renders print button", async () => {
    render(await CvPage());

    expect(
      screen.getByRole("button", { name: cvMessages.printButton }),
    ).toBeInTheDocument();
  });

  it("renders only LinkedIn link and excludes GitHub/Facebook", async () => {
    render(await CvPage());

    const linkedIn = resume.links.find((link) => link.key === "linkedin");

    if (!linkedIn) {
      throw new Error("LinkedIn link is missing from resume data.");
    }

    const link = screen.getByRole("link", {
      name: new RegExp(linkedIn.label),
    });

    expect(link).toHaveAttribute("href", linkedIn.href);
    expect(
      screen.queryByRole("link", { name: /github/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /facebook/i }),
    ).not.toBeInTheDocument();
  });

  it("renders experience with company as heading", async () => {
    render(await CvPage());

    expect(screen.getByText(resume.experience[0].company)).toBeInTheDocument();
    expect(screen.getByText(resume.experience[0].title)).toBeInTheDocument();
  });

  it("renders skills in sidebar", async () => {
    render(await CvPage());

    expect(screen.getByText(resume.skills[0].name)).toBeInTheDocument();
    expect(screen.getByText(resume.skills[0].items)).toBeInTheDocument();
  });

  it("renders certifications and education separately", async () => {
    render(await CvPage());

    expect(
      screen.getByRole("heading", { name: cvMessages.certificationsTitle }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: cvMessages.educationTitle }),
    ).toBeInTheDocument();

    const awsCert = resume.education.find((e) => e.institution.includes("AWS"));
    const formalEdu = resume.education.find(
      (e) => !e.institution.includes("AWS"),
    );

    if (awsCert) {
      expect(screen.getByText(awsCert.title)).toBeInTheDocument();
    }
    if (formalEdu) {
      expect(screen.getByText(formalEdu.title)).toBeInTheDocument();
    }
  });

  it("renders best skills badges", async () => {
    render(await CvPage());

    expect(screen.getByText(resume.bestSkills[0].label)).toBeInTheDocument();
  });
});
