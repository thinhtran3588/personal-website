import { getTranslations } from "next-intl/server";

import { BackToHomeButton } from "@/common/components/back-to-home-button";

export async function TermsOfServicePage() {
  const tTermsOfService = await getTranslations(
    "modules.legal.pages.terms-of-service",
  );

  return (
    <section className="content-panel rounded-[32px] px-8 py-12 sm:px-14">
      <h1 className="mt-3 text-4xl font-semibold text-[var(--text-primary)] sm:text-5xl">
        {tTermsOfService("title")}
      </h1>
      <p className="mt-4 text-sm text-[var(--text-muted)]">
        {tTermsOfService("lastUpdated")}
      </p>

      <div className="mt-10 space-y-10 text-[var(--text-muted)]">
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tTermsOfService("sections.overview.title")}
          </h2>
          <p>{tTermsOfService("sections.overview.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tTermsOfService("sections.acceptance.title")}
          </h2>
          <p>{tTermsOfService("sections.acceptance.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tTermsOfService("sections.accounts.title")}
          </h2>
          <p>{tTermsOfService("sections.accounts.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tTermsOfService("sections.acceptableUse.title")}
          </h2>
          <p>{tTermsOfService("sections.acceptableUse.body")}</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>{tTermsOfService("sections.acceptableUse.items.unlawful")}</li>
            <li>{tTermsOfService("sections.acceptableUse.items.access")}</li>
            <li>
              {tTermsOfService("sections.acceptableUse.items.interference")}
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tTermsOfService("sections.thirdParty.title")}
          </h2>
          <p>{tTermsOfService("sections.thirdParty.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tTermsOfService("sections.starterKit.title")}
          </h2>
          <p>{tTermsOfService("sections.starterKit.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tTermsOfService("sections.termination.title")}
          </h2>
          <p>{tTermsOfService("sections.termination.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tTermsOfService("sections.disclaimers.title")}
          </h2>
          <p>{tTermsOfService("sections.disclaimers.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tTermsOfService("sections.liability.title")}
          </h2>
          <p>{tTermsOfService("sections.liability.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tTermsOfService("sections.changes.title")}
          </h2>
          <p>{tTermsOfService("sections.changes.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {tTermsOfService("sections.contact.title")}
          </h2>
          <p>{tTermsOfService("sections.contact.body")}</p>
        </section>
      </div>

      <div className="mt-12">
        <BackToHomeButton />
      </div>
    </section>
  );
}
