import { getTranslations } from "next-intl/server";

import { SignInForm } from "./components/sign-in-form";

export async function SignInPage() {
  const tSignIn = await getTranslations("modules.auth.pages.sign-in");

  return (
    <div className="space-y-6">
      <h1 className="mt-14 mb-6 text-4xl font-semibold text-[var(--text-primary)] sm:text-5xl">
        {tSignIn("title")}
      </h1>
      <SignInForm />
    </div>
  );
}
