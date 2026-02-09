import { getTranslations } from "next-intl/server";

import { MainFooter } from "@/common/components/main-footer";
import { MainHeader } from "@/common/components/main-header";
import type { ResolvedMenuItem } from "@/common/interfaces";

const GITHUB_URL = "https://github.com/thinhtran3588";

type MainLayoutProps = {
  children: React.ReactNode;
  menuItems: ResolvedMenuItem[];
  settingsSlot?: React.ReactNode;
};

export async function MainLayout({
  children,
  menuItems,
  settingsSlot,
}: MainLayoutProps) {
  const [tCommon, tHome] = await Promise.all([
    getTranslations("common"),
    getTranslations("modules.landing.pages.home"),
  ]);

  return (
    <div className="blueprint-grid relative flex min-h-screen flex-col overflow-hidden">
      <div
        className="glow-orb top-[-10%] left-[-10%] h-[420px] w-[420px] bg-[var(--orb-1)]"
        aria-hidden
      />
      <div
        className="glow-orb glow-orb-2 top-[10%] right-[-15%] h-[380px] w-[380px] bg-[var(--orb-2)]"
        aria-hidden
      />
      <div
        className="glow-orb glow-orb-3 bottom-[-20%] left-[20%] h-[460px] w-[460px] bg-[var(--orb-3)]"
        aria-hidden
      />

      <MainHeader
        badge={tHome("badge")}
        menuItems={menuItems}
        menuLabel={tCommon("navigation.menu")}
        githubUrl={GITHUB_URL}
        settingsSlot={settingsSlot}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-24 px-6 pt-28 pb-24 sm:pt-24">
        {children}
      </main>

      <MainFooter copyright={tCommon("footer.copyright")} />
    </div>
  );
}
