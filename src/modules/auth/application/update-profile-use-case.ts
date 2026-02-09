import type { AuthenticationService } from "@/modules/auth/domain/interfaces";
import type { AuthResult } from "@/modules/auth/domain/types";

type UpdateProfileInput = { displayName: string };

export class UpdateProfileUseCase {
  constructor(private readonly authService: AuthenticationService) {}

  async execute(input: UpdateProfileInput): Promise<AuthResult> {
    return this.authService.updateDisplayName(input.displayName);
  }
}
