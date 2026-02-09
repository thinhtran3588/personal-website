import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { SignUpPage } from "@/modules/auth/presentation/pages/sign-up/page";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense>
      <SignUpPage />
    </Suspense>
  );
}
