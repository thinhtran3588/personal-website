import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProfilePage } from "@/modules/auth/presentation/pages/profile/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("modules.auth.pages.profile");

  return {
    title: t("title"),
    description: t("metadata.description"),
  };
}

export default async function ProfileRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProfilePage />;
}
