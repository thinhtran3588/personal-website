import { BackToHomeButton } from "@/common/components/back-to-home-button";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Locale } from "@/common/routing/routing";
import { isSupportedLocale } from "@/common/routing/routing";
import { readDocContent } from "@/common/utils/read-doc";
import { MarkdownContent } from "@/modules/docs/presentation/components/markdown-content";

type DocPageProps = {
  slug: string;
};

export async function DocPage({ slug }: DocPageProps) {
  const locale = (await getLocale()) as Locale;
  if (!isSupportedLocale(locale)) {
    notFound();
  }
  const content = await readDocContent(slug, locale);
  if (content === null) {
    notFound();
  }

  return (
    <section className="content-panel rounded-[32px] px-8 py-12 sm:px-14">
      <div className="mt-3">
        <MarkdownContent content={content} />
      </div>
      <div className="mt-12">
        <BackToHomeButton />
      </div>
    </section>
  );
}
