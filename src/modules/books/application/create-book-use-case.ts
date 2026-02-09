import { BaseUseCase } from "@/common/utils/base-use-case";
import type { BookRepository } from "@/modules/books/domain/interfaces";
import {
  bookFormSchema,
  type BookFormInput,
} from "@/modules/books/domain/schemas";
import type { Book, CreateBookResult } from "@/modules/books/domain/types";
import { mapBooksError } from "@/modules/books/utils/map-books-error";

type CreateBookInput = { userId: string | null; input: BookFormInput };

function generateId(): string {
  if (
    typeof globalThis !== "undefined" &&
    "crypto" in globalThis &&
    typeof (globalThis as { crypto: { randomUUID?: () => string } }).crypto
      ?.randomUUID === "function"
  ) {
    return (
      globalThis as { crypto: { randomUUID: () => string } }
    ).crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class CreateBookUseCase extends BaseUseCase {
  constructor(private readonly repository: BookRepository) {
    super();
  }

  async execute(payload: CreateBookInput): Promise<CreateBookResult> {
    if (!payload.userId) {
      return { success: false, error: "generic" };
    }
    const parsed = bookFormSchema.safeParse(payload.input);
    if (!parsed.success) {
      return { success: false, error: "generic" };
    }
    const id = generateId();
    const now = Date.now();
    const book: Book = {
      id,
      title: parsed.data.title,
      description: parsed.data.description,
      genres: parsed.data.genres,
      authors: parsed.data.authors,
      links: parsed.data.links,
      createdBy: payload.userId,
      createdAt: now,
      lastModifiedAt: now,
    };
    const result = await this.handle(
      () => this.repository.create(payload.userId!, book),
      (err) => mapBooksError(err),
    );
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true, data: book };
  }
}
