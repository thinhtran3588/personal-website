import { asFunction, type AwilixContainer } from "awilix";

import { DeleteAccountUseCase } from "@/modules/auth/application/delete-account-use-case";
import { GetAuthStateSubscriptionUseCase } from "@/modules/auth/application/get-auth-state-subscription-use-case";
import { SendPasswordResetUseCase } from "@/modules/auth/application/send-password-reset-use-case";
import { SignInWithEmailUseCase } from "@/modules/auth/application/sign-in-with-email-use-case";
import { SignInWithGoogleUseCase } from "@/modules/auth/application/sign-in-with-google-use-case";
import { SignOutUseCase } from "@/modules/auth/application/sign-out-use-case";
import { SignUpWithEmailUseCase } from "@/modules/auth/application/sign-up-with-email-use-case";
import { UpdatePasswordUseCase } from "@/modules/auth/application/update-password-use-case";
import { UpdateProfileUseCase } from "@/modules/auth/application/update-profile-use-case";
import {
  FirebaseAuthenticationService,
  type GetAuthInstance,
} from "@/modules/auth/infrastructure/services/firebase-auth-service";
import type { BookRepository } from "@/modules/books/domain/interfaces";

type AuthCradle = {
  authService: InstanceType<typeof FirebaseAuthenticationService>;
  bookRepository: BookRepository;
  getAuthInstance: GetAuthInstance;
};

export function registerModule(container: AwilixContainer<object>): void {
  container.register({
    authService: asFunction(
      (c: AuthCradle) => new FirebaseAuthenticationService(c.getAuthInstance),
    ).singleton(),
    signInWithGoogleUseCase: asFunction(
      (c: AuthCradle) => new SignInWithGoogleUseCase(c.authService),
    ).singleton(),
    signInWithEmailUseCase: asFunction(
      (c: AuthCradle) => new SignInWithEmailUseCase(c.authService),
    ).singleton(),
    signUpWithEmailUseCase: asFunction(
      (c: AuthCradle) => new SignUpWithEmailUseCase(c.authService),
    ).singleton(),
    sendPasswordResetUseCase: asFunction(
      (c: AuthCradle) => new SendPasswordResetUseCase(c.authService),
    ).singleton(),
    signOutUseCase: asFunction(
      (c: AuthCradle) => new SignOutUseCase(c.authService),
    ).singleton(),
    getAuthStateSubscriptionUseCase: asFunction(
      (c: AuthCradle) => new GetAuthStateSubscriptionUseCase(c.authService),
    ).singleton(),
    updateProfileUseCase: asFunction(
      (c: AuthCradle) => new UpdateProfileUseCase(c.authService),
    ).singleton(),
    updatePasswordUseCase: asFunction(
      (c: AuthCradle) => new UpdatePasswordUseCase(c.authService),
    ).singleton(),
    deleteAccountUseCase: asFunction(
      (c: AuthCradle) =>
        new DeleteAccountUseCase(c.authService, c.bookRepository),
    ).singleton(),
  });
}
