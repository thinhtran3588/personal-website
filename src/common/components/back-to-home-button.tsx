"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/common/components/button";
import { BackArrowIcon } from "@/common/components/icons";
import { Link } from "@/common/routing/navigation";

export function BackToHomeButton() {
  const t = useTranslations("common.navigation");

  return (
    <Button asChild variant="secondary" size="sm">
      <Link href="/" className="inline-flex items-center gap-2">
        <BackArrowIcon className="size-4 shrink-0" />
        {t("backToHome")}
      </Link>
    </Button>
  );
}
