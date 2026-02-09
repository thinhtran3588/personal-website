import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  updatePassword as firebaseUpdatePassword,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  FirebaseAuthenticationService,
  type GetAuthInstance,
} from "@/modules/auth/infrastructure/services/firebase-auth-service";

const mockUnsubscribe = vi.fn();

describe("FirebaseAuthenticationService", () => {
  let service: FirebaseAuthenticationService;
  let mockGetAuthInstance: ReturnType<typeof vi.fn<GetAuthInstance>>;

  beforeEach(() => {
    mockGetAuthInstance = vi.fn();
    vi.mocked(signInWithPopup).mockReset();
    vi.mocked(signInWithEmailAndPassword).mockReset();
    vi.mocked(createUserWithEmailAndPassword).mockReset();
    vi.mocked(updateProfile).mockReset();
    vi.mocked(sendPasswordResetEmail).mockReset();
    vi.mocked(signOut).mockReset();
    vi.mocked(onAuthStateChanged).mockReset().mockReturnValue(mockUnsubscribe);
    vi.mocked(reauthenticateWithCredential).mockReset();
    vi.mocked(firebaseUpdatePassword).mockReset();
    vi.mocked(deleteUser).mockReset();
    vi.mocked(reauthenticateWithPopup).mockReset();
    service = new FirebaseAuthenticationService(mockGetAuthInstance);
  });

  it("signInWithGoogle throws when auth is not available", async () => {
    mockGetAuthInstance.mockReturnValue(null);
    await expect(service.signInWithGoogle()).rejects.toThrow(
      "Auth not available",
    );
  });

  it("signInWithEmail throws when auth is not available", async () => {
    mockGetAuthInstance.mockReturnValue(null);
    await expect(service.signInWithEmail("a@b.com", "pass")).rejects.toThrow(
      "Auth not available",
    );
  });

  it("signUpWithEmail throws when auth is not available", async () => {
    mockGetAuthInstance.mockReturnValue(null);
    await expect(service.signUpWithEmail("a@b.com", "pass")).rejects.toThrow(
      "Auth not available",
    );
  });

  it("sendPasswordReset throws when auth is not available", async () => {
    mockGetAuthInstance.mockReturnValue(null);
    await expect(service.sendPasswordReset("a@b.com")).rejects.toThrow(
      "Auth not available",
    );
  });

  it("signOut returns without throwing when auth is null", async () => {
    mockGetAuthInstance.mockReturnValue(null);
    await expect(service.signOut()).resolves.toBeUndefined();
  });

  it("subscribeToAuthState calls callback with null and returns no-op when auth is null", () => {
    mockGetAuthInstance.mockReturnValue(null);
    const callback = vi.fn();
    const unsubscribe = service.subscribeToAuthState(callback);
    expect(callback).toHaveBeenCalledWith(null);
    expect(typeof unsubscribe).toBe("function");
    unsubscribe();
    expect(mockUnsubscribe).not.toHaveBeenCalled();
  });

  it("when auth is available, signInWithGoogle calls signInWithPopup", async () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.mocked(signInWithPopup).mockResolvedValue({} as never);
    await service.signInWithGoogle();
    expect(signInWithPopup).toHaveBeenCalledWith(mockAuth, expect.anything());
  });

  it("when auth is available, signInWithEmail calls signInWithEmailAndPassword", async () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
      user: {},
    } as never);
    await service.signInWithEmail("a@b.com", "pass");
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuth,
      "a@b.com",
      "pass",
    );
  });

  it("when auth is available, signUpWithEmail creates user and updates profile when displayName provided", async () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    const mockUser = { uid: "1" };
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
      user: mockUser as never,
    } as never);
    vi.mocked(updateProfile).mockResolvedValue(undefined as never);
    await service.signUpWithEmail("a@b.com", "pass", "Alice");
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuth,
      "a@b.com",
      "pass",
    );
    expect(updateProfile).toHaveBeenCalledWith(mockUser, {
      displayName: "Alice",
    });
  });

  it("when auth is available, signUpWithEmail does not call updateProfile when displayName is empty", async () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    const mockUser = {};
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
      user: mockUser as never,
    } as never);
    await service.signUpWithEmail("a@b.com", "pass");
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it("when auth is available, sendPasswordReset calls sendPasswordResetEmail", async () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.mocked(sendPasswordResetEmail).mockResolvedValue(undefined as never);
    await service.sendPasswordReset("a@b.com");
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(mockAuth, "a@b.com");
  });

  it("when auth is available, signOut calls firebase signOut", async () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.mocked(signOut).mockResolvedValue(undefined as never);
    await service.signOut();
    expect(signOut).toHaveBeenCalledWith(mockAuth);
  });

  it("when auth is available, subscribeToAuthState returns unsubscribe from onAuthStateChanged", () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.mocked(onAuthStateChanged).mockReturnValue(mockUnsubscribe);
    const callback = vi.fn();
    const unsubscribe = service.subscribeToAuthState(callback);
    expect(onAuthStateChanged).toHaveBeenCalledWith(
      mockAuth,
      expect.any(Function),
    );
    unsubscribe();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it("subscribeToAuthState callback maps firebase user to AuthUser", () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    let stateCallback: (user: unknown) => void = () => {};
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, cb) => {
      stateCallback = cb as (user: unknown) => void;
      return mockUnsubscribe;
    });
    const callback = vi.fn();
    service.subscribeToAuthState(callback);
    stateCallback({
      uid: "uid-1",
      email: "a@b.com",
      displayName: "Alice",
      photoURL: "https://photo.url",
    });
    expect(callback).toHaveBeenCalledWith({
      id: "uid-1",
      email: "a@b.com",
      displayName: "Alice",
      photoURL: "https://photo.url",
      authType: "other",
    });
  });

  it("subscribeToAuthState callback maps firebase user with google.com provider to authType google", () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    let stateCallback: (user: unknown) => void = () => {};
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, cb) => {
      stateCallback = cb as (user: unknown) => void;
      return mockUnsubscribe;
    });
    const callback = vi.fn();
    service.subscribeToAuthState(callback);
    stateCallback({
      uid: "uid-1",
      email: "a@b.com",
      displayName: "Alice",
      photoURL: "https://photo.url",
      providerData: [{ providerId: "google.com" }],
    });
    expect(callback).toHaveBeenCalledWith({
      id: "uid-1",
      email: "a@b.com",
      displayName: "Alice",
      photoURL: "https://photo.url",
      authType: "google",
    });
  });

  it("subscribeToAuthState callback maps firebase user with apple.com provider to authType apple", () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    let stateCallback: (user: unknown) => void = () => {};
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, cb) => {
      stateCallback = cb as (user: unknown) => void;
      return mockUnsubscribe;
    });
    const callback = vi.fn();
    service.subscribeToAuthState(callback);
    stateCallback({
      uid: "uid-1",
      email: "a@b.com",
      displayName: "Alice",
      photoURL: null,
      providerData: [{ providerId: "apple.com" }],
    });
    expect(callback).toHaveBeenCalledWith({
      id: "uid-1",
      email: "a@b.com",
      displayName: "Alice",
      photoURL: null,
      authType: "apple",
    });
  });

  it("subscribeToAuthState callback maps firebase user with password provider to authType email", () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    let stateCallback: (user: unknown) => void = () => {};
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, cb) => {
      stateCallback = cb as (user: unknown) => void;
      return mockUnsubscribe;
    });
    const callback = vi.fn();
    service.subscribeToAuthState(callback);
    stateCallback({
      uid: "uid-1",
      email: "a@b.com",
      displayName: "Alice",
      photoURL: null,
      providerData: [{ providerId: "password" }],
    });
    expect(callback).toHaveBeenCalledWith({
      id: "uid-1",
      email: "a@b.com",
      displayName: "Alice",
      photoURL: null,
      authType: "email",
    });
  });

  it("subscribeToAuthState callback maps firebase user with null fields to AuthUser", () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    let stateCallback: (user: unknown) => void = () => {};
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, cb) => {
      stateCallback = cb as (user: unknown) => void;
      return mockUnsubscribe;
    });
    const callback = vi.fn();
    service.subscribeToAuthState(callback);
    stateCallback({
      uid: "uid-1",
      email: null,
      displayName: null,
      photoURL: null,
    });
    expect(callback).toHaveBeenCalledWith({
      id: "uid-1",
      email: null,
      displayName: null,
      photoURL: null,
      authType: "other",
    });
  });

  it("subscribeToAuthState callback receives null when firebase user is null", () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    let stateCallback: (user: unknown) => void = () => {};
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, cb) => {
      stateCallback = cb as (user: unknown) => void;
      return mockUnsubscribe;
    });
    const callback = vi.fn();
    service.subscribeToAuthState(callback);
    stateCallback(null);
    expect(callback).toHaveBeenCalledWith(null);
  });

  it("signUpWithEmail trims displayName when provided with spaces", async () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    const mockUser = { uid: "1" };
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
      user: mockUser as never,
    } as never);
    vi.mocked(updateProfile).mockResolvedValue(undefined as never);
    await service.signUpWithEmail("a@b.com", "pass", "  Alice  ");
    expect(updateProfile).toHaveBeenCalledWith(mockUser, {
      displayName: "Alice",
    });
  });

  it("updateDisplayName throws when auth is not available", async () => {
    mockGetAuthInstance.mockReturnValue(null);
    await expect(service.updateDisplayName("Alice")).rejects.toThrow(
      "Auth not available",
    );
  });

  it("updateDisplayName returns generic error when currentUser is null", async () => {
    const mockAuth = {
      currentUser: null,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    const result = await service.updateDisplayName("Alice");
    expect(result).toEqual({ success: false, error: "generic" });
  });

  it("updateDisplayName calls updateProfile and returns success", async () => {
    const mockUser = { uid: "1" };
    const mockAuth = {
      currentUser: mockUser,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.mocked(updateProfile).mockResolvedValue(undefined as never);
    const result = await service.updateDisplayName("Alice");
    expect(updateProfile).toHaveBeenCalledWith(mockUser, {
      displayName: "Alice",
    });
    expect(result).toEqual({ success: true });
  });

  it("updateDisplayName returns mapped error when updateProfile throws", async () => {
    const mockUser = { uid: "1" };
    const mockAuth = {
      currentUser: mockUser,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.mocked(updateProfile).mockRejectedValue({
      code: "auth/too-many-requests",
    });
    const result = await service.updateDisplayName("Alice");
    expect(result).toEqual({ success: false, error: "too-many-requests" });
  });

  it("updatePassword returns generic error when currentUser is null", async () => {
    const mockAuth = {
      currentUser: null,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    const result = await service.updatePassword("old", "new");
    expect(result).toEqual({ success: false, error: "generic" });
  });

  it("updatePassword returns generic error when user has no email", async () => {
    const mockUser = { email: null };
    const mockAuth = {
      currentUser: mockUser,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    const result = await service.updatePassword("old", "new");
    expect(result).toEqual({ success: false, error: "generic" });
  });

  it("updatePassword reauthenticates then updates password and returns success", async () => {
    const mockCredential = {};
    const mockUser = { email: "a@b.com" };
    const mockAuth = {
      currentUser: mockUser,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.spyOn(EmailAuthProvider, "credential").mockReturnValue(
      mockCredential as never,
    );
    vi.mocked(reauthenticateWithCredential).mockResolvedValue(
      undefined as never,
    );
    vi.mocked(firebaseUpdatePassword).mockResolvedValue(undefined as never);
    const result = await service.updatePassword("oldPass", "newPass");
    expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
      "a@b.com",
      "oldPass",
    );
    expect(reauthenticateWithCredential).toHaveBeenCalledWith(
      mockUser,
      mockCredential,
    );
    expect(firebaseUpdatePassword).toHaveBeenCalledWith(mockUser, "newPass");
    expect(result).toEqual({ success: true });
  });

  it("updatePassword returns mapped error when reauthenticateWithCredential throws", async () => {
    const mockUser = { email: "a@b.com" };
    const mockAuth = {
      currentUser: mockUser,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.spyOn(EmailAuthProvider, "credential").mockReturnValue({} as never);
    vi.mocked(reauthenticateWithCredential).mockRejectedValue({
      code: "auth/invalid-credential",
    });
    const result = await service.updatePassword("old", "new");
    expect(result).toEqual({ success: false, error: "invalid-credentials" });
  });

  it("updatePassword returns mapped error when firebaseUpdatePassword throws", async () => {
    const mockCredential = {};
    const mockUser = { email: "a@b.com" };
    const mockAuth = {
      currentUser: mockUser,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.spyOn(EmailAuthProvider, "credential").mockReturnValue(
      mockCredential as never,
    );
    vi.mocked(reauthenticateWithCredential).mockResolvedValue(
      undefined as never,
    );
    vi.mocked(firebaseUpdatePassword).mockRejectedValue({
      code: "auth/weak-password",
    });
    const result = await service.updatePassword("old", "new");
    expect(result).toEqual({ success: false, error: "generic" });
  });

  it("reauthenticateWithPassword throws when auth is not available", async () => {
    mockGetAuthInstance.mockReturnValue(null);
    await expect(service.reauthenticateWithPassword("pass")).rejects.toThrow(
      "Auth not available",
    );
  });

  it("reauthenticateWithPassword returns generic error when currentUser is null", async () => {
    const mockAuth = {
      currentUser: null,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    const result = await service.reauthenticateWithPassword("pass");
    expect(result).toEqual({ success: false, error: "generic" });
  });

  it("reauthenticateWithPassword returns generic error when user has no email", async () => {
    const mockUser = { email: null };
    const mockAuth = {
      currentUser: mockUser,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    const result = await service.reauthenticateWithPassword("pass");
    expect(result).toEqual({ success: false, error: "generic" });
  });

  it("reauthenticateWithPassword reauthenticates and returns success", async () => {
    const mockCredential = {};
    const mockUser = { email: "a@b.com" };
    const mockAuth = {
      currentUser: mockUser,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.spyOn(EmailAuthProvider, "credential").mockReturnValue(
      mockCredential as never,
    );
    vi.mocked(reauthenticateWithCredential).mockResolvedValue(
      undefined as never,
    );
    const result = await service.reauthenticateWithPassword("my-pass");
    expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
      "a@b.com",
      "my-pass",
    );
    expect(reauthenticateWithCredential).toHaveBeenCalledWith(
      mockUser,
      mockCredential,
    );
    expect(result).toEqual({ success: true });
  });

  it("reauthenticateWithPassword returns mapped error on failure", async () => {
    const mockUser = { email: "a@b.com" };
    const mockAuth = {
      currentUser: mockUser,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.spyOn(EmailAuthProvider, "credential").mockReturnValue({} as never);
    vi.mocked(reauthenticateWithCredential).mockRejectedValue({
      code: "auth/invalid-credential",
    });
    const result = await service.reauthenticateWithPassword("wrong");
    expect(result).toEqual({ success: false, error: "invalid-credentials" });
  });

  it("reauthenticateWithGoogle throws when auth is not available", async () => {
    mockGetAuthInstance.mockReturnValue(null);
    await expect(service.reauthenticateWithGoogle()).rejects.toThrow(
      "Auth not available",
    );
  });

  it("reauthenticateWithGoogle returns generic error when currentUser is null", async () => {
    const mockAuth = {
      currentUser: null,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    const result = await service.reauthenticateWithGoogle();
    expect(result).toEqual({ success: false, error: "generic" });
  });

  it("reauthenticateWithGoogle calls reauthenticateWithPopup and returns success", async () => {
    const mockUser = { uid: "1" };
    const mockAuth = {
      currentUser: mockUser,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.mocked(reauthenticateWithPopup).mockResolvedValue(undefined as never);
    const result = await service.reauthenticateWithGoogle();
    expect(reauthenticateWithPopup).toHaveBeenCalledWith(
      mockUser,
      expect.anything(),
    );
    expect(result).toEqual({ success: true });
  });

  it("reauthenticateWithGoogle returns mapped error on failure", async () => {
    const mockUser = { uid: "1" };
    const mockAuth = {
      currentUser: mockUser,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.mocked(reauthenticateWithPopup).mockRejectedValue({
      code: "auth/too-many-requests",
    });
    const result = await service.reauthenticateWithGoogle();
    expect(result).toEqual({ success: false, error: "too-many-requests" });
  });

  it("deleteAccount throws when auth is not available", async () => {
    mockGetAuthInstance.mockReturnValue(null);
    await expect(service.deleteAccount()).rejects.toThrow("Auth not available");
  });

  it("deleteAccount returns generic error when currentUser is null", async () => {
    const mockAuth = {
      currentUser: null,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    const result = await service.deleteAccount();
    expect(result).toEqual({ success: false, error: "generic" });
  });

  it("deleteAccount calls deleteUser and returns success", async () => {
    const mockUser = { uid: "1" };
    const mockAuth = {
      currentUser: mockUser,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.mocked(deleteUser).mockResolvedValue(undefined as never);
    const result = await service.deleteAccount();
    expect(deleteUser).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual({ success: true });
  });

  it("deleteAccount returns mapped error when deleteUser throws", async () => {
    const mockUser = { uid: "1" };
    const mockAuth = {
      currentUser: mockUser,
    } as unknown as import("firebase/auth").Auth;
    mockGetAuthInstance.mockReturnValue(mockAuth);
    vi.mocked(deleteUser).mockRejectedValue({
      code: "auth/too-many-requests",
    });
    const result = await service.deleteAccount();
    expect(result).toEqual({ success: false, error: "too-many-requests" });
  });
});
