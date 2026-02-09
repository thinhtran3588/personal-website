import { getTranslations, setRequestLocale } from "next-intl/server";

import { TermsOfServicePage } from "@/modules/landing-page/presentation/pages/terms-of-service/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("modules.legal.pages.terms-of-service");

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
  return <TermsOfServicePage />;
}
