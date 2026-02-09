"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/common/components/dialog";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={description ? undefined : undefined}
        className="modal-panel glass-panel-strong flex max-h-[90vh] flex-col"
      >
        <DialogHeader className="modal-header">
          <DialogTitle className="modal-header-title">{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="modal-body">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export { DialogClose };
