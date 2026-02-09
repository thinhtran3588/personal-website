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

  it("getMainMenuConfig returns menu items with home, products, and contact", () => {
    const menu = getMainMenuConfig();
    expect(menu).toHaveLength(3);
    expect(menu[0]).toEqual({
      id: "home",
      translationKey: "navigation.home",
      href: "/",
    });
    expect(menu[1]).toEqual({
      id: "products",
      translationKey: "navigation.products",
      href: "/products",
    });
    expect(menu[2]).toEqual({
      id: "contact",
      translationKey: "navigation.contact",
      href: "/contact",
    });
  });
});
