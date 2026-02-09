import type { SettingsErrorCode } from "@/modules/settings/domain/types";

const UNAVAILABLE_PATTERNS = [
  "permission",
  "unavailable",
  "network",
  "failed to fetch",
];

export function mapSettingsError(err: unknown): SettingsErrorCode {
  if (!(err instanceof Error)) return "generic";
  const message = (err.message ?? "").toLowerCase();
  const isUnavailable = UNAVAILABLE_PATTERNS.some((p) => message.includes(p));
  return isUnavailable ? "unavailable" : "generic";
}
