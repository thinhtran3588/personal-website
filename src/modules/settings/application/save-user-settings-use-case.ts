import { BaseUseCase } from "@/common/utils/base-use-case";
import type { UserSettingsRepository } from "@/modules/settings/domain/interfaces";
import type {
  SaveUserSettingsResult,
  UserSettings,
} from "@/modules/settings/domain/types";
import { mapSettingsError } from "@/modules/settings/utils/map-settings-error";

type SaveUserSettingsInput = { userId: string | null; settings: UserSettings };

export class SaveUserSettingsUseCase extends BaseUseCase {
  constructor(private readonly repository: UserSettingsRepository) {
    super();
  }

  async execute(input: SaveUserSettingsInput): Promise<SaveUserSettingsResult> {
    if (!input.userId) {
      return { success: true };
    }
    return this.handle(
      () => this.repository.set(input.userId!, input.settings),
      (err) => mapSettingsError(err),
    );
  }
}
