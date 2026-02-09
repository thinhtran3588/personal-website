"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/common/components/button";
import { ButtonGroup } from "@/common/components/button-group";
import { PencilIcon } from "@/common/components/icons";
import { useContainer } from "@/common/hooks/use-container";
import type { LogEventUseCase } from "@/modules/analytics/application/log-event-use-case";
import type { UpdateProfileUseCase } from "@/modules/auth/application/update-profile-use-case";
import type { ProfileInput } from "@/modules/auth/domain/schemas";
import { AuthType, type AuthErrorCode } from "@/modules/auth/domain/types";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";
import { ChangePasswordModal } from "./components/change-password-modal";
import { DeleteAccountModal } from "./components/delete-account-modal";
import { ProfileForm } from "./components/profile-form";

const ERROR_KEY_MAP: Record<AuthErrorCode, string> = {
  "invalid-credentials": "invalidCredentials",
  "too-many-requests": "tooManyRequests",
  "email-already-in-use": "emailAlreadyInUse",
  "requires-recent-login": "requiresRecentLogin",
  generic: "generic",
};

export function ProfilePage() {
  const t = useTranslations("modules.auth.pages.profile");
  const container = useContainer();
  const user = useAuthUserStore((s) => s.user);
  const loading = useAuthUserStore((s) => s.loading);
  const setAuthState = useAuthUserStore((s) => s.setAuthState);
  const [editing, setEditing] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  async function handleUpdate(values: ProfileInput) {
    if (
      values.displayName === undefined ||
      values.displayName === user?.displayName
    ) {
      setEditing(false);
      return;
    }
    const useCase = container.resolve(
      "updateProfileUseCase",
    ) as UpdateProfileUseCase;
    const result = await useCase.execute({
      displayName: values.displayName.trim(),
    });
    if (result.success) {
      const logEventUseCase = container.resolve(
        "logEventUseCase",
      ) as LogEventUseCase;
      logEventUseCase.execute({
        eventName: "profile_updated",
        params: { field: "display_name" },
      });
      toast.success(t("successMessage"));
      if (user) {
        setAuthState(
          { ...user, displayName: values.displayName.trim() },
          false,
        );
      }
      setEditing(false);
    } else {
      toast.error(t(`errors.${ERROR_KEY_MAP[result.error as AuthErrorCode]}`));
    }
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="title-accent-underline text-2xl font-semibold text-[var(--text-primary)]">
          {t("title")}
        </h1>
        <ProfileForm
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="title-accent-underline text-2xl font-semibold text-[var(--text-primary)]">
        {t("title")}
      </h1>
      <ProfileForm readonly />
      {user && !loading ? (
        <ButtonGroup>
          <Button
            type="button"
            variant="primary"
            onClick={() => setEditing(true)}
          >
            <PencilIcon className="size-4" />
            {t("editButton")}
          </Button>
          {user.authType === AuthType.Email ? (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPasswordModalOpen(true)}
              >
                {t("changePasswordButton")}
              </Button>
              <ChangePasswordModal
                open={passwordModalOpen}
                onOpenChange={setPasswordModalOpen}
                onSuccess={() => toast.success(t("passwordSuccessMessage"))}
              />
            </>
          ) : null}
          <Button
            type="button"
            variant="destructive"
            onClick={() => setDeleteModalOpen(true)}
          >
            {t("deleteAccount.button")}
          </Button>
          <DeleteAccountModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            userId={user.id}
            authType={user.authType}
            onSuccess={() => toast.success(t("deleteAccount.successMessage"))}
          />
        </ButtonGroup>
      ) : null}
    </div>
  );
}
