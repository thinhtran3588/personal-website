import type {
  AuthResult,
  AuthStateCallback,
} from "@/modules/auth/domain/types";

export interface AuthenticationService {
  signInWithGoogle(): Promise<void>;
  signInWithEmail(email: string, password: string): Promise<void>;
  signUpWithEmail(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<void>;
  sendPasswordReset(email: string): Promise<void>;
  signOut(): Promise<void>;
  subscribeToAuthState(callback: AuthStateCallback): () => void;
  updateDisplayName(displayName: string): Promise<AuthResult>;
  updatePassword(oldPassword: string, newPassword: string): Promise<AuthResult>;
  reauthenticateWithPassword(password: string): Promise<AuthResult>;
  reauthenticateWithGoogle(): Promise<AuthResult>;
  deleteAccount(): Promise<AuthResult>;
}
