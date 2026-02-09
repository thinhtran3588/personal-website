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
import { Input } from "@/common/components/input";
import { useContainer } from "@/common/hooks/use-container";
import { Link, useRouter } from "@/common/routing/navigation";
import type { SignUpWithEmailUseCase } from "@/modules/auth/application/sign-up-with-email-use-case";
import {
  getSignUpSchema,
  type SignUpInput,
} from "@/modules/auth/domain/schemas";
import type { AuthErrorCode } from "@/modules/auth/domain/types";

const ERROR_KEY_MAP: Record<AuthErrorCode, string> = {
  "invalid-credentials": "invalidCredentials",
  "too-many-requests": "tooManyRequests",
  "email-already-in-use": "emailAlreadyInUse",
  "requires-recent-login": "generic",
  generic: "generic",
};

export function SignUpForm() {
  const t = useTranslations("modules.auth.pages.sign-up");
  const tCommon = useTranslations("common.navigation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const container = useContainer();
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const returnUrl = searchParams.get("returnUrl") ?? "/";

  const signUpSchema = useMemo(
    () => getSignUpSchema((key) => t(`validation.${key}`)),
    [t],
  );

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  async function onSubmit(values: SignUpInput) {
    setErrorCode(null);
    const useCase = container.resolve(
      "signUpWithEmailUseCase",
    ) as SignUpWithEmailUseCase;
    const result = await useCase.execute({
      email: values.email,
      password: values.password,
      displayName: values.fullName,
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("confirmPasswordLabel")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fullNameLabel")}</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            {t("submitButton")}
          </Button>
        </form>
      </Form>
      <p className="text-center text-sm text-[var(--text-muted)]">
        {t("hasAccountPrompt")}{" "}
        <Link
          href={
            returnUrl !== "/"
              ? `/auth/sign-in?returnUrl=${encodeURIComponent(returnUrl)}`
              : "/auth/sign-in"
          }
          className="text-[var(--accent)] hover:underline"
        >
          {t("signInLink")}
        </Link>
      </p>
    </div>
  );
}
