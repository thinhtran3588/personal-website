const DEFAULT_MAX_LENGTH = 500;

export const NON_BLANK_SEARCH_TEXT_FALLBACK = " ";

/**
 * Normalizes text for search indexing: lowercase, remove diacritics/tone marks, truncate.
 */
export function normalizeSearchText(
  text: string,
  maxLength: number = DEFAULT_MAX_LENGTH,
): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const withoutDiacritics = trimmed.normalize("NFD").replace(/\p{M}/gu, "");
  const lower = withoutDiacritics.toLowerCase();
  return lower.length > maxLength ? lower.slice(0, maxLength) : lower;
}
