"use client";

import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  signOut as firebaseSignOut,
  updatePassword as firebaseUpdatePassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  type Auth,
} from "firebase/auth";

import type { AuthenticationService } from "@/modules/auth/domain/interfaces";
import {
  AuthType,
  type AuthResult,
  type AuthUser,
} from "@/modules/auth/domain/types";
import { mapAuthErrorCode } from "@/modules/auth/utils/map-auth-error";

export type GetAuthInstance = () => Auth | null;

function getAuthOrThrow(getAuthInstance: GetAuthInstance): Auth {
  const auth = getAuthInstance();
  if (!auth) throw new Error("Auth not available");
  return auth;
}

function providerIdToAuthType(providerId: string | undefined): AuthType {
  if (providerId === "password") return AuthType.Email;
  if (providerId === "google.com") return AuthType.Google;
  if (providerId === "apple.com") return AuthType.Apple;
  return AuthType.Other;
}

function mapFirebaseUserToAuthUser(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerData?: Array<{ providerId?: string }>;
}): AuthUser {
  const authType = providerIdToAuthType(user.providerData?.[0]?.providerId);
  return {
    id: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    authType,
  };
}

export class FirebaseAuthenticationService implements AuthenticationService {
  constructor(private readonly getAuthInstance: GetAuthInstance) {}

  async signInWithGoogle(): Promise<void> {
    await signInWithPopup(
      getAuthOrThrow(this.getAuthInstance),
      new GoogleAuthProvider(),
    );
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(
      getAuthOrThrow(this.getAuthInstance),
      email,
      password,
    );
  }

  async signUpWithEmail(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<void> {
    const { user } = await createUserWithEmailAndPassword(
      getAuthOrThrow(this.getAuthInstance),
      email,
      password,
    );
    if (displayName?.trim()) {
      await updateProfile(user, { displayName: displayName.trim() });
    }
  }

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(getAuthOrThrow(this.getAuthInstance), email);
  }

  async signOut(): Promise<void> {
    const auth = this.getAuthInstance();
    if (!auth) return;
    await firebaseSignOut(auth);
  }

  subscribeToAuthState(callback: (user: AuthUser | null) => void): () => void {
    const auth = this.getAuthInstance();
    if (!auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, (firebaseUser) => {
      callback(firebaseUser ? mapFirebaseUserToAuthUser(firebaseUser) : null);
    });
  }

  async updateDisplayName(
    displayName: string,
  ): Promise<import("@/modules/auth/domain/types").AuthResult> {
    const auth = getAuthOrThrow(this.getAuthInstance);
    const user = auth.currentUser;
    if (!user) return { success: false, error: "generic" };
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: mapAuthErrorCode((err as { code?: string })?.code),
      };
    }
  }

  async updatePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<AuthResult> {
    const auth = getAuthOrThrow(this.getAuthInstance);
    const user = auth.currentUser;
    if (!user?.email) return { success: false, error: "generic" };
    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await firebaseUpdatePassword(user, newPassword);
      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: mapAuthErrorCode((err as { code?: string })?.code),
      };
    }
  }

  async reauthenticateWithPassword(password: string): Promise<AuthResult> {
    const auth = getAuthOrThrow(this.getAuthInstance);
    const user = auth.currentUser;
    if (!user?.email) return { success: false, error: "generic" };
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: mapAuthErrorCode((err as { code?: string })?.code),
      };
    }
  }

  async reauthenticateWithGoogle(): Promise<AuthResult> {
    const auth = getAuthOrThrow(this.getAuthInstance);
    const user = auth.currentUser;
    if (!user) return { success: false, error: "generic" };
    try {
      await reauthenticateWithPopup(user, new GoogleAuthProvider());
      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: mapAuthErrorCode((err as { code?: string })?.code),
      };
    }
  }

  async deleteAccount(): Promise<AuthResult> {
    const auth = getAuthOrThrow(this.getAuthInstance);
    const user = auth.currentUser;
    if (!user) return { success: false, error: "generic" };
    try {
      await deleteUser(user);
      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: mapAuthErrorCode((err as { code?: string })?.code),
      };
    }
  }
}
