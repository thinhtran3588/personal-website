import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactPage } from "@/modules/landing-page/presentation/pages/contact/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("modules.contact.pages.contact");

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
  return <ContactPage />;
}
