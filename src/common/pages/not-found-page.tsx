"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/common/components/button";
import { ErrorPageView } from "@/common/components/error-page-view";
import { Link } from "@/common/routing/navigation";

export default function NotFoundPage() {
  const t = useTranslations("common.errors.notFound");

  return (
    <ErrorPageView
      eyebrow={t("eyebrow")}
      errorCode="404"
      title={t("title")}
      description={t("description")}
      primaryAction={
        <Button asChild variant="primary">
          <Link href="/">{t("cta")}</Link>
        </Button>
      }
    />
  );
}
