"use client";

import { useSearchParams } from "next/navigation";

import { BookDetailPage } from "@/modules/books/presentation/pages/detail/page";

export function BookDetailClient() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("id") ?? "";
  return <BookDetailPage bookId={bookId} />;
}
