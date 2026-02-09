import { BaseUseCase } from "@/common/utils/base-use-case";
import type { BookRepository } from "@/modules/books/domain/interfaces";
import type {
  BookErrorCode,
  GetBookResult,
} from "@/modules/books/domain/types";
import { mapBooksError } from "@/modules/books/utils/map-books-error";

type GetBookInput = { userId: string | null; bookId: string };

export class GetBookUseCase extends BaseUseCase {
  constructor(private readonly repository: BookRepository) {
    super();
  }

  async execute(input: GetBookInput): Promise<GetBookResult> {
    if (!input.userId) {
      return { success: false, error: "generic" as BookErrorCode };
    }
    const result = await this.handle(
      () => this.repository.get(input.userId!, input.bookId),
      (err) => mapBooksError(err),
    );
    if (!result.success) {
      return { success: false, error: result.error };
    }
    const book = result.data;
    if (!book) {
      return { success: false, error: "not-found" };
    }
    return { success: true, data: book };
  }
}
