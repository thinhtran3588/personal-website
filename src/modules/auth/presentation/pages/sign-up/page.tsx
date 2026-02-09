import { getTranslations } from "next-intl/server";

import { SignUpForm } from "./components/sign-up-form";

export async function SignUpPage() {
  const tSignUp = await getTranslations("modules.auth.pages.sign-up");

  return (
    <div className="space-y-6">
      <h1 className="mt-14 mb-6 text-4xl font-semibold text-[var(--text-primary)] sm:text-5xl">
        {tSignUp("title")}
      </h1>
      <SignUpForm />
    </div>
  );
}
