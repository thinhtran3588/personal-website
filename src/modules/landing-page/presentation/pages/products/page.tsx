import { getTranslations } from "next-intl/server";

import { Card } from "@/common/components/card";

export async function ProductsPage() {
  const t = await getTranslations("modules.landing.pages.products");

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-[0.28em] text-[var(--text-muted)] uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
          {t("title")}
        </h1>
      </div>
      <Card
        variant="strong"
        className="bento-card flex flex-col items-center justify-center rounded-2xl px-8 py-16 text-center sm:rounded-3xl sm:px-12 sm:py-20"
      >
        <p className="text-lg font-medium text-[var(--text-primary)]">
          {t("comingSoon")}
        </p>
        <p className="mt-2 max-w-md text-sm text-[var(--text-muted)]">
          {t("comingSoonDescription")}
        </p>
      </Card>
    </section>
  );
}
