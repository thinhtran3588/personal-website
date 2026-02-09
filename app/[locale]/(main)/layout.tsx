import { getTranslations, setRequestLocale } from "next-intl/server";

import { getMainMenuConfig } from "@/application/config/main-menu";
import { MainLayout } from "@/common/components/main-layout";
import { resolveMenuItems } from "@/common/utils/menu";
import { SettingsHeaderSlot } from "@/modules/settings/presentation/components/settings-header-slot";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tCommon = await getTranslations("common");
  const menuConfig = getMainMenuConfig();
  const menuItems = resolveMenuItems(menuConfig, (key) => tCommon(key));

  return (
    <MainLayout menuItems={menuItems} settingsSlot={<SettingsHeaderSlot />}>
      {children}
    </MainLayout>
  );
}
