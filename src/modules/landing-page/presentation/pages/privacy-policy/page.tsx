import { getTranslations } from "next-intl/server";

import { BackToHomeButton } from "@/common/components/back-to-home-button";

export async function PrivacyPolicyPage() {
  const tPrivacyPolicy = await getTranslations(
    "modules.legal.pages.privacy-policy",
  );

  return (
    <section className="content-panel rounded-[32px] px-8 py-12 sm:px-14">
      <h1 className="mt-3 text-4xl font-semibold text-[var(--text-primary)] sm:text-5xl">
        {tPrivacyPolicy("title")}
      </h1>
      <p className="mt-4 text-sm text-[var(--text-muted)]">
        {tPrivacyPolicy("lastUpdated")}
      </p>

      <div className="mt-10 space-y-10 text-[var(--text-muted)]">
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tPrivacyPolicy("sections.overview.title")}
          </h2>
          <p>{tPrivacyPolicy("sections.overview.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tPrivacyPolicy("sections.collection.title")}
          </h2>
          <p>{tPrivacyPolicy("sections.collection.body")}</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>{tPrivacyPolicy("sections.collection.items.email")}</li>
            <li>{tPrivacyPolicy("sections.collection.items.displayName")}</li>
            <li>{tPrivacyPolicy("sections.collection.items.providerIds")}</li>
          </ul>
          <p className="pt-2">
            {tPrivacyPolicy("sections.collection.analyticsNote")}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tPrivacyPolicy("sections.usage.title")}
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>{tPrivacyPolicy("sections.usage.items.auth")}</li>
            <li>{tPrivacyPolicy("sections.usage.items.display")}</li>
            <li>{tPrivacyPolicy("sections.usage.items.improve")}</li>
          </ul>
          <p className="pt-2">{tPrivacyPolicy("sections.usage.note")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tPrivacyPolicy("sections.analytics.title")}
          </h2>
          <p>{tPrivacyPolicy("sections.analytics.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tPrivacyPolicy("sections.sharing.title")}
          </h2>
          <p>{tPrivacyPolicy("sections.sharing.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tPrivacyPolicy("sections.retention.title")}
          </h2>
          <p>{tPrivacyPolicy("sections.retention.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tPrivacyPolicy("sections.security.title")}
          </h2>
          <p>{tPrivacyPolicy("sections.security.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tPrivacyPolicy("sections.children.title")}
          </h2>
          <p>{tPrivacyPolicy("sections.children.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tPrivacyPolicy("sections.changes.title")}
          </h2>
          <p>{tPrivacyPolicy("sections.changes.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tPrivacyPolicy("sections.contact.title")}
          </h2>
          <p>{tPrivacyPolicy("sections.contact.body")}</p>
        </section>
      </div>

      <div className="mt-12">
        <BackToHomeButton />
      </div>
    </section>
  );
}
