import { getTranslations, setRequestLocale } from "next-intl/server";

import { CvPage } from "@/modules/landing-page/presentation/pages/cv/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("modules.landing.pages.cv");

  return {
    title: t("title"),
    description: t("metadata.description"),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CvPage />;
}
