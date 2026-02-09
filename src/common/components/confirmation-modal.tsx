"use client";

import type { ReactNode } from "react";

import { Button } from "@/common/components/button";
import { ButtonGroup } from "@/common/components/button-group";
import { Modal } from "@/common/components/modal";

type ConfirmationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "primary" | "destructive" | "default";
  icon?: ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
};

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  icon,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const handleCancel = () => {
    onOpenChange(false);
    onCancel?.();
  };

  const handleConfirm = () => {
    onConfirm();
    // automated closing should be handled by the parent if async specific logic is needed,
    // but usually checking `open` prop is enough.
    // Ideally the parent controls `open` fully.
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      <ButtonGroup>
        <Button variant="outline" onClick={handleCancel}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={handleConfirm}>
          {icon}
          {confirmText}
        </Button>
      </ButtonGroup>
    </Modal>
  );
}
