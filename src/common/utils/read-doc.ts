import type { Locale } from "@/common/routing/routing";
import architectureVi from "../../../docs/architecture-vi.md";
import architectureZh from "../../../docs/architecture-zh.md";
// Static imports bundle all docs at build time — works in both Node.js and Cloudflare Workers
import architecture from "../../../docs/architecture.md";
import codingConventionsVi from "../../../docs/coding-conventions-vi.md";
import codingConventionsZh from "../../../docs/coding-conventions-zh.md";
import codingConventions from "../../../docs/coding-conventions.md";
import deploymentVi from "../../../docs/deployment-vi.md";
import deploymentZh from "../../../docs/deployment-zh.md";
import deployment from "../../../docs/deployment.md";
import developmentGuideVi from "../../../docs/development-guide-vi.md";
import developmentGuideZh from "../../../docs/development-guide-zh.md";
import developmentGuide from "../../../docs/development-guide.md";
import firebaseIntegrationVi from "../../../docs/firebase-integration-vi.md";
import firebaseIntegrationZh from "../../../docs/firebase-integration-zh.md";
import firebaseIntegration from "../../../docs/firebase-integration.md";
import testingGuideVi from "../../../docs/testing-guide-vi.md";
import testingGuideZh from "../../../docs/testing-guide-zh.md";
import testingGuide from "../../../docs/testing-guide.md";

const docsContent: Record<string, string> = {
  architecture,
  "architecture-vi": architectureVi,
  "architecture-zh": architectureZh,
  "coding-conventions": codingConventions,
  "coding-conventions-vi": codingConventionsVi,
  "coding-conventions-zh": codingConventionsZh,
  deployment,
  "deployment-vi": deploymentVi,
  "deployment-zh": deploymentZh,
  "development-guide": developmentGuide,
  "development-guide-vi": developmentGuideVi,
  "development-guide-zh": developmentGuideZh,
  "firebase-integration": firebaseIntegration,
  "firebase-integration-vi": firebaseIntegrationVi,
  "firebase-integration-zh": firebaseIntegrationZh,
  "testing-guide": testingGuide,
  "testing-guide-vi": testingGuideVi,
  "testing-guide-zh": testingGuideZh,
};

function getDocBasename(slug: string, locale: Locale): string {
  if (locale === "en") {
    return slug;
  }
  return `${slug}-${locale}`;
}

export async function readDocContent(
  slug: string,
  locale: Locale,
): Promise<string | null> {
  const basename = getDocBasename(slug, locale);
  return docsContent[basename] ?? null;
}
