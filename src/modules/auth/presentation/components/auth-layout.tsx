import { BackToHomeButton } from "@/common/components/back-to-home-button";
import { LanguageSelector } from "@/modules/settings/presentation/components/language-selector";

type AuthLayoutProps = {
  children: React.ReactNode;
  showLanguageSelector?: boolean;
};

export async function AuthLayout({
  children,
  showLanguageSelector = true,
}: AuthLayoutProps) {
  return (
    <div className="blueprint-grid relative min-h-screen overflow-hidden">
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
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-20 sm:py-24">
        <div className="relative w-full max-w-xl">
          {showLanguageSelector ? (
            <div className="absolute top-5 right-5 z-20 min-h-[2.5rem] min-w-[5rem] sm:top-6 sm:right-6">
              <LanguageSelector />
            </div>
          ) : null}
          <main
            className="auth-center-area liquid-border glass-panel-strong relative w-full overflow-hidden rounded-2xl px-8 pt-14 pb-8 text-center sm:rounded-3xl sm:px-12 sm:pt-16 sm:pb-10"
            data-testid="auth-center-area"
          >
            <div className="relative z-10">{children}</div>
            <div className="relative z-10 mt-8 flex justify-center">
              <BackToHomeButton />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
