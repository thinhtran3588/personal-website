export type Book = {
  id: string;
  title: string;
  description: string;
  genres: string[];
  authors: string[];
  links: string[];
  createdBy: string;
  createdAt: number;
  lastModifiedAt: number;
};

export type BookErrorCode = "not-found" | "unavailable" | "generic";

export type FindBooksResult =
  | {
      success: true;
      data: { items: Book[]; nextCursor: string | null; hasMore: boolean };
    }
  | { success: false; error: BookErrorCode };

export type GetBookResult =
  | { success: true; data: Book }
  | { success: false; error: BookErrorCode };

export type CreateBookResult =
  | { success: true; data: Book }
  | { success: false; error: BookErrorCode };

export type UpdateBookResult =
  | { success: true }
  | { success: false; error: BookErrorCode };

export type DeleteBookResult =
  | { success: true }
  | { success: false; error: BookErrorCode };
