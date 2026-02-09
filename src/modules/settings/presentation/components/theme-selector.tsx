"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/common/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/dropdown-menu";
import {
  ChevronDownIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from "@/common/components/icons";
import type { Theme } from "@/common/utils/theme";
import { useUserSettings } from "@/modules/settings/presentation/hooks/use-user-settings-store";

const DEFAULT_THEME: Theme = "system";

const themeIcons: Record<Theme, React.ComponentType<{ className?: string }>> = {
  system: MonitorIcon,
  light: SunIcon,
  dark: MoonIcon,
};

export function ThemeSelector() {
  const t = useTranslations("settings");
  const { settings, persistTheme } = useUserSettings();
  const theme = (settings.theme ?? DEFAULT_THEME) as Theme;

  const themeLabel = t("theme.label");
  const themeOptions: { theme: Theme; label: string }[] = [
    { theme: "system", label: t("theme.options.system") },
    { theme: "light", label: t("theme.options.light") },
    { theme: "dark", label: t("theme.options.dark") },
  ];

  const currentOption = themeOptions.find((option) => option.theme === theme);
  const CurrentIcon = themeIcons[theme] ?? MonitorIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-2 px-2 sm:px-3"
          aria-label={`${themeLabel}: ${currentOption?.label ?? ""}`}
        >
          <CurrentIcon className="h-3.5 w-3.5" />
          <ChevronDownIcon className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-label={themeLabel}>
        {themeOptions.map((option) => {
          const Icon = themeIcons[option.theme];
          const isActive = option.theme === theme;

          return (
            <DropdownMenuItem
              key={option.theme}
              className={isActive ? "bg-[var(--glass-highlight)]" : ""}
              onClick={() => persistTheme(option.theme)}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{option.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
