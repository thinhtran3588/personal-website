import { getTranslations } from "next-intl/server";

import { BackToHomeButton } from "@/common/components/back-to-home-button";
import { ContactForm } from "@/modules/landing-page/presentation/pages/contact/components/contact-form";

const SUPPORT_EMAIL = "quangthinhtran3588@gmail.com";

export async function ContactPage() {
  const t = await getTranslations("modules.contact.pages.contact");

  return (
    <section className="content-panel rounded-[32px] px-8 py-12 sm:px-14">
      <h1 className="mt-3 text-4xl font-semibold text-[var(--text-primary)] sm:text-5xl">
        {t("title")}
      </h1>

      <p className="mt-4 max-w-2xl text-[var(--text-muted)]">
        {t("subtitle")}{" "}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="font-medium text-[var(--accent)] hover:underline"
        >
          {SUPPORT_EMAIL}
        </a>
        .
      </p>

      <div className="mt-10 max-w-2xl">
        <ContactForm />
      </div>

      <div className="mt-10 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-6">
        <p className="text-sm text-[var(--text-muted)]">
          {t("emailNote")}{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-medium text-[var(--accent)] hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </div>

      <div className="mt-12">
        <BackToHomeButton />
      </div>
    </section>
  );
}
