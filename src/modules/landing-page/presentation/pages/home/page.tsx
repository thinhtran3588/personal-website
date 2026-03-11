import { getMessages, getTranslations } from "next-intl/server";
import Image from "next/image";
import type { ComponentType } from "react";

import { getYearsOfExperience } from "@/application/config/personal-info";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/card";
import {
  CloudGearIcon,
  FacebookIcon,
  FlutterIcon,
  GitHubIcon,
  LinkedInIcon,
  NodejsIcon,
  ReactIcon,
  SolidityIcon,
} from "@/common/components/icons";
import { cn } from "@/common/utils/cn";
import { ResumeTabs } from "./components/resume-tabs";
import { ScrollReveal } from "./components/scroll-reveal";
import { TypedText } from "./components/typed-text";

type SocialIconKey = "linkedin" | "github" | "facebook";
type SkillIconKey =
  | "fullstack"
  | "web3"
  | "cloud"
  | "architecture"
  | "mobile"
  | "leadership"
  | "react"
  | "reactNative"
  | "flutter"
  | "nodejs"
  | "solidity"
  | "devops";

type HeroIconProps = {
  className?: string;
};

const SOCIAL_ICON_BY_KEY: Record<
  SocialIconKey,
  ComponentType<HeroIconProps>
> = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  facebook: FacebookIcon,
};

const SKILL_ICON_BY_KEY: Record<SkillIconKey, ComponentType<HeroIconProps>> = {
  fullstack: ReactIcon,
  web3: SolidityIcon,
  cloud: CloudGearIcon,
  architecture: NodejsIcon,
  mobile: FlutterIcon,
  leadership: LinkedInIcon,
  react: ReactIcon,
  reactNative: ReactIcon,
  flutter: FlutterIcon,
  nodejs: NodejsIcon,
  solidity: SolidityIcon,
  devops: CloudGearIcon,
};

const SERVICE_KEYS = [
  "fullstack",
  "blockchain",
  "devops",
  "consultant",
] as const;

type ExperienceItem = {
  title: string;
  company: string;
  period: string;
  points: string[];
};

type SkillItem = {
  name: string;
  items: string;
};

type EducationItem = {
  title: string;
  institution: string;
  period: string;
};

type HomeMessages = {
  main: {
    roles: Record<string, string>;
  };
  resume: {
    summary: string;
    linksLabel: string;
    bestSkillsLabel: string;
    links: Array<{ key: SocialIconKey; label: string; href: string }>;
    bestSkills: Array<{ key: SkillIconKey; label: string }>;
    experience: ExperienceItem[];
    skills: SkillItem[];
    education: EducationItem[];
  };
};

export async function LandingPage() {
  const tHome = await getTranslations("modules.landing.pages.home");
  const messages = await getMessages();
  const yearsOfExperience = getYearsOfExperience();
  const homeMessages = (
    messages as {
      modules: {
        landing: {
          pages: {
            home: HomeMessages;
          };
        };
      };
    }
  ).modules.landing.pages.home;

  const roles = Object.values(homeMessages.main.roles);
  const links = homeMessages.resume.links;
  const bestSkills = homeMessages.resume.bestSkills;
  const experience = homeMessages.resume.experience;
  const skills = homeMessages.resume.skills;
  const education = homeMessages.resume.education;

  return (
    <>
      <div className="flex flex-col gap-24 sm:gap-28">
        {/* Main Section */}
        <section className="hero-shine glass-panel-strong liquid-border rounded-2xl px-8 py-14 sm:rounded-3xl sm:px-12 sm:py-20">
          <div className="relative z-10 flex flex-col items-center gap-10 text-center lg:flex-row lg:items-start lg:gap-16 lg:text-left">
            <div className="hero-entrance hero-entrance-delay-1 shrink-0">
              <Image
                src="/assets/images/profile.png"
                alt="Thinh Tran"
                width={180}
                height={180}
                className="rounded-full border-2 border-[var(--glass-border)]"
                priority
              />
            </div>

            <div className="space-y-6">
              <p className="hero-entrance hero-entrance-delay-1 text-[0.6875rem] font-medium tracking-[0.3em] text-[var(--text-muted)] uppercase">
                {tHome("main.greeting")}
              </p>
              <h1 className="hero-entrance hero-entrance-delay-2 text-[2.125rem] leading-tight font-bold tracking-tight text-[var(--text-primary)] sm:text-[2.5rem] lg:text-[3rem] lg:leading-[1.1]">
                {tHome("main.name")}
              </h1>
              <p className="hero-entrance hero-entrance-delay-3 text-lg text-[var(--text-muted)] sm:text-xl">
                {tHome("main.rolePrefix")} <TypedText roles={roles} />
              </p>
              <p className="hero-entrance hero-entrance-delay-3 max-w-2xl text-[1.0625rem] leading-relaxed text-[var(--text-muted)]">
                {tHome("resume.summary", { yearsOfExperience })}
              </p>

              {/* Social Links */}
              <div className="hero-entrance hero-entrance-delay-4 space-y-3">
                <p className="text-sm font-medium text-[var(--text-muted)]">
                  {tHome("resume.linksLabel")}
                </p>
                <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                  {links.map(({ key, href, label }) => {
                    const Icon = SOCIAL_ICON_BY_KEY[key];

                    return (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-panel flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-[var(--text-muted)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-spring)] hover:translate-y-[-1px] hover:text-[var(--text-primary)]"
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Best Skills */}
              <div className="hero-entrance hero-entrance-delay-5 space-y-3">
                <p className="text-sm font-medium text-[var(--text-muted)]">
                  {tHome("resume.bestSkillsLabel")}
                </p>
                <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                  {bestSkills.map(({ key, label }) => {
                    const Icon = SKILL_ICON_BY_KEY[key];

                    return (
                      <span
                        key={key}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-highlight)] px-4 py-1.5 text-sm text-[var(--text-primary)]",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <ScrollReveal>
          <section className="space-y-8">
            <div className="space-y-2">
              <p className="text-[0.6875rem] font-medium tracking-[0.3em] text-[var(--text-muted)] uppercase">
                {tHome("services.eyebrow")}
              </p>
              <h2 className="text-[1.375rem] font-semibold tracking-tight text-[var(--text-primary)] sm:text-[1.75rem]">
                {tHome("services.title")}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {SERVICE_KEYS.map((key) => (
                <Card key={key} className="bento-card px-6 py-6 sm:rounded-2xl">
                  <CardHeader className="space-y-0 pb-0">
                    <CardTitle>
                      {tHome(`services.items.${key}.title`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <CardDescription>
                      {tHome(`services.items.${key}.description`)}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Resume Section */}
        <ScrollReveal>
          <section className="space-y-8">
            <div className="space-y-2">
              <p className="text-[0.6875rem] font-medium tracking-[0.3em] text-[var(--text-muted)] uppercase">
                {tHome("resume.eyebrow", { yearsOfExperience })}
              </p>
              <h2 className="text-[1.375rem] font-semibold tracking-tight text-[var(--text-primary)] sm:text-[1.75rem]">
                {tHome("resume.title")}
              </h2>
            </div>
            <Card
              variant="strong"
              className="bento-card rounded-2xl px-8 py-10 sm:rounded-3xl sm:px-12 sm:py-14"
            >
              <ResumeTabs
                tabs={{
                  experience: tHome("resume.tabs.experience"),
                  skills: tHome("resume.tabs.skills"),
                  education: tHome("resume.tabs.education"),
                }}
                experience={experience}
                skills={skills}
                education={education}
              />
            </Card>
          </section>
        </ScrollReveal>
      </div>
    </>
  );
}
