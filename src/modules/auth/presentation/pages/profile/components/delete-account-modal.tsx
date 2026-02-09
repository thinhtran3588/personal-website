"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { DialogClose, Modal } from "@/common/components/modal";
import { useContainer } from "@/common/hooks/use-container";
import type { LogEventUseCase } from "@/modules/analytics/application/log-event-use-case";
import type { DeleteAccountUseCase } from "@/modules/auth/application/delete-account-use-case";
import { AuthType, type AuthErrorCode } from "@/modules/auth/domain/types";

const ERROR_KEY_MAP: Record<AuthErrorCode, string> = {
  "invalid-credentials": "invalidCredentials",
  "too-many-requests": "generic",
  "email-already-in-use": "generic",
  "requires-recent-login": "requiresRecentLogin",
  generic: "generic",
};

type DeleteAccountFormData = {
  confirmation: string;
  password: string | undefined;
};

type DeleteAccountModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  authType: AuthType;
  onSuccess?: () => void;
};

export function DeleteAccountModal({
  open,
  onOpenChange,
  userId,
  authType,
  onSuccess,
}: DeleteAccountModalProps) {
  const t = useTranslations("modules.auth.pages.profile.deleteAccount");
  const container = useContainer();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isEmail = authType === AuthType.Email;

  const deleteAccountSchema = useMemo(
    () =>
      z.object({
        confirmation: z
          .string()
          .min(1, t("validation.confirmationRequired"))
          .refine(
            (val) => val === "DELETE",
            t("validation.confirmationMismatch"),
          ),
        password: isEmail
          ? z.string().min(1, t("validation.passwordRequired"))
          : z.string().optional(),
      }),
    [t, isEmail],
  );

  const form = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { confirmation: "", password: "" },
  });

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setErrorMessage(null);
      form.reset();
    }
  }

  async function onSubmit(values: DeleteAccountFormData) {
    setErrorMessage(null);
    const useCase = container.resolve(
      "deleteAccountUseCase",
    ) as DeleteAccountUseCase;
    const result = await useCase.execute({
      userId,
      password: isEmail ? values.password : undefined,
    });
    if (result.success) {
      const logEventUseCase = container.resolve(
        "logEventUseCase",
      ) as LogEventUseCase;
      logEventUseCase.execute({ eventName: "account_deleted" });
      form.reset();
      onOpenChange(false);
      onSuccess?.();
      return;
    }
    const errorKey = ERROR_KEY_MAP[result.error as AuthErrorCode] ?? "generic";
    setErrorMessage(t(`errors.${errorKey}`));
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={t("title")}
      description={t("description")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("warning")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("inputPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isEmail ? (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("passwordLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("passwordPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
          {errorMessage ? (
            <p className="text-sm text-red-500" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="submit"
              variant="destructive"
              loading={form.formState.isSubmitting}
            >
              {t("confirmButton")}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                {t("cancelButton")}
              </Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
