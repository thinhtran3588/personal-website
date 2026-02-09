"use client";

import { useState } from "react";

import { cn } from "@/common/utils/cn";

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

type ResumeTabsProps = {
  tabs: {
    experience: string;
    skills: string;
    education: string;
  };
  experience: ExperienceItem[];
  skills: SkillCategory[];
  education: EducationItem[];
};

const TAB_KEYS = ["skills", "experience", "education"] as const;
type TabKey = (typeof TAB_KEYS)[number];

export function ResumeTabs({
  tabs,
  experience,
  skills,
  education,
}: ResumeTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("skills");

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={cn(
              "rounded-xl px-5 py-2.5 text-sm font-medium transition-all",
              activeTab === key
                ? "glass-panel-strong border border-[var(--accent)] text-[var(--accent)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
            )}
            onClick={() => setActiveTab(key)}
            aria-selected={activeTab === key}
            role="tab"
          >
            {tabs[key]}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {activeTab === "experience" && (
          <div className="space-y-6">
            {experience.map((item, index) => (
              <div
                key={index}
                className="border-l-2 border-[var(--accent)] pl-6"
              >
                <h4 className="text-base font-semibold text-[var(--text-primary)]">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm text-[var(--accent)]">
                  {item.company}
                </p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                  {item.period}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {item.points.map((point, pointIndex) => (
                    <li
                      key={pointIndex}
                      className="flex items-start gap-2 text-sm text-[var(--text-muted)]"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                        aria-hidden="true"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === "skills" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((category, index) => (
              <div
                key={index}
                className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-4"
              >
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  {category.name}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                  {category.items}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "education" && (
          <div className="space-y-6">
            {education.map((item, index) => (
              <div key={index} className="border-l-2 border-[var(--mint)] pl-6">
                <h4 className="text-base font-semibold text-[var(--text-primary)]">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm text-[var(--mint)]">
                  {item.institution}
                </p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                  {item.period}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
