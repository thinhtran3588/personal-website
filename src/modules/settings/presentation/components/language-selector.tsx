"use client";

import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/common/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/dropdown-menu";
import { ChevronDownIcon } from "@/common/components/icons";
import { Link, usePathname } from "@/common/routing/navigation";
import { routing } from "@/common/routing/routing";
import { useUserSettings } from "@/modules/settings/presentation/hooks/use-user-settings-store";

export function LanguageSelector() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const { persistLocale } = useUserSettings();
  const pathname = usePathname();

  const languageLabel = t("language.label");
  const localeOptions = routing.locales.map((targetLocale) => ({
    locale: targetLocale,
    label: t(`language.options.${targetLocale}`),
    flag: t(`language.flags.${targetLocale}`),
  }));

  const currentLocaleOption = localeOptions.find(
    (option) => option.locale === locale,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-2 px-2 sm:px-3"
          aria-label={`${languageLabel}: ${currentLocaleOption?.label ?? ""}`}
        >
          <span className="text-sm">{currentLocaleOption?.flag}</span>
          <span className="hidden sm:inline">{currentLocaleOption?.label}</span>
          <ChevronDownIcon className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-label={languageLabel}>
        {localeOptions.map((option) => (
          <DropdownMenuItem asChild key={option.locale}>
            <Link
              href={pathname}
              locale={option.locale}
              className="flex items-center gap-2"
              onClick={() => persistLocale(option.locale)}
            >
              <span className="text-sm">{option.flag}</span>
              <span>{option.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
