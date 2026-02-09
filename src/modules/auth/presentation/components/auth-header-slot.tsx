"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/common/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/dropdown-menu";
import { useMobileMenu } from "@/common/contexts/mobile-menu-context";
import { useContainer } from "@/common/hooks/use-container";
import { Link } from "@/common/routing/navigation";
import { cn } from "@/common/utils/cn";
import type { SignOutUseCase } from "@/modules/auth/application/sign-out-use-case";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";

export function AuthHeaderSlot() {
  const t = useTranslations("common");
  const signInLabel = t("navigation.signIn");
  const profileLabel = t("navigation.profile");
  const signOutLabel = t("navigation.signOut");
  const container = useContainer();
  const user = useAuthUserStore((s) => s.user);
  const loading = useAuthUserStore((s) => s.loading);
  const isMobileMenu = useMobileMenu();

  async function handleSignOut() {
    const useCase = container.resolve("signOutUseCase") as SignOutUseCase;
    await useCase.execute({});
  }

  if (loading) {
    return (
      <div
        className="h-8 w-16 animate-pulse rounded-full bg-[var(--glass-highlight)] sm:h-8 sm:w-16"
        aria-busy="true"
        data-testid="auth-loading"
      />
    );
  }

  if (user) {
    if (isMobileMenu) {
      return (
        <div className="flex flex-col gap-2">
          <div
            className={cn(
              "rounded-full px-4 py-2 text-center text-sm font-medium",
              "bg-[var(--glass-highlight)] text-[var(--text-primary)]",
            )}
            data-testid="auth-user-name"
          >
            {user.displayName || user.email || signInLabel}
          </div>
          <div
            className={cn(
              "flex flex-col gap-0.5 rounded-xl border border-[var(--glass-border)] p-1",
            )}
          >
            <Link
              href="/profile"
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                "text-[var(--text-muted)] hover:bg-[var(--glass-highlight)] hover:text-[var(--text-primary)]",
              )}
            >
              {profileLabel}
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="justify-start rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--glass-highlight)] hover:text-[var(--text-primary)]"
              onClick={handleSignOut}
            >
              {signOutLabel}
            </Button>
          </div>
        </div>
      );
    }
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" size="sm" className="w-full sm:w-auto">
            {user.displayName || user.email || signInLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 sm:w-auto">
          <DropdownMenuItem asChild>
            <Link href="/profile">{profileLabel}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            {signOutLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button asChild variant="primary" size="sm">
      <Link href="/auth/sign-in">{signInLabel}</Link>
    </Button>
  );
}
