"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/common/components/button";
import { ConfirmationModal } from "@/common/components/confirmation-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/dropdown-menu";
import {
  ChevronDownIcon,
  ExternalLinkIcon,
  LoaderIcon,
  PlusIcon,
  TrashIcon,
} from "@/common/components/icons";
import { Input } from "@/common/components/input";
import { Modal } from "@/common/components/modal";
import { useContainer } from "@/common/hooks/use-container";
import { Link } from "@/common/routing/navigation";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";
import type { CreateBookUseCase } from "@/modules/books/application/create-book-use-case";
import type { DeleteBookUseCase } from "@/modules/books/application/delete-book-use-case";
import type { FindBooksUseCase } from "@/modules/books/application/find-books-use-case";
import type { BookFormInput } from "@/modules/books/domain/schemas";
import type { Book } from "@/modules/books/domain/types";
import { BookForm } from "@/modules/books/presentation/components/book-form";

const PAGE_SIZES = [10, 20, 50] as const;

export function BooksListPage() {
  const t = useTranslations("modules.books.pages.list");
  const tCreate = useTranslations("modules.books.pages.create");
  const container = useContainer();
  const user = useAuthUserStore((s) => s.user);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [cursor, setCursor] = useState<string | null>(null);
  const [items, setItems] = useState<Book[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const load = useCallback(
    async (pageCursor: string | null = null) => {
      if (!user?.id) {
        setItems([]);
        setNextCursor(null);
        setHasMore(false);
        setLoading(false);
        return;
      }
      setLoading(true);
      const findBooksUseCase = container.resolve(
        "findBooksUseCase",
      ) as FindBooksUseCase;
      const result = await findBooksUseCase.execute({
        userId: user.id,
        orderBy: "title",
        searchTerm: debouncedSearch.trim() || undefined,
        pageSize,
        pageCursor,
      });
      setLoading(false);
      if (!result.success) {
        toast.error(t("errors.loadFailed"));
        return;
      }
      setItems(result.data.items);
      setNextCursor(result.data.nextCursor);
      setHasMore(result.data.hasMore);
      setCursor(pageCursor);
    },
    [user, debouncedSearch, pageSize, container, t],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch then set state when deps change
    load(null);
  }, [load]);

  const loadNext = () => {
    const cursorToLoad = nextCursor;
    if (cursorToLoad) {
      void load(cursorToLoad);
    }
  };

  const loadPrev = () => {
    setCursor(null);
    load(null);
  };

  async function handleDeleteConfirm() {
    if (!user?.id || !deleteTarget) return;
    const deleteBookUseCase = container.resolve(
      "deleteBookUseCase",
    ) as DeleteBookUseCase;
    const result = await deleteBookUseCase.execute({
      userId: user.id,
      bookId: deleteTarget.id,
    });
    setDeleteTarget(null);
    if (result.success) {
      toast.success(t("deleted"));
      void load(cursor);
    } else {
      toast.error(t("errors.deleteFailed"));
    }
  }

  async function handleCreateSubmit(input: BookFormInput) {
    const currentUser = useAuthUserStore.getState().user;
    if (!currentUser?.id) {
      toast.error(tCreate("errors.signInRequired"));
      return;
    }
    const createBookUseCase = container.resolve(
      "createBookUseCase",
    ) as CreateBookUseCase;
    const result = await createBookUseCase.execute({
      userId: currentUser.id,
      input,
    });
    if (result.success) {
      toast.success(tCreate("created"));
      setCreateModalOpen(false);
      void load(cursor);
    } else {
      toast.error(tCreate("errors.createFailed"));
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-[var(--text-muted)]">{t("signInRequired")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="title-accent-underline text-2xl font-semibold text-[var(--text-primary)]">
          {t("title")}
        </h1>
        <Button
          type="button"
          variant="primary"
          onClick={() => setCreateModalOpen(true)}
        >
          <PlusIcon className="size-4" />
          {t("create")}
        </Button>
      </div>

      <Modal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        title={tCreate("title")}
      >
        <BookForm
          submitLabel={tCreate("submit")}
          onSubmit={handleCreateSubmit}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      <ConfirmationModal
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("delete")}
        description={
          deleteTarget ? t("confirmDelete", { title: deleteTarget.title }) : ""
        }
        confirmText={t("delete")}
        cancelText={t("cancel")}
        variant="destructive"
        icon={<TrashIcon className="size-4" />}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {loading ? (
          <div
            className="flex justify-center py-8"
            role="status"
            aria-label={t("loading")}
          >
            <LoaderIcon className="size-8 text-[var(--text-muted)]" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-[var(--text-muted)]">{t("empty")}</p>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-xl border border-[var(--glass-border)] sm:block">
              <table className="w-full table-fixed border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--glass-border)] bg-[var(--glass-highlight)]">
                    <th className="px-4 py-3 font-semibold text-[var(--text-primary)]">
                      {t("titleColumn")}
                    </th>
                    <th className="hidden px-4 py-3 font-semibold text-[var(--text-primary)] md:table-cell">
                      {t("authorsLabel")}
                    </th>
                    <th className="hidden px-4 py-3 font-semibold text-[var(--text-primary)] lg:table-cell">
                      {t("genresLabel")}
                    </th>
                    <th className="w-24 px-4 py-3 text-right font-semibold text-[var(--text-primary)]">
                      {t("actionsLabel")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((book) => (
                    <tr
                      key={book.id}
                      className="border-b border-[var(--glass-border)] last:border-b-0 hover:bg-[var(--glass-highlight)]"
                    >
                      <td className="px-4 py-3">
                        <span className="truncate font-medium text-[var(--text-primary)]">
                          {book.title}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-[var(--text-muted)] md:table-cell">
                        <span className="line-clamp-1">
                          {book.authors.join(", ")}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {book.genres.slice(0, 4).map((g, i) => (
                            <span
                              key={`${g}-${i}`}
                              className="rounded-full bg-[var(--glass-highlight)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
                            >
                              {g}
                            </span>
                          ))}
                          {book.genres.length > 4 && (
                            <span className="text-xs text-[var(--text-muted)]">
                              +{book.genres.length - 4}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button asChild variant="outline" size="icon-sm">
                            <Link
                              href={`/app/books/detail?id=${book.id}`}
                              aria-label={t("viewDetail")}
                            >
                              <ExternalLinkIcon className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => setDeleteTarget(book)}
                            aria-label={t("delete")}
                          >
                            <TrashIcon className="size-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 sm:hidden">
              {items.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/app/books/detail?id=${book.id}`}
                      className="min-w-0 flex-1 font-medium text-[var(--text-primary)] hover:underline"
                    >
                      <span className="line-clamp-2">{book.title}</span>
                    </Link>
                    <div className="flex shrink-0 gap-1">
                      <Button asChild variant="ghost" size="icon-sm">
                        <Link
                          href={`/app/books/detail?id=${book.id}`}
                          aria-label={t("viewDetail")}
                        >
                          <ExternalLinkIcon className="size-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(book)}
                        aria-label={t("delete")}
                      >
                        <TrashIcon className="size-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <p className="line-clamp-1 text-xs text-[var(--text-muted)]">
                    {book.authors.join(", ")}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {book.genres.slice(0, 3).map((g, i) => (
                      <span
                        key={`${g}-${i}`}
                        className="rounded-full bg-[var(--glass-highlight)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
                      >
                        {g}
                      </span>
                    ))}
                    {book.genres.length > 3 && (
                      <span className="text-xs text-[var(--text-muted)]">
                        +{book.genres.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {!loading && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={cursor === null}
              onClick={loadPrev}
            >
              {t("previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasMore}
              onClick={loadNext}
            >
              {t("next")}
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-[var(--text-muted)]">
                {t("pageSize")}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {pageSize}
                    <ChevronDownIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {PAGE_SIZES.map((size) => (
                    <DropdownMenuItem
                      key={size}
                      onClick={() => setPageSize(size)}
                    >
                      {size}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
