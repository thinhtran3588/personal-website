import type { EmptyInput } from "@/common/utils/base-use-case";
import type { AuthenticationService } from "@/modules/auth/domain/interfaces";
import type { AuthStateSubscription } from "@/modules/auth/domain/types";

export class GetAuthStateSubscriptionUseCase {
  constructor(private readonly authService: AuthenticationService) {}

  execute(_input: EmptyInput): AuthStateSubscription {
    return {
      subscribe: (callback) => this.authService.subscribeToAuthState(callback),
    };
  }
}
