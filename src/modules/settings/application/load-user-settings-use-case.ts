import { BaseUseCase } from "@/common/utils/base-use-case";
import type { UserSettingsRepository } from "@/modules/settings/domain/interfaces";
import type { LoadUserSettingsResult } from "@/modules/settings/domain/types";
import { mapSettingsError } from "@/modules/settings/utils/map-settings-error";

type LoadUserSettingsInput = { userId: string | null };

export class LoadUserSettingsUseCase extends BaseUseCase {
  constructor(private readonly repository: UserSettingsRepository) {
    super();
  }

  async execute(input: LoadUserSettingsInput): Promise<LoadUserSettingsResult> {
    if (!input.userId) {
      return { success: true, data: null };
    }
    return this.handle(
      () => this.repository.get(input.userId!),
      (err) => mapSettingsError(err),
    );
  }
}
