export type UserSettings = {
  locale?: string;
  theme?: "light" | "dark" | "system";
};

export type SettingsErrorCode = "unavailable" | "generic";

export type LoadUserSettingsResult =
  | { success: true; data: UserSettings | null }
  | { success: false; error: SettingsErrorCode };

export type SaveUserSettingsResult =
  | { success: true }
  | { success: false; error: SettingsErrorCode };
