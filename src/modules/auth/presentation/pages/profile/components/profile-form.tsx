"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/common/components/button";
import { ButtonGroup } from "@/common/components/button-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/form";
import {
  AppleIcon,
  GoogleIcon,
  MailIcon,
  UserIcon,
} from "@/common/components/icons";
import { Input } from "@/common/components/input";
import {
  getProfileSchema,
  type ProfileInput,
} from "@/modules/auth/domain/schemas";
import { AuthType } from "@/modules/auth/domain/types";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";

const AUTH_TYPE_ICON: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  [AuthType.Email]: MailIcon,
  [AuthType.Google]: GoogleIcon,
  [AuthType.Apple]: AppleIcon,
  [AuthType.Other]: UserIcon,
};

type ProfileFormProps = {
  readonly?: boolean;
  onSubmit?: (values: ProfileInput) => Promise<void>;
  onCancel?: () => void;
};

export function ProfileForm({
  readonly = false,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  const t = useTranslations("modules.auth.pages.profile");
  const user = useAuthUserStore((s) => s.user);
  const loading = useAuthUserStore((s) => s.loading);

  const profileSchema = useMemo(
    () => getProfileSchema((key) => t(`validation.${key}`)),
    [t],
  );

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName ?? undefined,
    },
  });

  useEffect(() => {
    if (user?.displayName !== undefined) {
      form.reset({ displayName: user.displayName ?? "" });
    }
  }, [user?.displayName, form]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div
        className="h-32 animate-pulse rounded-lg bg-[var(--glass-highlight)]"
        aria-busy="true"
        data-testid="profile-loading"
      />
    );
  }

  async function handleSubmit(values: ProfileInput) {
    if (readonly || !onSubmit) return;
    await onSubmit(values);
  }

  function handleCancel() {
    form.reset({ displayName: user?.displayName ?? "" });
    onCancel?.();
  }

  const AuthIcon = AUTH_TYPE_ICON[user.authType] ?? UserIcon;

  return (
    <div className="space-y-4 text-left">
      <div>
        <p className="text-sm font-medium text-[var(--text-muted)]">
          {t("emailLabel")}
        </p>
        <p className="mt-1 flex items-center gap-2 text-[var(--text-primary)]">
          <span className="min-w-0 truncate">{user.email ?? "—"}</span>
          <span data-testid="profile-email-auth-icon" aria-hidden>
            <AuthIcon className="h-5 w-5 shrink-0 text-[var(--text-muted)]" />
          </span>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fullNameLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t("fullNameLabel")}
                    {...field}
                    value={field.value ?? ""}
                    readOnly={readonly}
                  />
                </FormControl>
                {!readonly && <FormMessage />}
              </FormItem>
            )}
          />
          {!readonly && (onSubmit ?? onCancel) && (
            <ButtonGroup>
              {onSubmit && (
                <Button
                  type="submit"
                  variant="primary"
                  loading={form.formState.isSubmitting}
                >
                  {t("saveButton")}
                </Button>
              )}
              {onCancel && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                >
                  {t("cancelButton")}
                </Button>
              )}
            </ButtonGroup>
          )}
        </form>
      </Form>
    </div>
  );
}
