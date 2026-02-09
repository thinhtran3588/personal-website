import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProductsPage } from "@/modules/landing-page/presentation/pages/products/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("modules.landing.pages.products");

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
  return <ProductsPage />;
}
