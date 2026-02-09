import type { AuthErrorCode } from "@/modules/auth/domain/types";

export function mapAuthErrorCode(code: string | undefined): AuthErrorCode {
  if (
    code === "auth/invalid-credential" ||
    code === "auth/user-not-found" ||
    code === "auth/wrong-password"
  ) {
    return "invalid-credentials";
  }
  if (code === "auth/too-many-requests") return "too-many-requests";
  if (code === "auth/email-already-in-use") return "email-already-in-use";
  if (code === "auth/requires-recent-login") return "requires-recent-login";
  return "generic";
}
