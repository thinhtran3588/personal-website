"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/common/components/button";
import { ErrorPageView } from "@/common/components/error-page-view";
import { Link } from "@/common/routing/navigation";

type ErrorPageProps = {
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  const t = useTranslations("common.errors.serverError");

  return (
    <ErrorPageView
      eyebrow={t("eyebrow")}
      errorCode="500"
      title={t("title")}
      description={t("description")}
      primaryAction={
        <Button onClick={reset} variant="primary">
          {t("tryAgain")}
        </Button>
      }
      secondaryAction={
        <Button asChild variant="secondary">
          <Link href="/">{t("cta")}</Link>
        </Button>
      }
    />
  );
}
