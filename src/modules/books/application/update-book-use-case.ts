import { BaseUseCase } from "@/common/utils/base-use-case";
import type { BookRepository } from "@/modules/books/domain/interfaces";
import {
  bookUpdateSchema,
  type BookUpdateInput,
} from "@/modules/books/domain/schemas";
import type { Book, UpdateBookResult } from "@/modules/books/domain/types";
import { mapBooksError } from "@/modules/books/utils/map-books-error";

type UpdateBookInput = {
  userId: string | null;
  bookId: string;
  input: BookUpdateInput;
};

export class UpdateBookUseCase extends BaseUseCase {
  constructor(private readonly repository: BookRepository) {
    super();
  }

  async execute(payload: UpdateBookInput): Promise<UpdateBookResult> {
    if (!payload.userId) {
      return { success: false, error: "generic" };
    }
    const parsed = bookUpdateSchema.safeParse(payload.input);
    if (!parsed.success) {
      return { success: false, error: "generic" };
    }
    const data = parsed.data as Partial<
      Omit<Book, "id" | "createdBy" | "createdAt" | "lastModifiedAt">
    >;
    const result = await this.handle(
      () => this.repository.update(payload.userId!, payload.bookId, data),
      (err) => mapBooksError(err),
    );
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true };
  }
}
