import { BaseUseCase } from "@/common/utils/base-use-case";
import type { AuthenticationService } from "@/modules/auth/domain/interfaces";
import type { AuthResult } from "@/modules/auth/domain/types";
import { mapAuthErrorCode } from "@/modules/auth/utils/map-auth-error";

export class SignInWithEmailUseCase extends BaseUseCase {
  constructor(private readonly authService: AuthenticationService) {
    super();
  }

  async execute(input: {
    email: string;
    password: string;
  }): Promise<AuthResult> {
    return this.handle(
      () => this.authService.signInWithEmail(input.email, input.password),
      (err) => mapAuthErrorCode((err as { code?: string })?.code),
    );
  }
}
