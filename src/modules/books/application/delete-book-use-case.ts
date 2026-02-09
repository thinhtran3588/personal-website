import { BaseUseCase } from "@/common/utils/base-use-case";
import type { BookRepository } from "@/modules/books/domain/interfaces";
import type { DeleteBookResult } from "@/modules/books/domain/types";
import { mapBooksError } from "@/modules/books/utils/map-books-error";

type DeleteBookInput = { userId: string | null; bookId: string };

export class DeleteBookUseCase extends BaseUseCase {
  constructor(private readonly repository: BookRepository) {
    super();
  }

  async execute(input: DeleteBookInput): Promise<DeleteBookResult> {
    if (!input.userId) {
      return { success: false, error: "generic" };
    }
    const result = await this.handle(
      () => this.repository.delete(input.userId!, input.bookId),
      (err) => mapBooksError(err),
    );
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true };
  }
}
