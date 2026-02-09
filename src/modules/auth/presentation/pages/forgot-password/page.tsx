import { getTranslations } from "next-intl/server";

import { ForgotPasswordForm } from "./components/forgot-password-form";

export async function ForgotPasswordPage() {
  const tForgotPassword = await getTranslations(
    "modules.auth.pages.forgot-password",
  );

  return (
    <div className="space-y-6">
      <h1 className="mt-14 mb-6 text-4xl font-semibold text-[var(--text-primary)] sm:text-5xl">
        {tForgotPassword("title")}
      </h1>
      <ForgotPasswordForm />
    </div>
  );
}
