"use client";

import {
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
  writeBatch,
  type Firestore,
  type QueryConstraint,
} from "firebase/firestore";

import type {
  BookRepository,
  FindBookQuery,
  FindBooksOutput,
} from "@/modules/books/domain/interfaces";
import type { Book } from "@/modules/books/domain/types";
import {
  NON_BLANK_SEARCH_TEXT_FALLBACK,
  normalizeSearchText,
} from "@/modules/books/utils/normalize-search-text";

const USERS_COLLECTION = "users";
const BOOKS_COLLECTION = "books";
const BATCH_LIMIT = 500;

export type GetFirestoreInstance = () => Firestore | null;

function toEpochMillis(value: unknown): number {
  if (typeof value === "number") return value;
  const t = value as { toMillis?: () => number } | null | undefined;
  const ms = t?.toMillis?.();
  return typeof ms === "number" ? ms : Date.now();
}

function bookFromData(id: string, data: Record<string, unknown>): Book {
  return {
    id,
    title: data.title as string,
    description: data.description as string,
    genres: (data.genres as string[]) ?? [],
    authors: (data.authors as string[]) ?? [],
    links: (data.links as string[]) ?? [],
    createdBy: data.createdBy as string,
    createdAt: toEpochMillis(data.createdAt),
    lastModifiedAt: toEpochMillis(data.lastModifiedAt),
  };
}

type CursorField = "title" | "searchText";

function serializeCursor(
  field: CursorField,
  value: string,
  id: string,
): string {
  return JSON.stringify({ field, value, id });
}

function parseCursor(
  pageCursor: string | null | undefined,
): { field: CursorField; value: string; id: string } | null {
  if (!pageCursor) return null;
  try {
    const parsed = JSON.parse(pageCursor) as {
      field?: string;
      value?: string;
      id?: string;
    };
    if (parsed.field !== "title" && parsed.field !== "searchText") return null;
    return typeof parsed.value === "string" && typeof parsed.id === "string"
      ? { field: parsed.field, value: parsed.value, id: parsed.id }
      : null;
  } catch {
    return null;
  }
}

export class FirestoreBookRepository implements BookRepository {
  constructor(private readonly getFirestoreInstance: GetFirestoreInstance) {}

  async find(
    userId: string,
    queryOptions: FindBookQuery,
  ): Promise<FindBooksOutput> {
    const db = this.getFirestoreInstance();
    if (!db) return { items: [], nextCursor: null, hasMore: false };

    const coll = collection(db, USERS_COLLECTION, userId, BOOKS_COLLECTION);
    const constraints: QueryConstraint[] = [];
    const hasSearch = Boolean(queryOptions.searchTerm?.trim());
    const orderField = hasSearch ? "searchText" : "title";

    if (hasSearch) {
      const normalized = normalizeSearchText(queryOptions.searchTerm!.trim());
      const end = normalized + "\uf8ff";
      constraints.push(
        where("searchText", ">=", normalized),
        where("searchText", "<=", end),
      );
    }
    constraints.push(orderBy(orderField), orderBy(documentId()));
    const cursor = parseCursor(queryOptions.pageCursor);
    if (cursor && cursor.field === orderField) {
      constraints.push(startAfter(cursor.value, cursor.id));
    }
    constraints.push(limit(queryOptions.pageSize + 1));

    const q = query(coll, ...constraints);
    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    const hasMore = docs.length > queryOptions.pageSize;
    const page = hasMore ? docs.slice(0, queryOptions.pageSize) : docs;
    const items = page.map((d) => bookFromData(d.id, d.data()));
    const last = page[page.length - 1];
    const lastData = last?.data();
    const nextCursor =
      hasMore && last && lastData
        ? serializeCursor(
            orderField,
            (lastData[orderField] as string) ?? "",
            last.id,
          )
        : null;

    return { items, nextCursor, hasMore };
  }

  async get(userId: string, bookId: string): Promise<Book | null> {
    const db = this.getFirestoreInstance();
    if (!db) return null;
    const ref = doc(db, USERS_COLLECTION, userId, BOOKS_COLLECTION, bookId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return bookFromData(snap.id, snap.data());
  }

  async create(userId: string, book: Book): Promise<void> {
    const db = this.getFirestoreInstance();
    if (!db) return;
    const ref = doc(db, USERS_COLLECTION, userId, BOOKS_COLLECTION, book.id);
    const now = Date.now();
    await setDoc(ref, {
      title: book.title,
      description: book.description,
      genres: book.genres,
      authors: book.authors,
      links: book.links,
      createdBy: book.createdBy,
      createdAt: now,
      lastModifiedAt: now,
      searchText:
        normalizeSearchText(book.title) || NON_BLANK_SEARCH_TEXT_FALLBACK,
    });
  }

  async update(
    userId: string,
    bookId: string,
    data: Partial<
      Omit<Book, "id" | "createdBy" | "createdAt" | "lastModifiedAt">
    >,
  ): Promise<void> {
    const db = this.getFirestoreInstance();
    if (!db) return;
    const ref = doc(db, USERS_COLLECTION, userId, BOOKS_COLLECTION, bookId);
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) {
      updateData.title = data.title;
      updateData.searchText =
        normalizeSearchText(data.title) || NON_BLANK_SEARCH_TEXT_FALLBACK;
    }
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.genres !== undefined) updateData.genres = data.genres;
    if (data.authors !== undefined) updateData.authors = data.authors;
    if (data.links !== undefined) updateData.links = data.links;
    updateData.lastModifiedAt = Date.now();
    if (Object.keys(updateData).length === 1) return;
    await updateDoc(ref, updateData);
  }

  async delete(userId: string, bookId: string): Promise<void> {
    const db = this.getFirestoreInstance();
    if (!db) return;
    const ref = doc(db, USERS_COLLECTION, userId, BOOKS_COLLECTION, bookId);
    await deleteDoc(ref);
  }

  async deleteAll(userId: string): Promise<void> {
    const db = this.getFirestoreInstance();
    if (!db) return;
    const coll = collection(db, USERS_COLLECTION, userId, BOOKS_COLLECTION);
    const snapshot = await getDocs(query(coll));
    if (snapshot.docs.length === 0) return;
    for (let i = 0; i < snapshot.docs.length; i += BATCH_LIMIT) {
      const chunk = snapshot.docs.slice(i, i + BATCH_LIMIT);
      const batch = writeBatch(db);
      chunk.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  }
}
