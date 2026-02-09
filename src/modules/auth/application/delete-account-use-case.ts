import type { AuthenticationService } from "@/modules/auth/domain/interfaces";
import type { AuthResult } from "@/modules/auth/domain/types";
import type { BookRepository } from "@/modules/books/domain/interfaces";

type DeleteAccountInput = { userId: string; password?: string };

export class DeleteAccountUseCase {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly bookRepository: BookRepository,
  ) {}

  async execute(input: DeleteAccountInput): Promise<AuthResult> {
    try {
      const reauthResult = input.password
        ? await this.authService.reauthenticateWithPassword(input.password)
        : await this.authService.reauthenticateWithGoogle();
      if (!reauthResult.success) return reauthResult;

      await this.bookRepository.deleteAll(input.userId);
      return this.authService.deleteAccount();
    } catch {
      return { success: false, error: "generic" };
    }
  }
}
