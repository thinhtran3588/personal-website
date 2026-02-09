import { beforeEach, describe, expect, it, vi } from "vitest";

import { DeleteBookUseCase } from "@/modules/books/application/delete-book-use-case";
import type { BookRepository } from "@/modules/books/domain/interfaces";

describe("DeleteBookUseCase", () => {
  let useCase: DeleteBookUseCase;
  let mockRepo: BookRepository;

  beforeEach(() => {
    mockRepo = {
      find: vi.fn(),
      get: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    useCase = new DeleteBookUseCase(mockRepo);
  });

  it("returns failure when userId is null", async () => {
    const result = await useCase.execute({
      userId: null,
      bookId: "book-1",
    });
    expect(result).toEqual({ success: false, error: "generic" });
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });

  it("calls delete and returns success", async () => {
    const result = await useCase.execute({
      userId: "user-1",
      bookId: "book-1",
    });
    expect(result).toEqual({ success: true });
    expect(mockRepo.delete).toHaveBeenCalledWith("user-1", "book-1");
  });

  it("returns failure when repository throws", async () => {
    vi.mocked(mockRepo.delete).mockRejectedValue(new Error("fail"));
    const result = await useCase.execute({
      userId: "user-1",
      bookId: "book-1",
    });
    expect(result).toEqual({ success: false, error: "generic" });
  });
});
