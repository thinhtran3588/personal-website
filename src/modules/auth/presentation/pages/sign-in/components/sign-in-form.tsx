"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/common/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/form";
import { GoogleIcon, MailIcon } from "@/common/components/icons";
import { Input } from "@/common/components/input";
import { useContainer } from "@/common/hooks/use-container";
import { Link, useRouter } from "@/common/routing/navigation";
import type { SignInWithEmailUseCase } from "@/modules/auth/application/sign-in-with-email-use-case";
import type { SignInWithGoogleUseCase } from "@/modules/auth/application/sign-in-with-google-use-case";
import {
  getSignInSchema,
  type SignInInput,
} from "@/modules/auth/domain/schemas";
import type { AuthErrorCode } from "@/modules/auth/domain/types";

const ERROR_KEY_MAP: Record<AuthErrorCode, string> = {
  "invalid-credentials": "invalidCredentials",
  "too-many-requests": "tooManyRequests",
  "email-already-in-use": "emailAlreadyInUse",
  "requires-recent-login": "generic",
  generic: "generic",
};

export function SignInForm() {
  const t = useTranslations("modules.auth.pages.sign-in");
  const tCommon = useTranslations("common.navigation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const container = useContainer();
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const returnUrl = searchParams.get("returnUrl") ?? "/";

  const signInSchema = useMemo(
    () => getSignInSchema((key) => t(`validation.${key}`)),
    [t],
  );

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onGoogleSignIn() {
    setGoogleLoading(true);
    setErrorCode(null);
    const useCase = container.resolve(
      "signInWithGoogleUseCase",
    ) as SignInWithGoogleUseCase;
    const result = await useCase.execute({});
    setGoogleLoading(false);
    if (result.success) {
      router.replace(returnUrl);
      return;
    }
    setErrorCode(result.error);
  }

  async function onSubmit(values: SignInInput) {
    setErrorCode(null);
    const useCase = container.resolve(
      "signInWithEmailUseCase",
    ) as SignInWithEmailUseCase;
    const result = await useCase.execute({
      email: values.email,
      password: values.password,
    });
    if (result.success) {
      router.replace(returnUrl);
      return;
    }
    setErrorCode(result.error);
  }

  const errorMessage =
    errorCode !== null
      ? t(`errors.${ERROR_KEY_MAP[errorCode as AuthErrorCode]}`)
      : null;

  return (
    <div className="space-y-6 text-left">
      <p className="text-center text-sm text-[var(--text-muted)]">
        {t.rich("agreeToPolicyAndTerms", {
          privacy: (
            <Link
              key="privacy"
              href="/privacy-policy"
              className="text-[var(--accent)] hover:underline"
            >
              {tCommon("privacy")}
            </Link>
          ) as unknown as string,
          terms: (
            <Link
              key="terms"
              href="/terms-of-service"
              className="text-[var(--accent)] hover:underline"
            >
              {tCommon("terms")}
            </Link>
          ) as unknown as string,
        })}
      </p>
      <Button
        type="button"
        variant="default"
        size="lg"
        className="w-full"
        onClick={onGoogleSignIn}
        loading={googleLoading}
      >
        <GoogleIcon className="size-5 shrink-0" />
        {t("googleButton")}
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[var(--glass-border)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent px-2 text-[var(--text-muted)]">
            {t("or")}
          </span>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("emailLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("passwordLabel")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-3">
            {errorMessage ? (
              <p className="text-sm text-red-500" role="alert">
                {errorMessage}
              </p>
            ) : null}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={form.formState.isSubmitting}
            >
              <MailIcon className="size-5 shrink-0" />
              {t("submitButton")}
            </Button>
            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[var(--accent)] hover:underline"
              >
                {t("forgotPasswordLink")}
              </Link>
            </div>
          </div>
        </form>
      </Form>
      <p className="text-center text-sm text-[var(--text-muted)]">
        {t("noAccountPrompt")}{" "}
        <Link
          href={
            returnUrl !== "/"
              ? `/auth/sign-up?returnUrl=${encodeURIComponent(returnUrl)}`
              : "/auth/sign-up"
          }
          className="text-[var(--accent)] hover:underline"
        >
          {t("signUpLink")}
        </Link>
      </p>
    </div>
  );
}
