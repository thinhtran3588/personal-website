import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { BookDetailClient } from "./book-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("modules.books.pages.detail");

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
  return (
    <Suspense>
      <BookDetailClient />
    </Suspense>
  );
}
