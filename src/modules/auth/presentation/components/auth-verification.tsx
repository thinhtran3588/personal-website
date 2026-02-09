"use client";

import { useEffect } from "react";

import { LoaderIcon } from "@/common/components/icons";
import { usePathname, useRouter } from "@/common/routing/navigation";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";

type AuthVerificationProps = {
  children: React.ReactNode;
  signInPath?: string;
};

export function AuthVerification({
  children,
  signInPath = "/auth/sign-in",
}: AuthVerificationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthUserStore((s) => s.user);
  const loading = useAuthUserStore((s) => s.loading);

  useEffect(() => {
    if (!loading && !user) {
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`${signInPath}?returnUrl=${returnUrl}`);
    }
  }, [loading, user, router, signInPath, pathname]);

  if (loading) {
    return (
      <div
        className="flex h-32 items-center justify-center"
        aria-busy="true"
        data-testid="auth-verification-loading"
      >
        <LoaderIcon className="h-8 w-8 animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
