import { beforeEach, describe, expect, it, vi } from "vitest";

import { UpdateBookUseCase } from "@/modules/books/application/update-book-use-case";
import type { BookRepository } from "@/modules/books/domain/interfaces";

describe("UpdateBookUseCase", () => {
  let useCase: UpdateBookUseCase;
  let mockRepo: BookRepository;

  beforeEach(() => {
    mockRepo = {
      find: vi.fn(),
      get: vi.fn(),
      create: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
    };
    useCase = new UpdateBookUseCase(mockRepo);
  });

  it("returns failure when userId is null", async () => {
    const result = await useCase.execute({
      userId: null,
      bookId: "book-1",
      input: { title: "New" },
    });
    expect(result).toEqual({ success: false, error: "generic" });
    expect(mockRepo.update).not.toHaveBeenCalled();
  });

  it("calls update and returns success", async () => {
    const result = await useCase.execute({
      userId: "user-1",
      bookId: "book-1",
      input: { title: "New Title" },
    });
    expect(result).toEqual({ success: true });
    expect(mockRepo.update).toHaveBeenCalledWith("user-1", "book-1", {
      title: "New Title",
    });
  });

  it("returns failure when input is invalid", async () => {
    const result = await useCase.execute({
      userId: "user-1",
      bookId: "book-1",
      input: { title: "a".repeat(201) },
    });
    expect(result).toEqual({ success: false, error: "generic" });
    expect(mockRepo.update).not.toHaveBeenCalled();
  });

  it("returns failure when repository throws", async () => {
    vi.mocked(mockRepo.update).mockRejectedValue(new Error("fail"));
    const result = await useCase.execute({
      userId: "user-1",
      bookId: "book-1",
      input: { title: "New" },
    });
    expect(result).toEqual({ success: false, error: "generic" });
  });
});
