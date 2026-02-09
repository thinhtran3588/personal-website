import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FirestoreBookRepository } from "@/modules/books/infrastructure/repositories/firestore-book-repository";

describe("FirestoreBookRepository", () => {
  let repository: FirestoreBookRepository;
  let getFirestoreInstance: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.mocked(doc).mockReset();
    vi.mocked(getDoc).mockReset();
    vi.mocked(getDocs).mockReset();
    vi.mocked(setDoc).mockReset();
    vi.mocked(updateDoc).mockReset();
    vi.mocked(deleteDoc).mockReset();
    vi.mocked(collection).mockReset();
    vi.mocked(query).mockReset();
    vi.mocked(where).mockReset();
    vi.mocked(startAfter).mockReset();
    vi.mocked(writeBatch).mockReset();
    getFirestoreInstance = vi.fn();
    repository = new FirestoreBookRepository(getFirestoreInstance);
  });

  it("find returns empty when Firestore is not available", async () => {
    getFirestoreInstance.mockReturnValue(null);
    const result = await repository.find("user-1", {
      orderBy: "title",
      pageSize: 10,
    });
    expect(result).toEqual({
      items: [],
      nextCursor: null,
      hasMore: false,
    });
    expect(getDocs).not.toHaveBeenCalled();
  });

  it("find returns items from getDocs snapshot", async () => {
    const mockDb = {};
    const mockColl = {};
    const mockQuery = {};
    const now = 1000000;
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(collection).mockReturnValue(mockColl as never);
    vi.mocked(query).mockReturnValue(mockQuery as never);
    vi.mocked(getDocs).mockResolvedValue({
      docs: [
        {
          id: "book-1",
          data: () => ({
            title: "Title",
            description: "Desc",
            genres: [],
            authors: ["Author"],
            links: [],
            createdBy: "user-1",
            createdAt: now,
            lastModifiedAt: now,
          }),
        },
      ],
    } as never);
    const result = await repository.find("user-1", {
      orderBy: "title",
      pageSize: 10,
    });
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual({
      id: "book-1",
      title: "Title",
      description: "Desc",
      genres: [],
      authors: ["Author"],
      links: [],
      createdBy: "user-1",
      createdAt: now,
      lastModifiedAt: now,
    });
    expect(result.hasMore).toBe(false);
    expect(collection).toHaveBeenCalledWith(mockDb, "users", "user-1", "books");
  });

  it("find maps document with missing genres and links to empty arrays", async () => {
    const mockDb = {};
    const mockColl = {};
    const mockQuery = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(collection).mockReturnValue(mockColl as never);
    vi.mocked(query).mockReturnValue(mockQuery as never);
    vi.mocked(getDocs).mockResolvedValue({
      docs: [
        {
          id: "b1",
          data: () => ({
            title: "T",
            description: "D",
            authors: ["A"],
            createdBy: "u1",
            createdAt: 1,
            lastModifiedAt: 2,
          }),
        },
      ],
    } as never);
    const result = await repository.find("user-1", {
      orderBy: "title",
      pageSize: 10,
    });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].genres).toEqual([]);
    expect(result.items[0].links).toEqual([]);
  });

  it("find maps document with missing authors to empty array", async () => {
    const mockDb = {};
    const mockColl = {};
    const mockQuery = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(collection).mockReturnValue(mockColl as never);
    vi.mocked(query).mockReturnValue(mockQuery as never);
    vi.mocked(getDocs).mockResolvedValue({
      docs: [
        {
          id: "b1",
          data: () => ({
            title: "T",
            description: "D",
            genres: [],
            createdBy: "u1",
            createdAt: 1,
            lastModifiedAt: 2,
          }),
        },
      ],
    } as never);
    const result = await repository.find("user-1", {
      orderBy: "title",
      pageSize: 10,
    });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].authors).toEqual([]);
  });

  it("find with searchTerm adds where constraints on searchText with normalized term", async () => {
    const mockDb = {};
    const mockColl = {};
    const mockQuery = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(collection).mockReturnValue(mockColl as never);
    vi.mocked(query).mockReturnValue(mockQuery as never);
    vi.mocked(getDocs).mockResolvedValue({ docs: [] } as never);
    await repository.find("user-1", {
      orderBy: "title",
      pageSize: 10,
      searchTerm: "  foo  ",
    });
    expect(vi.mocked(where)).toHaveBeenCalledWith("searchText", ">=", "foo");
    expect(vi.mocked(where)).toHaveBeenCalledWith(
      "searchText",
      "<=",
      "foo\uf8ff",
    );
  });

  it("find with searchTerm normalizes diacritics and lowercases", async () => {
    const mockDb = {};
    const mockColl = {};
    const mockQuery = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(collection).mockReturnValue(mockColl as never);
    vi.mocked(query).mockReturnValue(mockQuery as never);
    vi.mocked(getDocs).mockResolvedValue({ docs: [] } as never);
    await repository.find("user-1", {
      orderBy: "title",
      pageSize: 10,
      searchTerm: "Café",
    });
    expect(vi.mocked(where)).toHaveBeenCalledWith("searchText", ">=", "cafe");
    expect(vi.mocked(where)).toHaveBeenCalledWith(
      "searchText",
      "<=",
      "cafe\uf8ff",
    );
  });

  it("find with invalid pageCursor does not add startAfter", async () => {
    const mockDb = {};
    const mockColl = {};
    const mockQuery = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(collection).mockReturnValue(mockColl as never);
    vi.mocked(query).mockReturnValue(mockQuery as never);
    vi.mocked(getDocs).mockResolvedValue({ docs: [] } as never);
    await repository.find("user-1", {
      orderBy: "title",
      pageSize: 10,
      pageCursor: "invalid-json",
    });
    expect(vi.mocked(startAfter)).not.toHaveBeenCalled();
  });

  it("find with pageCursor missing value or id does not add startAfter", async () => {
    const mockDb = {};
    const mockColl = {};
    const mockQuery = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(collection).mockReturnValue(mockColl as never);
    vi.mocked(query).mockReturnValue(mockQuery as never);
    vi.mocked(getDocs).mockResolvedValue({ docs: [] } as never);
    await repository.find("user-1", {
      orderBy: "title",
      pageSize: 10,
      pageCursor: JSON.stringify({ field: "title", value: 1, id: "x" }),
    });
    expect(vi.mocked(startAfter)).not.toHaveBeenCalled();
  });

  it("find with pageCursor with wrong field does not add startAfter", async () => {
    const mockDb = {};
    const mockColl = {};
    const mockQuery = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(collection).mockReturnValue(mockColl as never);
    vi.mocked(query).mockReturnValue(mockQuery as never);
    vi.mocked(getDocs).mockResolvedValue({ docs: [] } as never);
    await repository.find("user-1", {
      orderBy: "title",
      pageSize: 10,
      searchTerm: "foo",
      pageCursor: JSON.stringify({
        field: "title",
        value: "a",
        id: "id-1",
      }),
    });
    expect(vi.mocked(startAfter)).not.toHaveBeenCalled();
  });

  it("find with pageCursor with unsupported field name returns null cursor and does not add startAfter", async () => {
    const mockDb = {};
    const mockColl = {};
    const mockQuery = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(collection).mockReturnValue(mockColl as never);
    vi.mocked(query).mockReturnValue(mockQuery as never);
    vi.mocked(getDocs).mockResolvedValue({ docs: [] } as never);
    await repository.find("user-1", {
      orderBy: "title",
      pageSize: 10,
      pageCursor: JSON.stringify({
        field: "createdAt",
        value: "123",
        id: "id-1",
      }),
    });
    expect(vi.mocked(startAfter)).not.toHaveBeenCalled();
  });

  it("find with pageCursor adds startAfter when cursor field matches order", async () => {
    const mockDb = {};
    const mockColl = {};
    const mockQuery = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(collection).mockReturnValue(mockColl as never);
    vi.mocked(query).mockReturnValue(mockQuery as never);
    vi.mocked(getDocs).mockResolvedValue({ docs: [] } as never);
    await repository.find("user-1", {
      orderBy: "title",
      pageSize: 10,
      pageCursor: JSON.stringify({ field: "title", value: "A", id: "id-1" }),
    });
    expect(vi.mocked(startAfter)).toHaveBeenCalledWith("A", "id-1");
  });

  it("find with searchTerm and matching cursor adds startAfter with searchText", async () => {
    const mockDb = {};
    const mockColl = {};
    const mockQuery = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(collection).mockReturnValue(mockColl as never);
    vi.mocked(query).mockReturnValue(mockQuery as never);
    vi.mocked(getDocs).mockResolvedValue({ docs: [] } as never);
    await repository.find("user-1", {
      orderBy: "title",
      pageSize: 10,
      searchTerm: "foo",
      pageCursor: JSON.stringify({
        field: "searchText",
        value: "foo",
        id: "id-1",
      }),
    });
    expect(vi.mocked(startAfter)).toHaveBeenCalledWith("foo", "id-1");
  });

  it("find returns nextCursor when hasMore is true", async () => {
    const mockDb = {};
    const mockColl = {};
    const mockQuery = {};
    const now = 2000000;
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(collection).mockReturnValue(mockColl as never);
    vi.mocked(query).mockReturnValue(mockQuery as never);
    vi.mocked(getDocs).mockResolvedValue({
      docs: [
        {
          id: "b1",
          data: () => ({
            title: "A",
            description: "D",
            genres: [],
            authors: ["Au"],
            links: [],
            createdBy: "u1",
            createdAt: now,
            lastModifiedAt: now,
          }),
        },
        {
          id: "b2",
          data: () => ({
            title: "B",
            description: "D",
            genres: [],
            authors: ["Au"],
            links: [],
            createdBy: "u1",
            createdAt: now,
            lastModifiedAt: now,
          }),
        },
      ],
    } as never);
    const result = await repository.find("user-1", {
      orderBy: "title",
      pageSize: 1,
    });
    expect(result.items).toHaveLength(1);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).toBe(
      JSON.stringify({ field: "title", value: "A", id: "b1" }),
    );
  });

  it("find with searchTerm returns nextCursor with empty value when last doc in page has no searchText", async () => {
    const mockDb = {};
    const mockColl = {};
    const mockQuery = {};
    const now = 2000000;
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(collection).mockReturnValue(mockColl as never);
    vi.mocked(query).mockReturnValue(mockQuery as never);
    vi.mocked(getDocs).mockResolvedValue({
      docs: [
        {
          id: "b1",
          data: () => ({
            title: "First",
            description: "D",
            genres: [],
            authors: ["A"],
            links: [],
            createdBy: "u1",
            createdAt: now,
            lastModifiedAt: now,
          }),
        },
        {
          id: "b2",
          data: () => ({
            title: "Second",
            searchText: "second",
            description: "D",
            genres: [],
            authors: ["A"],
            links: [],
            createdBy: "u1",
            createdAt: now,
            lastModifiedAt: now,
          }),
        },
      ],
    } as never);
    const result = await repository.find("user-1", {
      orderBy: "title",
      pageSize: 1,
      searchTerm: "foo",
    });
    expect(result.items).toHaveLength(1);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).toBe(
      JSON.stringify({ field: "searchText", value: "", id: "b1" }),
    );
  });

  it("get returns null when Firestore is not available", async () => {
    getFirestoreInstance.mockReturnValue(null);
    await expect(repository.get("user-1", "book-1")).resolves.toBeNull();
    expect(getDoc).not.toHaveBeenCalled();
  });

  it("get returns null when document does not exist", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    vi.mocked(getDoc).mockResolvedValue({ exists: () => false } as never);
    await expect(repository.get("user-1", "book-1")).resolves.toBeNull();
  });

  it("get returns book when document exists", async () => {
    const mockDb = {};
    const mockRef = {};
    const now = 3000000;
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      id: "book-1",
      data: () => ({
        title: "Title",
        description: "Desc",
        genres: ["a"],
        authors: ["Author"],
        links: ["http://x.com"],
        createdBy: "user-1",
        createdAt: now,
        lastModifiedAt: now,
      }),
    } as never);
    const result = await repository.get("user-1", "book-1");
    expect(result).toEqual({
      id: "book-1",
      title: "Title",
      description: "Desc",
      genres: ["a"],
      authors: ["Author"],
      links: ["http://x.com"],
      createdBy: "user-1",
      createdAt: now,
      lastModifiedAt: now,
    });
  });

  it("get converts Firestore Timestamp to milliseconds", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      id: "book-1",
      data: () => ({
        title: "T",
        description: "D",
        genres: [],
        authors: ["A"],
        links: [],
        createdBy: "u1",
        createdAt: { toMillis: () => 111 },
        lastModifiedAt: { toMillis: () => 222 },
      }),
    } as never);
    const result = await repository.get("user-1", "book-1");
    expect(result?.createdAt).toBe(111);
    expect(result?.lastModifiedAt).toBe(222);
  });

  it("get uses Date.now() when timestamps are missing", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      id: "book-1",
      data: () => ({
        title: "T",
        description: "D",
        genres: [],
        authors: ["A"],
        links: [],
        createdBy: "u1",
      }),
    } as never);
    const result = await repository.get("user-1", "book-1");
    expect(typeof result?.createdAt).toBe("number");
    expect(typeof result?.lastModifiedAt).toBe("number");
  });

  it("get uses Date.now() when timestamp-like object has no toMillis", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      id: "book-1",
      data: () => ({
        title: "T",
        description: "D",
        genres: [],
        authors: ["A"],
        links: [],
        createdBy: "u1",
        createdAt: {},
        lastModifiedAt: {},
      }),
    } as never);
    const result = await repository.get("user-1", "book-1");
    expect(typeof result?.createdAt).toBe("number");
    expect(typeof result?.lastModifiedAt).toBe("number");
  });

  it("get uses Date.now() when timestamps are null", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      id: "book-1",
      data: () => ({
        title: "T",
        description: "D",
        genres: [],
        authors: ["A"],
        links: [],
        createdBy: "u1",
        createdAt: null,
        lastModifiedAt: null,
      }),
    } as never);
    const result = await repository.get("user-1", "book-1");
    expect(typeof result?.createdAt).toBe("number");
    expect(typeof result?.lastModifiedAt).toBe("number");
  });

  it("get uses Date.now() when timestamp has toMillis undefined", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      id: "book-1",
      data: () => ({
        title: "T",
        description: "D",
        genres: [],
        authors: ["A"],
        links: [],
        createdBy: "u1",
        createdAt: { toMillis: undefined },
        lastModifiedAt: { toMillis: undefined },
      }),
    } as never);
    const result = await repository.get("user-1", "book-1");
    expect(typeof result?.createdAt).toBe("number");
    expect(typeof result?.lastModifiedAt).toBe("number");
  });

  it("create does nothing when Firestore is not available", async () => {
    getFirestoreInstance.mockReturnValue(null);
    await repository.create("user-1", {
      id: "book-1",
      title: "T",
      description: "D",
      genres: [],
      authors: ["A"],
      links: [],
      createdBy: "user-1",
      createdAt: 0,
      lastModifiedAt: 0,
    });
    expect(setDoc).not.toHaveBeenCalled();
  });

  it("create writes document when Firestore is available", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    vi.mocked(setDoc).mockResolvedValue(undefined);
    await repository.create("user-1", {
      id: "book-1",
      title: "T",
      description: "D",
      genres: [],
      authors: ["A"],
      links: [],
      createdBy: "user-1",
      createdAt: 0,
      lastModifiedAt: 0,
    });
    expect(doc).toHaveBeenCalledWith(
      mockDb,
      "users",
      "user-1",
      "books",
      "book-1",
    );
    const setDocCall = vi.mocked(setDoc).mock.calls[0];
    expect(setDocCall?.[1]).toMatchObject({
      title: "T",
      description: "D",
      genres: [],
      authors: ["A"],
      links: [],
      createdBy: "user-1",
      searchText: "t",
    });
    expect(typeof (setDocCall?.[1] as { createdAt: number }).createdAt).toBe(
      "number",
    );
    expect(
      typeof (setDocCall?.[1] as { lastModifiedAt: number }).lastModifiedAt,
    ).toBe("number");
  });

  it("create persists non-blank searchText when title normalizes to empty", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    vi.mocked(setDoc).mockResolvedValue(undefined);
    await repository.create("user-1", {
      id: "book-1",
      title: "   ",
      description: "D",
      genres: [],
      authors: ["A"],
      links: [],
      createdBy: "user-1",
      createdAt: 0,
      lastModifiedAt: 0,
    });
    const setDocCall = vi.mocked(setDoc).mock.calls[0];
    expect((setDocCall?.[1] as { searchText: string }).searchText).toBe(" ");
  });

  it("update persists non-blank searchText when title normalizes to empty", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    vi.mocked(updateDoc).mockResolvedValue(undefined);
    await repository.update("user-1", "book-1", { title: "   " });
    const updateCall = vi.mocked(updateDoc).mock.calls[0];
    expect(
      (updateCall?.[1] as unknown as { searchText: string }).searchText,
    ).toBe(" ");
  });

  it("update does nothing when Firestore is not available", async () => {
    getFirestoreInstance.mockReturnValue(null);
    await repository.update("user-1", "book-1", { title: "New" });
    expect(updateDoc).not.toHaveBeenCalled();
  });

  it("update does not call updateDoc when no fields to update", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    await repository.update("user-1", "book-1", {});
    expect(updateDoc).not.toHaveBeenCalled();
  });

  it("update writes only provided fields and lastModifiedAt", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    vi.mocked(updateDoc).mockResolvedValue(undefined);
    await repository.update("user-1", "book-1", { title: "New Title" });
    const updateCall = vi.mocked(updateDoc).mock.calls[0];
    expect(updateCall?.[1]).toMatchObject({
      title: "New Title",
      searchText: "new title",
    });
    expect(
      typeof (updateCall?.[1] as unknown as { lastModifiedAt: number })
        .lastModifiedAt,
    ).toBe("number");
  });

  it("update writes all updatable fields when provided", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    vi.mocked(updateDoc).mockResolvedValue(undefined);
    await repository.update("user-1", "book-1", {
      title: "T",
      description: "D",
      genres: ["g"],
      authors: ["A"],
      links: ["L"],
    });
    const updateCall = vi.mocked(updateDoc).mock.calls[0];
    expect(updateCall?.[1]).toMatchObject({
      title: "T",
      description: "D",
      genres: ["g"],
      authors: ["A"],
      links: ["L"],
    });
    expect(
      typeof (updateCall?.[1] as unknown as { lastModifiedAt: number })
        .lastModifiedAt,
    ).toBe("number");
  });

  it("delete does nothing when Firestore is not available", async () => {
    getFirestoreInstance.mockReturnValue(null);
    await repository.delete("user-1", "book-1");
    expect(deleteDoc).not.toHaveBeenCalled();
  });

  it("delete calls deleteDoc when Firestore is available", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    vi.mocked(deleteDoc).mockResolvedValue(undefined);
    await repository.delete("user-1", "book-1");
    expect(doc).toHaveBeenCalledWith(
      mockDb,
      "users",
      "user-1",
      "books",
      "book-1",
    );
    expect(deleteDoc).toHaveBeenCalledWith(mockRef);
  });

  it("deleteAll does nothing when Firestore is not available", async () => {
    getFirestoreInstance.mockReturnValue(null);
    await repository.deleteAll("user-1");
    expect(getDocs).not.toHaveBeenCalled();
    expect(writeBatch).not.toHaveBeenCalled();
  });

  it("deleteAll batch-deletes all documents in the user's books collection", async () => {
    const mockDb = {};
    const mockColl = {};
    const mockQuery = {};
    const mockRef1 = { id: "ref1" };
    const mockRef2 = { id: "ref2" };
    const mockBatchDelete = vi.fn();
    const mockBatchCommit = vi.fn().mockResolvedValue(undefined);
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(collection).mockReturnValue(mockColl as never);
    vi.mocked(query).mockReturnValue(mockQuery as never);
    vi.mocked(getDocs).mockResolvedValue({
      docs: [{ ref: mockRef1 }, { ref: mockRef2 }],
    } as never);
    vi.mocked(writeBatch).mockReturnValue({
      delete: mockBatchDelete,
      commit: mockBatchCommit,
    } as never);
    await repository.deleteAll("user-1");
    expect(collection).toHaveBeenCalledWith(mockDb, "users", "user-1", "books");
    expect(writeBatch).toHaveBeenCalledWith(mockDb);
    expect(mockBatchDelete).toHaveBeenCalledWith(mockRef1);
    expect(mockBatchDelete).toHaveBeenCalledWith(mockRef2);
    expect(mockBatchCommit).toHaveBeenCalledOnce();
  });

  it("deleteAll handles empty collection without errors", async () => {
    const mockDb = {};
    const mockColl = {};
    const mockQuery = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(collection).mockReturnValue(mockColl as never);
    vi.mocked(query).mockReturnValue(mockQuery as never);
    vi.mocked(getDocs).mockResolvedValue({ docs: [] } as never);
    await repository.deleteAll("user-1");
    expect(writeBatch).not.toHaveBeenCalled();
  });

  it("deleteAll chunks documents into batches of 500", async () => {
    const mockDb = {};
    const mockColl = {};
    const mockQuery = {};
    const docs = Array.from({ length: 501 }, (_, i) => ({
      ref: { id: `ref-${i}` },
    }));
    const mockBatchDelete1 = vi.fn();
    const mockBatchCommit1 = vi.fn().mockResolvedValue(undefined);
    const mockBatchDelete2 = vi.fn();
    const mockBatchCommit2 = vi.fn().mockResolvedValue(undefined);
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(collection).mockReturnValue(mockColl as never);
    vi.mocked(query).mockReturnValue(mockQuery as never);
    vi.mocked(getDocs).mockResolvedValue({ docs } as never);
    vi.mocked(writeBatch)
      .mockReturnValueOnce({
        delete: mockBatchDelete1,
        commit: mockBatchCommit1,
      } as never)
      .mockReturnValueOnce({
        delete: mockBatchDelete2,
        commit: mockBatchCommit2,
      } as never);
    await repository.deleteAll("user-1");
    expect(writeBatch).toHaveBeenCalledTimes(2);
    expect(mockBatchDelete1).toHaveBeenCalledTimes(500);
    expect(mockBatchCommit1).toHaveBeenCalledOnce();
    expect(mockBatchDelete2).toHaveBeenCalledTimes(1);
    expect(mockBatchCommit2).toHaveBeenCalledOnce();
  });
});
