import { asFunction, type AwilixContainer } from "awilix";

import { CreateBookUseCase } from "@/modules/books/application/create-book-use-case";
import { DeleteBookUseCase } from "@/modules/books/application/delete-book-use-case";
import { FindBooksUseCase } from "@/modules/books/application/find-books-use-case";
import { GetBookUseCase } from "@/modules/books/application/get-book-use-case";
import { UpdateBookUseCase } from "@/modules/books/application/update-book-use-case";
import { FirestoreBookRepository } from "@/modules/books/infrastructure/repositories/firestore-book-repository";

type GetFirestoreInstance = () => import("firebase/firestore").Firestore | null;

type BooksCradle = {
  getFirestoreInstance: GetFirestoreInstance;
  bookRepository: InstanceType<typeof FirestoreBookRepository>;
};

export function registerModule(container: AwilixContainer<object>): void {
  container.register({
    bookRepository: asFunction(
      (c: { getFirestoreInstance: GetFirestoreInstance }) =>
        new FirestoreBookRepository(c.getFirestoreInstance),
    ).singleton(),
    findBooksUseCase: asFunction(
      (c: BooksCradle) => new FindBooksUseCase(c.bookRepository),
    ).singleton(),
    getBookUseCase: asFunction(
      (c: BooksCradle) => new GetBookUseCase(c.bookRepository),
    ).singleton(),
    createBookUseCase: asFunction(
      (c: BooksCradle) => new CreateBookUseCase(c.bookRepository),
    ).singleton(),
    updateBookUseCase: asFunction(
      (c: BooksCradle) => new UpdateBookUseCase(c.bookRepository),
    ).singleton(),
    deleteBookUseCase: asFunction(
      (c: BooksCradle) => new DeleteBookUseCase(c.bookRepository),
    ).singleton(),
  });
}
