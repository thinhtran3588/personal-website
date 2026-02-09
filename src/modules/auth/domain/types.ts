export const AuthType = {
  Email: "email",
  Google: "google",
  Apple: "apple",
  Other: "other",
} as const;

export type AuthType = (typeof AuthType)[keyof typeof AuthType];

export type AuthUser = {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  authType: AuthType;
};

export type AuthErrorCode =
  | "invalid-credentials"
  | "too-many-requests"
  | "email-already-in-use"
  | "requires-recent-login"
  | "generic";

export type AuthResult =
  | { success: true }
  | { success: false; error: AuthErrorCode };

export type AuthStateCallback = (user: AuthUser | null) => void;

export type AuthStateSubscription = {
  subscribe: (callback: AuthStateCallback) => () => void;
};
