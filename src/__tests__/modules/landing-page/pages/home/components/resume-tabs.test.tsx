import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ResumeTabs } from "@/modules/landing-page/presentation/pages/home/components/resume-tabs";

const defaultProps = {
  tabs: {
    experience: "Experience",
    skills: "Professional Skills",
    education: "Education",
  },
  experience: [
    {
      title: "VP of Engineering",
      company: "Kuma Games Inc",
      period: "2021 - Present",
      points: ["Led dev team", "Built React website"],
    },
  ],
  skills: [{ name: "Frontend", items: "React, TypeScript" }],
  education: [
    { title: "BSc IT", institution: "University", period: "2008 - 2013" },
  ],
};

describe("ResumeTabs", () => {
  it("renders skills tab content by default", () => {
    render(<ResumeTabs {...defaultProps} />);

    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("React, TypeScript")).toBeInTheDocument();
  });

  it("switches to experience tab when clicked", async () => {
    const user = userEvent.setup();
    render(<ResumeTabs {...defaultProps} />);

    await user.click(screen.getByRole("tab", { name: "Experience" }));

    expect(screen.getByText("VP of Engineering")).toBeInTheDocument();
    expect(screen.getByText("Kuma Games Inc")).toBeInTheDocument();
    expect(screen.queryByText("Frontend")).not.toBeInTheDocument();
  });

  it("switches to education tab when clicked", async () => {
    const user = userEvent.setup();
    render(<ResumeTabs {...defaultProps} />);

    await user.click(screen.getByRole("tab", { name: "Education" }));

    expect(screen.getByText("BSc IT")).toBeInTheDocument();
    expect(screen.getByText("University")).toBeInTheDocument();
    expect(screen.getByText("2008 - 2013")).toBeInTheDocument();
    expect(screen.queryByText("VP of Engineering")).not.toBeInTheDocument();
  });

  it("highlights the active tab with aria-selected", () => {
    render(<ResumeTabs {...defaultProps} />);

    const experienceTab = screen.getByRole("tab", { name: "Experience" });
    const skillsTab = screen.getByRole("tab", {
      name: "Professional Skills",
    });
    const educationTab = screen.getByRole("tab", { name: "Education" });

    expect(skillsTab).toHaveAttribute("aria-selected", "true");
    expect(experienceTab).toHaveAttribute("aria-selected", "false");
    expect(educationTab).toHaveAttribute("aria-selected", "false");
  });

  it("updates aria-selected when switching tabs", async () => {
    const user = userEvent.setup();
    render(<ResumeTabs {...defaultProps} />);

    await user.click(screen.getByRole("tab", { name: "Experience" }));

    expect(
      screen.getByRole("tab", { name: "Professional Skills" }),
    ).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Experience" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
