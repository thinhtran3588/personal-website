import { getTranslations } from "next-intl/server";

import { Button } from "@/common/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/card";
import { Link } from "@/common/routing/navigation";
import { cn } from "@/common/utils/cn";
import { ScrollReveal } from "./components/scroll-reveal";

export async function LandingPage() {
  const tCommon = await getTranslations("common");
  const tHome = await getTranslations("modules.landing.pages.home");

  const featureKeys = [
    "cleanArchitecture",
    "modularStructure",
    "testCoverage",
    "i18nReady",
    "typeSafeForms",
    "firebaseIntegration",
  ] as const;

  const architectureLayerKeys = [
    "domain",
    "application",
    "infrastructure",
    "presentation",
  ] as const;

  const techStackKeys = [
    "nextjs",
    "react",
    "typescript",
    "tailwind",
    "radix",
    "rhf",
    "zod",
    "zustand",
    "nextIntl",
    "firebase",
    "awilix",
    "vitest",
  ] as const;

  return (
    <>
      <div className="flex flex-col gap-28 sm:gap-32">
        {/* Hero Section */}
        <section className="hero-shine glass-panel-strong liquid-border rounded-2xl px-8 py-14 sm:rounded-3xl sm:px-12 sm:py-20">
          <div className="relative z-10 flex flex-col items-center gap-12 text-center lg:gap-16">
            <div className="max-w-2xl space-y-6">
              <p className="hero-entrance hero-entrance-delay-1 text-xs font-medium tracking-[0.28em] text-[var(--text-muted)] uppercase">
                {tHome("hero.eyebrow")}
              </p>
              <h1 className="hero-entrance hero-entrance-delay-2 text-3xl leading-tight font-semibold text-[var(--text-primary)] sm:text-4xl lg:text-5xl lg:leading-[1.15]">
                {tHome("hero.title")}
              </h1>
              <p className="hero-entrance hero-entrance-delay-3 text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
                {tHome("hero.subtitle")}
              </p>
              <div className="hero-entrance hero-entrance-delay-4 flex flex-wrap justify-center gap-3">
                <Button asChild variant="primary" className="min-w-[140px]">
                  <Link href="/app">{tCommon("navigation.goToApp")}</Link>
                </Button>
                <Button asChild variant="secondary" className="min-w-[140px]">
                  <Link href="/auth/sign-up">
                    {tCommon("navigation.createAccount")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <ScrollReveal>
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
                {tHome("features.title")}
              </h2>
              <p className="max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
                {tHome("features.description")}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {featureKeys.map((key) => (
                <Card key={key} className="bento-card px-6 py-6 sm:rounded-2xl">
                  <CardHeader className="space-y-0 pb-0">
                    <CardTitle>
                      {tHome(`features.items.${key}.title`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <CardDescription>
                      {tHome(`features.items.${key}.description`)}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Clean Architecture Section */}
        <ScrollReveal>
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
                {tHome("architecture.title")}
              </h2>
              <p className="max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
                {tHome("architecture.description")}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {architectureLayerKeys.map((key, index) => (
                <Card
                  key={key}
                  className={cn(
                    "bento-card px-6 py-6 sm:rounded-2xl",
                    index === 0 && "border-l-2 border-l-green-500",
                    index === 1 && "border-l-2 border-l-orange-500",
                    index === 2 && "border-l-2 border-l-pink-500",
                    index === 3 && "border-l-2 border-l-blue-500",
                  )}
                >
                  <CardHeader className="space-y-0 pb-0">
                    <CardTitle className="text-base">
                      {tHome(`architecture.layers.${key}.title`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <CardDescription className="text-xs leading-relaxed">
                      {tHome(`architecture.layers.${key}.description`)}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Tech Stack Section */}
        <ScrollReveal>
          <Card
            variant="strong"
            className="bento-card rounded-2xl px-8 py-10 sm:rounded-3xl sm:px-12 sm:py-14"
          >
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
              {tHome("techStack.title")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
              {tHome("techStack.description")}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {techStackKeys.map((key) => (
                <div
                  key={key}
                  className="flex items-start gap-3 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-4"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--surface)] text-xs text-[var(--text-primary)]"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {tHome(`techStack.items.${key}.name`)}
                    </p>
                    <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                      {tHome(`techStack.items.${key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </ScrollReveal>

        {/* Getting Started Section */}
        <ScrollReveal>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="space-y-4 lg:col-span-5">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
                {tHome("gettingStarted.title")}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                {tHome("gettingStarted.description")}
              </p>
            </div>
            <div className="space-y-3 lg:col-span-7">
              <code className="block rounded-xl border border-[var(--glass-border)] bg-[var(--code-bg)] px-4 py-3 font-mono text-sm text-[var(--text-primary)]">
                {tHome("gettingStarted.steps.install")}
              </code>
              <code className="block rounded-xl border border-[var(--glass-border)] bg-[var(--code-bg)] px-4 py-3 font-mono text-sm text-[var(--text-primary)]">
                {tHome("gettingStarted.steps.dev")}
              </code>
              <code className="block rounded-xl border border-[var(--glass-border)] bg-[var(--code-bg)] px-4 py-3 font-mono text-sm text-[var(--text-primary)]">
                {tHome("gettingStarted.steps.validate")}
              </code>
            </div>
          </div>
        </ScrollReveal>

        {/* Documentation Section */}
        <ScrollReveal>
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
                {tHome("docs.title")}
              </h2>
              <p className="max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
                {tHome("docs.description")}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
              {[
                {
                  key: "architecture",
                  href: "/docs/architecture",
                  titleKey: "docs.items.architecture.title",
                  descKey: "docs.items.architecture.description",
                  span: "lg:col-span-6",
                },
                {
                  key: "codingConventions",
                  href: "/docs/coding-conventions",
                  titleKey: "docs.items.codingConventions.title",
                  descKey: "docs.items.codingConventions.description",
                  span: "lg:col-span-6",
                },
                {
                  key: "development",
                  href: "/docs/development-guide",
                  titleKey: "docs.items.development.title",
                  descKey: "docs.items.development.description",
                  span: "lg:col-span-4",
                },
                {
                  key: "testing",
                  href: "/docs/testing-guide",
                  titleKey: "docs.items.testing.title",
                  descKey: "docs.items.testing.description",
                  span: "lg:col-span-4",
                },
                {
                  key: "firebase",
                  href: "/docs/firebase-integration",
                  titleKey: "docs.items.firebase.title",
                  descKey: "docs.items.firebase.description",
                  span: "lg:col-span-4",
                },
                {
                  key: "deployment",
                  href: "/docs/deployment",
                  titleKey: "docs.items.deployment.title",
                  descKey: "docs.items.deployment.description",
                  span: "lg:col-span-4",
                },
              ].map(({ key: itemKey, href, titleKey, descKey, span }) => (
                <Link key={itemKey} href={href} className={span}>
                  <Card className="bento-card h-full px-6 py-6 transition-colors hover:bg-[var(--glass-highlight)] sm:rounded-2xl">
                    <CardHeader className="space-y-0 pb-0">
                      <CardTitle>{tHome(titleKey)}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3">
                      <CardDescription>{tHome(descKey)}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </>
  );
}
