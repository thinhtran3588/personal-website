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
import { DialogClose, Modal } from "@/common/components/modal";
import { useContainer } from "@/common/hooks/use-container";
import type { LogEventUseCase } from "@/modules/analytics/application/log-event-use-case";
import type { UpdatePasswordUseCase } from "@/modules/auth/application/update-password-use-case";
import {
  getUpdatePasswordSchema,
  type UpdatePasswordInput,
} from "@/modules/auth/domain/schemas";
import type { AuthErrorCode } from "@/modules/auth/domain/types";

const ERROR_KEY_MAP: Record<AuthErrorCode, string> = {
  "invalid-credentials": "invalidCredentials",
  "too-many-requests": "tooManyRequests",
  "email-already-in-use": "emailAlreadyInUse",
  "requires-recent-login": "requiresRecentLogin",
  generic: "generic",
};

type ChangePasswordModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function ChangePasswordModal({
  open,
  onOpenChange,
  onSuccess,
}: ChangePasswordModalProps) {
  const t = useTranslations("modules.auth.pages.profile");
  const container = useContainer();
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const updatePasswordSchema = useMemo(
    () => getUpdatePasswordSchema((key) => t(`validation.${key}`)),
    [t],
  );

  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setErrorCode(null);
      form.reset();
    }
  }

  async function onSubmit(values: UpdatePasswordInput) {
    setErrorCode(null);
    const useCase = container.resolve(
      "updatePasswordUseCase",
    ) as UpdatePasswordUseCase;
    const result = await useCase.execute({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
    if (result.success) {
      const logEventUseCase = container.resolve(
        "logEventUseCase",
      ) as LogEventUseCase;
      logEventUseCase.execute({ eventName: "password_changed" });
      form.reset();
      onOpenChange(false);
      onSuccess?.();
      return;
    }
    setErrorCode(result.error);
  }

  const errorMessage =
    errorCode !== null
      ? t(`errors.${ERROR_KEY_MAP[errorCode as AuthErrorCode]}`)
      : null;

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={t("passwordSectionTitle")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("oldPasswordLabel")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("newPasswordLabel")}</FormLabel>
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
          {errorMessage ? (
            <p className="text-sm text-red-500" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="submit"
              variant="primary"
              loading={form.formState.isSubmitting}
            >
              {t("updatePasswordButton")}
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
