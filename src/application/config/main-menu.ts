import type { MenuItem } from "@/common/interfaces";

export const DOC_SLUGS = [
  "architecture",
  "coding-conventions",
  "development-guide",
  "testing-guide",
  "firebase-integration",
  "deployment",
] as const;

export type DocSlug = (typeof DOC_SLUGS)[number];

export const DOC_I18N_KEYS: Record<DocSlug, string> = {
  architecture: "architecture",
  "coding-conventions": "codingConventions",
  "development-guide": "developmentGuide",
  "testing-guide": "testingGuide",
  "firebase-integration": "firebaseIntegration",
  deployment: "deployment",
};

export function getMainMenuConfig(): MenuItem[] {
  return [
    {
      id: "home",
      translationKey: "navigation.home",
      href: "/",
    },
    {
      id: "app",
      translationKey: "navigation.app",
      href: "/app/books",
    },
    {
      id: "documents",
      translationKey: "navigation.documents",
      href: "",
      children: DOC_SLUGS.map((slug) => ({
        id: slug,
        translationKey: `navigation.docs.${DOC_I18N_KEYS[slug]}`,
        href: `/docs/${slug}`,
      })),
    },
    {
      id: "contact",
      translationKey: "navigation.contact",
      href: "/contact",
    },
  ];
}
