import type { UserSettings } from "@/modules/settings/domain/types";

export interface UserSettingsRepository {
  get(userId: string): Promise<UserSettings | null>;
  set(userId: string, settings: UserSettings): Promise<void>;
}
