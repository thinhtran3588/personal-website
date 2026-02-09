import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { SignInPage } from "@/modules/auth/presentation/pages/sign-in/page";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense>
      <SignInPage />
    </Suspense>
  );
}
