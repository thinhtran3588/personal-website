"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/common/components/button";
import { ButtonGroup } from "@/common/components/button-group";
import { ConfirmationModal } from "@/common/components/confirmation-modal";
import {
  BackArrowIcon,
  LoaderIcon,
  PencilIcon,
  TrashIcon,
} from "@/common/components/icons";
import { useContainer } from "@/common/hooks/use-container";
import { Link, useRouter } from "@/common/routing/navigation";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";
import type { DeleteBookUseCase } from "@/modules/books/application/delete-book-use-case";
import type { GetBookUseCase } from "@/modules/books/application/get-book-use-case";
import type { UpdateBookUseCase } from "@/modules/books/application/update-book-use-case";
import type { BookFormInput } from "@/modules/books/domain/schemas";
import type { Book } from "@/modules/books/domain/types";
import { BookForm } from "@/modules/books/presentation/components/book-form";

type BookDetailPageProps = {
  bookId: string;
};

export function BookDetailPage({ bookId }: BookDetailPageProps) {
  const t = useTranslations("modules.books.pages.detail");
  const router = useRouter();
  const container = useContainer();
  const user = useAuthUserStore((s) => s.user);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) {
      setBook(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const getBookUseCase = container.resolve(
      "getBookUseCase",
    ) as GetBookUseCase;
    const result = await getBookUseCase.execute({
      userId: user.id,
      bookId,
    });
    setLoading(false);
    if (result.success) {
      setBook(result.data);
    } else {
      setBook(null);
      toast.error(t("errors.loadFailed"));
    }
  }, [user, bookId, container, t]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch then set state when deps change
    void load();
  }, [load]);

  async function handleUpdate(input: BookFormInput) {
    const currentUser = useAuthUserStore.getState().user;
    if (!currentUser?.id) return;
    const updateBookUseCase = container.resolve(
      "updateBookUseCase",
    ) as UpdateBookUseCase;
    const result = await updateBookUseCase.execute({
      userId: currentUser.id,
      bookId,
      input,
    });
    if (result.success) {
      toast.success(t("updated"));
      setEditing(false);
      void load();
    } else {
      toast.error(t("errors.updateFailed"));
    }
  }

  async function handleDeleteConfirm() {
    const currentUser = useAuthUserStore.getState().user;
    if (!currentUser?.id) return;
    const deleteBookUseCase = container.resolve(
      "deleteBookUseCase",
    ) as DeleteBookUseCase;
    const result = await deleteBookUseCase.execute({
      userId: currentUser.id,
      bookId,
    });
    setDeleteModalOpen(false);
    if (result.success) {
      toast.success(t("deleted"));
      router.push("/app/books");
    } else {
      toast.error(t("errors.deleteFailed"));
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-[var(--text-muted)]">{t("signInRequired")}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="flex justify-center py-8"
        role="status"
        aria-label={t("loading")}
      >
        <LoaderIcon className="size-8 text-[var(--text-muted)]" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="title-accent-underline text-2xl font-semibold text-[var(--text-primary)]">
          {t("title")}
        </h1>
        <p className="text-[var(--text-muted)]">{t("notFound")}</p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="default">
            <Link href="/app/books" className="inline-flex items-center gap-2">
              <BackArrowIcon className="size-4" />
              {t("backToList")}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="title-accent-underline text-2xl font-semibold text-[var(--text-primary)]">
          {t("title")}
        </h1>
        <BookForm
          defaultValues={{
            title: book.title,
            description: book.description,
            authors: book.authors,
            genres: book.genres,
            links: book.links,
          }}
          submitLabel={t("save")}
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
      <BookForm
        defaultValues={{
          title: book.title,
          description: book.description,
          authors: book.authors,
          genres: book.genres,
          links: book.links,
        }}
        readonly
      />
      <ButtonGroup>
        <Button variant="primary" onClick={() => setEditing(true)}>
          <PencilIcon className="size-4" />
          {t("edit")}
        </Button>
        <Button variant="destructive" onClick={() => setDeleteModalOpen(true)}>
          <TrashIcon className="size-4" />
          {t("delete")}
        </Button>
        <Button asChild variant="secondary">
          <Link href="/app/books" className="inline-flex items-center gap-2">
            <BackArrowIcon className="size-4" />
            {t("backToList")}
          </Link>
        </Button>
      </ButtonGroup>
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title={t("delete")}
        description={t("confirmDelete")}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        variant="destructive"
        icon={<TrashIcon className="size-4" />}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
