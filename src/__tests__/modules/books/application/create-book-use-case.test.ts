import { beforeEach, describe, expect, it, vi } from "vitest";

import { CreateBookUseCase } from "@/modules/books/application/create-book-use-case";
import type { BookRepository } from "@/modules/books/domain/interfaces";

describe("CreateBookUseCase", () => {
  let useCase: CreateBookUseCase;
  let mockRepo: BookRepository;

  beforeEach(() => {
    mockRepo = {
      find: vi.fn(),
      get: vi.fn(),
      create: vi.fn().mockResolvedValue(undefined),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new CreateBookUseCase(mockRepo);
  });

  it("returns failure when userId is null", async () => {
    const result = await useCase.execute({
      userId: null,
      input: {
        title: "Title",
        description: "Desc",
        authors: ["Author"],
        genres: [],
        links: [],
      },
    });
    expect(result).toEqual({ success: false, error: "generic" });
    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  it("returns failure when input is invalid", async () => {
    const result = await useCase.execute({
      userId: "user-1",
      input: {
        title: "",
        description: "Desc",
        authors: ["Author"],
        genres: [],
        links: [],
      },
    });
    expect(result).toEqual({ success: false, error: "generic" });
    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  it("generates UUID via fallback when crypto.randomUUID is unavailable", async () => {
    const originalCrypto = globalThis.crypto;
    vi.stubGlobal("crypto", undefined);
    try {
      const result = await useCase.execute({
        userId: "user-1",
        input: {
          title: "Title",
          description: "Desc",
          authors: ["Author"],
          genres: [],
          links: [],
        },
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );
      }
      expect(mockRepo.create).toHaveBeenCalledTimes(1);
    } finally {
      vi.stubGlobal("crypto", originalCrypto);
    }
  });

  it("calls create with book including id and createdBy and returns success", async () => {
    const result = await useCase.execute({
      userId: "user-1",
      input: {
        title: "Title",
        description: "Desc",
        authors: ["Author"],
        genres: ["fiction"],
        links: [],
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Title");
      expect(result.data.createdBy).toBe("user-1");
      expect(typeof result.data.id).toBe("string");
      expect(result.data.id.length).toBeGreaterThan(0);
    }
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
    const [userId, book] = vi.mocked(mockRepo.create).mock.calls[0]!;
    expect(userId).toBe("user-1");
    expect(book.title).toBe("Title");
    expect(book.createdBy).toBe("user-1");
  });

  it("returns failure when repository throws", async () => {
    vi.mocked(mockRepo.create).mockRejectedValue(new Error("fail"));
    const result = await useCase.execute({
      userId: "user-1",
      input: {
        title: "Title",
        description: "Desc",
        authors: ["Author"],
        genres: [],
        links: [],
      },
    });
    expect(result).toEqual({ success: false, error: "generic" });
  });
});
