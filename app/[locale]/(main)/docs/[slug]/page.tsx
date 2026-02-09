import { getTranslations, setRequestLocale } from "next-intl/server";

import { DocPage } from "@/modules/docs/presentation/pages/doc/page";

const docSlugs = [
  "architecture",
  "coding-conventions",
  "development-guide",
  "firebase-integration",
  "testing-guide",
  "deployment",
];

export function generateStaticParams() {
  return docSlugs.map((slug) => ({ slug }));
}

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations(`modules.docs.pages.${slug}`);

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <DocPage slug={slug} />;
}
