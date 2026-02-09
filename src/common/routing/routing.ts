import { defineRouting } from "next-intl/routing";

const supportedLocales = ["en", "vi", "zh"] as const;

export const routing = defineRouting({
  locales: supportedLocales,
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];

export const isSupportedLocale = (locale?: string): locale is Locale =>
  Boolean(locale) &&
  routing.locales.includes(locale as (typeof routing.locales)[number]);
