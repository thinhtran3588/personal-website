import type { BookErrorCode } from "@/modules/books/domain/types";

export function mapBooksError(_err: unknown): BookErrorCode {
  return "generic";
}
