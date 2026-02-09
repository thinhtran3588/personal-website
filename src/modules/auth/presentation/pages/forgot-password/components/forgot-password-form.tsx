"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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
import { Link } from "@/common/routing/navigation";
import type { SendPasswordResetUseCase } from "@/modules/auth/application/send-password-reset-use-case";
import {
  getForgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/modules/auth/domain/schemas";

export function ForgotPasswordForm() {
  const t = useTranslations("modules.auth.pages.forgot-password");
  const container = useContainer();
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const forgotPasswordSchema = useMemo(
    () => getForgotPasswordSchema((key) => t(`validation.${key}`)),
    [t],
  );

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    setErrorCode(null);
    setSuccess(false);
    const useCase = container.resolve(
      "sendPasswordResetUseCase",
    ) as SendPasswordResetUseCase;
    const result = await useCase.execute({ email: values.email });
    if (result.success) {
      setSuccess(true);
      return;
    }
    setErrorCode(result.error);
  }

  const errorMessage = errorCode !== null ? t("errors.generic") : null;

  if (success) {
    return (
      <div className="space-y-4 text-left">
        <p className="text-sm text-[var(--text-primary)]">
          {t("successMessage")}
        </p>
        <Button asChild variant="default" size="sm">
          <Link href="/auth/sign-in">{t("backToSignIn")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
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
        <Link
          href="/auth/sign-in"
          className="text-[var(--accent)] hover:underline"
        >
          {t("backToSignIn")}
        </Link>
      </p>
    </div>
  );
}
