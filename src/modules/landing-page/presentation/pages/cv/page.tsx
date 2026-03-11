import { getMessages, getTranslations } from "next-intl/server";

import { getYearsOfExperience } from "@/application/config/personal-info";
import { PrintButton } from "@/modules/landing-page/presentation/pages/cv/components/print-button";

type ExperienceItem = {
  title: string;
  company: string;
  period: string;
  points: string[];
};

type SkillCategory = {
  name: string;
  items: string;
};

type EducationItem = {
  title: string;
  institution: string;
  period: string;
};

type HomeMessages = {
  badge: string;
  resume: {
    headline: string;
    summary: string;
    linksLabel: string;
    bestSkillsLabel: string;
    links: Array<{ key: string; label: string; href: string }>;
    bestSkills: Array<{ key: string; label: string }>;
    experience: ExperienceItem[];
    skills: SkillCategory[];
    education: EducationItem[];
  };
};

export async function CvPage() {
  const tHome = await getTranslations("modules.landing.pages.home");
  const tCv = await getTranslations("modules.landing.pages.cv");
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

  const resume = homeMessages.resume;
  const cvLinks = resume.links.filter(({ key }) => key === "linkedin");
  const headline = resume.headline;
  const certifications = resume.education.filter((item) =>
    item.institution.includes("AWS"),
  );
  const formalEducation = resume.education.filter(
    (item) => !item.institution.includes("AWS"),
  );

  return (
    <section className="relative bg-slate-100 text-slate-900 print:bg-white">
      <div className="mx-auto max-w-[900px] px-4 py-8 print:max-w-none print:px-0 print:py-0">
        <div className="print:hidden">
          <PrintButton
            label={tCv("printButton")}
            className="fixed top-6 right-6 z-10"
          />
        </div>
        <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg lg:grid-cols-[240px_1fr] print:grid-cols-[200px_1fr] print:rounded-none print:border-0 print:shadow-none">
          {/* ── Sidebar ── */}
          <aside className="bg-slate-800 px-5 py-6 text-slate-200">
            <div className="space-y-5">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  {homeMessages.badge}
                </h1>
                <p className="mt-0.5 text-xs font-medium tracking-widest text-slate-400 uppercase">
                  {headline}
                </p>
              </div>

              {cvLinks.map(({ key, href, label }) => {
                const shortPath = new URL(href).pathname.replace(/^\/in\//, "");
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-slate-300 transition-colors hover:text-white"
                  >
                    {label}: {shortPath}
                  </a>
                );
              })}

              <div className="space-y-3">
                <p className="text-[0.65rem] font-bold tracking-[0.25em] text-slate-500 uppercase">
                  {tHome("resume.tabs.skills")}
                </p>
                <div className="space-y-2.5">
                  {resume.skills.map((skill) => (
                    <div key={skill.name}>
                      <p className="text-xs font-semibold text-slate-200">
                        {skill.name}
                      </p>
                      <p className="mt-0.5 text-[0.68rem] leading-snug text-slate-400">
                        {skill.items}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="px-6 py-6 print:px-4 print:py-2">
            {/* Summary */}
            <header className="border-b border-slate-200 pb-4">
              <h2 className="text-[0.65rem] font-bold tracking-[0.3em] text-slate-400 uppercase">
                {tCv("summaryTitle")}
              </h2>
              <p className="mt-2 text-[0.8rem] leading-relaxed text-slate-600">
                {tHome("resume.summary", { yearsOfExperience })}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {resume.bestSkills.map(({ key, label }) => (
                  <span
                    key={key}
                    className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[0.65rem] font-semibold text-white"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </header>

            <main className="mt-4 space-y-4">
              {/* Certifications */}
              <section>
                <h2 className="text-[0.65rem] font-bold tracking-[0.3em] text-slate-400 uppercase">
                  {tCv("certificationsTitle")}
                </h2>
                <div className="mt-2 space-y-1.5">
                  {certifications.map((item) => (
                    <div
                      key={`${item.institution}-${item.title}`}
                      className="flex items-baseline justify-between gap-4"
                    >
                      <p className="text-xs font-semibold text-slate-800">
                        {item.title}
                      </p>
                      <span className="shrink-0 text-[0.65rem] text-slate-400">
                        {item.period}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section>
                <h2 className="text-[0.65rem] font-bold tracking-[0.3em] text-slate-400 uppercase">
                  {tCv("educationTitle")}
                </h2>
                <div className="mt-2 space-y-1.5">
                  {formalEducation.map((item) => (
                    <div
                      key={`${item.institution}-${item.title}`}
                      className="flex items-baseline justify-between gap-4"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          {item.title}
                        </p>
                        <p className="text-[0.65rem] text-slate-500">
                          {item.institution}
                        </p>
                      </div>
                      <span className="shrink-0 text-[0.65rem] text-slate-400">
                        {item.period}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Experience */}
              <section>
                <h2 className="text-[0.65rem] font-bold tracking-[0.3em] text-slate-400 uppercase">
                  {tHome("resume.tabs.experience")}
                </h2>
                <div className="mt-3 space-y-4">
                  {resume.experience.map((item) => (
                    <article
                      key={`${item.company}-${item.title}`}
                      className="break-inside-avoid"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-xs font-bold tracking-wide text-slate-900 uppercase">
                          {item.company}
                        </h3>
                        <span className="text-[0.65rem] text-slate-400">
                          {item.period}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-500">
                        {item.title}
                      </p>
                      <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[0.75rem] leading-snug text-slate-600">
                        {item.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}
