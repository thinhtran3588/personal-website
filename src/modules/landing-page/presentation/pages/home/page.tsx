import { getTranslations } from "next-intl/server";
import Image from "next/image";

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

const SOCIAL_LINKS = [
  {
    key: "linkedin",
    href: "https://www.linkedin.com/in/thinhtran3588",
    icon: LinkedInIcon,
  },
  {
    key: "github",
    href: "https://github.com/thinhtran3588",
    icon: GitHubIcon,
  },
  {
    key: "facebook",
    href: "https://www.facebook.com/bongusagi",
    icon: FacebookIcon,
  },
] as const;

const SKILL_ITEMS = [
  { key: "react", icon: ReactIcon },
  { key: "reactNative", icon: ReactIcon },
  { key: "flutter", icon: FlutterIcon },
  { key: "nodejs", icon: NodejsIcon },
  { key: "solidity", icon: SolidityIcon },
  { key: "devops", icon: CloudGearIcon },
] as const;

const SERVICE_KEYS = [
  "fullstack",
  "blockchain",
  "devops",
  "consultant",
] as const;

const EXPERIENCE_ITEMS = [
  { key: "0", pointCount: 3 },
  { key: "1", pointCount: 2 },
  { key: "2", pointCount: 3 },
  { key: "3", pointCount: 3 },
  { key: "4", pointCount: 3 },
  { key: "5", pointCount: 2 },
  { key: "6", pointCount: 3 },
] as const;

const SKILL_CATEGORY_COUNT = 5;
const EDUCATION_COUNT = 5;
const ROLE_COUNT = 5;

export async function LandingPage() {
  const tHome = await getTranslations("modules.landing.pages.home");
  const yearsOfExperience = getYearsOfExperience();

  const roles = Array.from({ length: ROLE_COUNT }, (_, i) =>
    tHome(`main.roles.${i}`),
  );

  const experience = EXPERIENCE_ITEMS.map(({ key, pointCount }) => ({
    title: tHome(`resume.experience.${key}.title`),
    company: tHome(`resume.experience.${key}.company`),
    period: tHome(`resume.experience.${key}.period`),
    points: Array.from({ length: pointCount }, (_, j) =>
      tHome(`resume.experience.${key}.points.${j}`),
    ),
  }));

  const skills = Array.from({ length: SKILL_CATEGORY_COUNT }, (_, i) => ({
    name: tHome(`resume.skills.${i}.name`),
    items: tHome(`resume.skills.${i}.items`),
  }));

  const education = Array.from({ length: EDUCATION_COUNT }, (_, i) => ({
    title: tHome(`resume.education.${i}.title`),
    institution: tHome(`resume.education.${i}.institution`),
    period: tHome(`resume.education.${i}.period`),
  }));

  return (
    <>
      <div className="flex flex-col gap-28 sm:gap-32">
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
              <p className="hero-entrance hero-entrance-delay-1 text-xs font-medium tracking-[0.28em] text-[var(--text-muted)] uppercase">
                {tHome("main.greeting")}
              </p>
              <h1 className="hero-entrance hero-entrance-delay-2 text-3xl leading-tight font-semibold text-[var(--text-primary)] sm:text-4xl lg:text-5xl lg:leading-[1.15]">
                {tHome("main.name")}
              </h1>
              <p className="hero-entrance hero-entrance-delay-3 text-xl text-[var(--text-muted)] sm:text-2xl">
                {tHome("main.rolePrefix")} <TypedText roles={roles} />
              </p>
              <p className="hero-entrance hero-entrance-delay-3 max-w-2xl text-base leading-relaxed text-[var(--text-muted)]">
                {tHome("main.bio", { yearsOfExperience })}
              </p>

              {/* Social Links */}
              <div className="hero-entrance hero-entrance-delay-4 space-y-3">
                <p className="text-sm font-medium text-[var(--text-muted)]">
                  {tHome("main.findMe")}
                </p>
                <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                  {SOCIAL_LINKS.map(({ key, href, icon: Icon }) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-panel flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
                    >
                      <Icon className="h-4 w-4" />
                      {tHome(`main.social.${key}`)}
                    </a>
                  ))}
                </div>
              </div>

              {/* Best Skills */}
              <div className="hero-entrance hero-entrance-delay-5 space-y-3">
                <p className="text-sm font-medium text-[var(--text-muted)]">
                  {tHome("main.bestSkills")}
                </p>
                <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                  {SKILL_ITEMS.map(({ key, icon: Icon }) => (
                    <span
                      key={key}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-highlight)] px-4 py-1.5 text-sm text-[var(--text-primary)]",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {tHome(`main.skills.${key}`)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <ScrollReveal>
          <section className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-[0.28em] text-[var(--text-muted)] uppercase">
                {tHome("services.eyebrow")}
              </p>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
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
              <p className="text-xs font-medium tracking-[0.28em] text-[var(--text-muted)] uppercase">
                {tHome("resume.eyebrow", { yearsOfExperience })}
              </p>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
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
