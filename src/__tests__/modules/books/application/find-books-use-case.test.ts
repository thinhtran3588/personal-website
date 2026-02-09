import { beforeEach, describe, expect, it, vi } from "vitest";

import { FindBooksUseCase } from "@/modules/books/application/find-books-use-case";
import type { BookRepository } from "@/modules/books/domain/interfaces";

describe("FindBooksUseCase", () => {
  let useCase: FindBooksUseCase;
  let mockRepo: BookRepository;

  beforeEach(() => {
    mockRepo = {
      find: vi.fn().mockResolvedValue({
        items: [],
        nextCursor: null,
        hasMore: false,
      }),
      get: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new FindBooksUseCase(mockRepo);
  });

  it("returns empty result when userId is null", async () => {
    const result = await useCase.execute({
      userId: null,
      orderBy: "title",
      pageSize: 10,
    });
    expect(result).toEqual({
      success: true,
      data: { items: [], nextCursor: null, hasMore: false },
    });
    expect(mockRepo.find).not.toHaveBeenCalled();
  });

  it("calls repository and returns result when userId is set", async () => {
    const items = [
      {
        id: "1",
        title: "Book",
        description: "Desc",
        genres: [],
        authors: ["Author"],
        links: [],
        createdBy: "user-1",
        createdAt: 1,
        lastModifiedAt: 1,
      },
    ];
    vi.mocked(mockRepo.find).mockResolvedValue({
      items,
      nextCursor: "cursor",
      hasMore: true,
    });
    const result = await useCase.execute({
      userId: "user-1",
      orderBy: "title",
      pageSize: 10,
      searchTerm: "Book",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.items).toEqual(items);
      expect(result.data.nextCursor).toBe("cursor");
      expect(result.data.hasMore).toBe(true);
    }
    expect(mockRepo.find).toHaveBeenCalledWith("user-1", {
      orderBy: "title",
      searchTerm: "Book",
      pageSize: 10,
      pageCursor: undefined,
    });
  });

  it("returns failure when repository throws", async () => {
    vi.mocked(mockRepo.find).mockRejectedValue(new Error("fail"));
    const result = await useCase.execute({
      userId: "user-1",
      orderBy: "title",
      pageSize: 10,
    });
    expect(result).toEqual({ success: false, error: "generic" });
  });
});
