import { beforeEach, describe, expect, it, vi } from "vitest";

import { GetBookUseCase } from "@/modules/books/application/get-book-use-case";
import type { BookRepository } from "@/modules/books/domain/interfaces";

describe("GetBookUseCase", () => {
  let useCase: GetBookUseCase;
  let mockRepo: BookRepository;

  beforeEach(() => {
    mockRepo = {
      find: vi.fn(),
      get: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new GetBookUseCase(mockRepo);
  });

  it("returns failure when userId is null", async () => {
    const result = await useCase.execute({
      userId: null,
      bookId: "book-1",
    });
    expect(result).toEqual({ success: false, error: "generic" });
    expect(mockRepo.get).not.toHaveBeenCalled();
  });

  it("returns not-found when repository returns null", async () => {
    vi.mocked(mockRepo.get).mockResolvedValue(null);
    const result = await useCase.execute({
      userId: "user-1",
      bookId: "book-1",
    });
    expect(result).toEqual({ success: false, error: "not-found" });
  });

  it("returns success with book when repository returns book", async () => {
    const book = {
      id: "book-1",
      title: "Title",
      description: "Desc",
      genres: [],
      authors: ["Author"],
      links: [],
      createdBy: "user-1",
      createdAt: 1000,
      lastModifiedAt: 2000,
    };
    vi.mocked(mockRepo.get).mockResolvedValue(book);
    const result = await useCase.execute({
      userId: "user-1",
      bookId: "book-1",
    });
    expect(result).toEqual({ success: true, data: book });
  });

  it("returns failure when repository throws", async () => {
    vi.mocked(mockRepo.get).mockRejectedValue(new Error("fail"));
    const result = await useCase.execute({
      userId: "user-1",
      bookId: "book-1",
    });
    expect(result).toEqual({ success: false, error: "generic" });
  });
});
