import type { AuthenticationService } from "@/modules/auth/domain/interfaces";
import type { AuthResult } from "@/modules/auth/domain/types";

type UpdatePasswordInput = {
  oldPassword: string;
  newPassword: string;
};

export class UpdatePasswordUseCase {
  constructor(private readonly authService: AuthenticationService) {}

  async execute(input: UpdatePasswordInput): Promise<AuthResult> {
    return this.authService.updatePassword(
      input.oldPassword,
      input.newPassword,
    );
  }
}
