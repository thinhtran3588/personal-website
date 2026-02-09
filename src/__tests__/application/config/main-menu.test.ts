import { describe, expect, it } from "vitest";

import {
  DOC_I18N_KEYS,
  DOC_SLUGS,
  getMainMenuConfig,
  type DocSlug,
} from "@/application/config/main-menu";

describe("main-menu", () => {
  it("exports expected doc slugs", () => {
    expect(DOC_SLUGS).toEqual([
      "architecture",
      "coding-conventions",
      "development-guide",
      "testing-guide",
      "firebase-integration",
      "deployment",
    ]);
  });

  it("DOC_I18N_KEYS maps each slug to an i18n key", () => {
    expect(DOC_I18N_KEYS).toEqual({
      architecture: "architecture",
      "coding-conventions": "codingConventions",
      "development-guide": "developmentGuide",
      "testing-guide": "testingGuide",
      "firebase-integration": "firebaseIntegration",
      deployment: "deployment",
    });
  });

  it("getMainMenuConfig returns menu items with home, app, documents, and contact", () => {
    const menu = getMainMenuConfig();
    expect(menu).toHaveLength(4);
    expect(menu[0]).toEqual({
      id: "home",
      translationKey: "navigation.home",
      href: "/",
    });
    expect(menu[1]).toEqual({
      id: "app",
      translationKey: "navigation.app",
      href: "/app/books",
    });
    expect(menu[2].id).toBe("documents");
    expect(menu[2].translationKey).toBe("navigation.documents");
    expect(menu[2].href).toBe("");
    expect(menu[2].children).toHaveLength(6);
    const docSlugs = menu[2].children!.map((c) => c.id) as DocSlug[];
    expect(docSlugs).toEqual(DOC_SLUGS);
    expect(menu[2].children!.map((c) => c.href)).toEqual([
      "/docs/architecture",
      "/docs/coding-conventions",
      "/docs/development-guide",
      "/docs/testing-guide",
      "/docs/firebase-integration",
      "/docs/deployment",
    ]);
    expect(menu[3]).toEqual({
      id: "contact",
      translationKey: "navigation.contact",
      href: "/contact",
    });
  });
});
