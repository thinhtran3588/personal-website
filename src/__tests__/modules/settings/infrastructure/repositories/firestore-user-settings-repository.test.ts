import { doc, getDoc, setDoc } from "firebase/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FirestoreUserSettingsRepository } from "@/modules/settings/infrastructure/repositories/firestore-user-settings-repository";

describe("FirestoreUserSettingsRepository", () => {
  let repository: FirestoreUserSettingsRepository;
  let getFirestoreInstance: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.mocked(doc).mockReset();
    vi.mocked(getDoc).mockReset();
    vi.mocked(setDoc).mockReset();
    getFirestoreInstance = vi.fn();
    repository = new FirestoreUserSettingsRepository(getFirestoreInstance);
  });

  it("get returns null when Firestore is not available", async () => {
    getFirestoreInstance.mockReturnValue(null);
    await expect(repository.get("user-1")).resolves.toBeNull();
    expect(getDoc).not.toHaveBeenCalled();
  });

  it("get returns null when document does not exist", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    vi.mocked(getDoc).mockResolvedValue({ exists: () => false } as never);
    await expect(repository.get("user-1")).resolves.toBeNull();
    expect(doc).toHaveBeenCalledWith(mockDb, "user-settings", "user-1");
  });

  it("get returns settings when document exists", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({ locale: "vi", theme: "dark" }),
    } as never);
    await expect(repository.get("user-1")).resolves.toEqual({
      locale: "vi",
      theme: "dark",
    });
  });

  it("set does nothing when Firestore is not available", async () => {
    getFirestoreInstance.mockReturnValue(null);
    await repository.set("user-1", { locale: "en" });
    expect(setDoc).not.toHaveBeenCalled();
  });

  it("set writes document when Firestore is available", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    vi.mocked(setDoc).mockResolvedValue(undefined);
    await repository.set("user-1", { locale: "en", theme: "light" });
    expect(doc).toHaveBeenCalledWith(mockDb, "user-settings", "user-1");
    expect(setDoc).toHaveBeenCalledWith(mockRef, {
      locale: "en",
      theme: "light",
    });
  });

  it("set serializes undefined fields as null", async () => {
    const mockDb = {};
    const mockRef = {};
    getFirestoreInstance.mockReturnValue(mockDb as never);
    vi.mocked(doc).mockReturnValue(mockRef as never);
    await repository.set("user-1", {});
    expect(setDoc).toHaveBeenCalledWith(mockRef, {
      locale: null,
      theme: null,
    });
  });
});
