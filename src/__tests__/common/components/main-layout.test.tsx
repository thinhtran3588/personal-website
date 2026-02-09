import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import type { ResolvedMenuItem } from "@/common/interfaces";

const translations: Record<string, Record<string, string>> = {
  common: {
    "navigation.home": "Home",
    "navigation.signIn": "Sign in",
    "navigation.privacy": "Privacy",
    "navigation.terms": "Terms",
    "navigation.legal": "Legal",
    "navigation.documents": "Documents",
    "navigation.docs.architecture": "Architecture",
    "navigation.docs.developmentGuide": "Development guide",
    "navigation.docs.testingGuide": "Testing guide",
    "navigation.menu": "Menu",
    "footer.copyright": "© 2026 Test. All rights reserved.",
  },
  settings: {
    "language.label": "Language",
    "language.options.en": "English",
    "language.options.vi": "Vietnamese",
    "language.options.zh": "Chinese",
    "language.flags.en": "US",
    "language.flags.vi": "VN",
    "language.flags.zh": "CN",
    "theme.label": "Theme",
    "theme.options.system": "System",
    "theme.options.light": "Light",
    "theme.options.dark": "Dark",
  },
  "modules.landing.pages.home": {
    badge: "Liquid Badge",
  },
};

const menuItems: ResolvedMenuItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "app", label: "App", href: "/app/books" },
];

vi.mock("next-intl/server", () => ({
  getLocale: vi.fn().mockResolvedValue("en"),
  getTranslations: vi.fn((namespace: string) =>
    Promise.resolve((key: string) => translations[namespace]?.[key] ?? key),
  ),
}));

describe("MainLayout", () => {
  it("renders the layout shell and children", async () => {
    const { MainLayout } = await import("@/common/components/main-layout");

    render(
      await MainLayout({
        children: <div>Content</div>,
        menuItems,
        settingsSlot: (
          <span>{translations.settings["language.options.en"]}</span>
        ),
      }),
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(
      screen.getByText(translations["modules.landing.pages.home"].badge),
    ).toBeInTheDocument();
    expect(
      screen.getByText(translations.settings["language.options.en"]),
    ).toBeInTheDocument();
  });

  it("renders the footer with copyright", async () => {
    const { MainLayout } = await import("@/common/components/main-layout");

    render(
      await MainLayout({
        children: <div>Content</div>,
        menuItems,
      }),
    );

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(
      screen.getByText(translations.common["footer.copyright"]),
    ).toBeInTheDocument();
  });
});
