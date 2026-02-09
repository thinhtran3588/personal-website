import { BaseUseCase, type EmptyInput } from "@/common/utils/base-use-case";
import type { AuthenticationService } from "@/modules/auth/domain/interfaces";
import type { AuthResult } from "@/modules/auth/domain/types";
import { mapAuthErrorCode } from "@/modules/auth/utils/map-auth-error";

export class SignOutUseCase extends BaseUseCase {
  constructor(private readonly authService: AuthenticationService) {
    super();
  }

  async execute(_input: EmptyInput): Promise<AuthResult> {
    return this.handle(
      () => this.authService.signOut(),
      (err) => mapAuthErrorCode((err as { code?: string })?.code),
    );
  }
}
