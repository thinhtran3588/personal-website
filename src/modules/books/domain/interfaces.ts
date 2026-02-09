import type { Book } from "@/modules/books/domain/types";

export type FindBookQuery = {
  orderBy: "title";
  searchTerm?: string;
  pageSize: number;
  pageCursor?: string | null;
};

export type FindBooksOutput = {
  items: Book[];
  nextCursor: string | null;
  hasMore: boolean;
};

export interface BookRepository {
  find(userId: string, query: FindBookQuery): Promise<FindBooksOutput>;
  get(userId: string, bookId: string): Promise<Book | null>;
  create(userId: string, book: Book): Promise<void>;
  update(
    userId: string,
    bookId: string,
    data: Partial<
      Omit<Book, "id" | "createdBy" | "createdAt" | "lastModifiedAt">
    >,
  ): Promise<void>;
  delete(userId: string, bookId: string): Promise<void>;
  deleteAll(userId: string): Promise<void>;
}
