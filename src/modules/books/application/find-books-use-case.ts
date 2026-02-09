import { BaseUseCase } from "@/common/utils/base-use-case";
import type {
  BookRepository,
  FindBookQuery,
} from "@/modules/books/domain/interfaces";
import type { FindBooksResult } from "@/modules/books/domain/types";
import { mapBooksError } from "@/modules/books/utils/map-books-error";

type FindBooksInput = { userId: string | null } & FindBookQuery;

export class FindBooksUseCase extends BaseUseCase {
  constructor(private readonly repository: BookRepository) {
    super();
  }

  async execute(input: FindBooksInput): Promise<FindBooksResult> {
    if (!input.userId) {
      return {
        success: true,
        data: { items: [], nextCursor: null, hasMore: false },
      };
    }
    const result = await this.handle(
      () =>
        this.repository.find(input.userId!, {
          orderBy: input.orderBy,
          searchTerm: input.searchTerm,
          pageSize: input.pageSize,
          pageCursor: input.pageCursor,
        }),
      (err) => mapBooksError(err),
    );
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true, data: result.data };
  }
}
