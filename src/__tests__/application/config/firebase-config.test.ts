import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.unmock("@/application/config/firebase-config");
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({})),
}));
vi.mock("firebase/analytics", () => ({
  getAnalytics: vi.fn(() => ({})),
}));
vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
}));

const validFirebaseConfigJson = JSON.stringify({
  apiKey: "test-api-key",
  authDomain: "test.firebaseapp.com",
  projectId: "test-project",
  storageBucket: "test.firebasestorage.app",
  messagingSenderId: "123",
  appId: "1:123:web:abc",
  measurementId: "G-TEST",
});

describe("firebase-config", () => {
  const originalWindow = globalThis.window;
  const originalEnv = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

  beforeEach(async () => {
    process.env.NEXT_PUBLIC_FIREBASE_CONFIG = validFirebaseConfigJson;
    vi.resetModules();
    const auth = await import("firebase/auth");
    vi.mocked(auth.getAuth).mockReturnValue({} as never);
    const firestore = await import("firebase/firestore");
    vi.mocked(firestore.getFirestore).mockReturnValue({} as never);
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_FIREBASE_CONFIG = originalEnv;
  });

  it("getAuthInstance returns null when window is undefined", async () => {
    vi.stubGlobal("window", undefined);
    const { getAuthInstance } =
      await import("@/application/config/firebase-config");
    expect(getAuthInstance()).toBeNull();
    vi.stubGlobal("window", originalWindow);
  });

  it("getAuthInstance returns auth instance when window is defined", async () => {
    vi.stubGlobal("window", originalWindow);
    const mockAuth = {};
    const auth = await import("firebase/auth");
    vi.mocked(auth.getAuth).mockReturnValue(mockAuth as never);
    const { getAuthInstance } =
      await import("@/application/config/firebase-config");
    expect(getAuthInstance()).toBe(mockAuth);
  });

  it("getAuthInstance returns same instance on subsequent calls", async () => {
    vi.stubGlobal("window", originalWindow);
    const mockAuth = {};
    const auth = await import("firebase/auth");
    vi.mocked(auth.getAuth).mockReturnValue(mockAuth as never);
    const { getAuthInstance } =
      await import("@/application/config/firebase-config");
    const first = getAuthInstance();
    const second = getAuthInstance();
    expect(first).toBe(second);
  });

  it("getAuthInstance returns null when NEXT_PUBLIC_FIREBASE_CONFIG is missing", async () => {
    vi.stubGlobal("window", originalWindow);
    delete process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
    vi.resetModules();
    const { getAuthInstance } =
      await import("@/application/config/firebase-config");
    expect(getAuthInstance()).toBeNull();
  });

  it("getAuthInstance returns null when NEXT_PUBLIC_FIREBASE_CONFIG is invalid JSON", async () => {
    vi.stubGlobal("window", originalWindow);
    process.env.NEXT_PUBLIC_FIREBASE_CONFIG = "invalid-json";
    vi.resetModules();
    const { getAuthInstance } =
      await import("@/application/config/firebase-config");
    expect(getAuthInstance()).toBeNull();
  });

  it("getFirestoreInstance returns null when window is undefined", async () => {
    vi.stubGlobal("window", undefined);
    const { getFirestoreInstance } =
      await import("@/application/config/firebase-config");
    expect(getFirestoreInstance()).toBeNull();
    vi.stubGlobal("window", originalWindow);
  });

  it("getFirestoreInstance returns firestore instance when window is defined", async () => {
    vi.stubGlobal("window", originalWindow);
    const mockFirestore = {};
    const firestore = await import("firebase/firestore");
    vi.mocked(firestore.getFirestore).mockReturnValue(mockFirestore as never);
    vi.resetModules();
    const { getFirestoreInstance } =
      await import("@/application/config/firebase-config");
    expect(getFirestoreInstance()).toBe(mockFirestore);
  });

  it("getFirestoreInstance returns same instance on subsequent calls", async () => {
    vi.stubGlobal("window", originalWindow);
    const mockFirestore = {};
    const firestore = await import("firebase/firestore");
    vi.mocked(firestore.getFirestore).mockClear();
    vi.mocked(firestore.getFirestore).mockReturnValue(mockFirestore as never);
    vi.resetModules();
    const { getFirestoreInstance } =
      await import("@/application/config/firebase-config");
    const first = getFirestoreInstance();
    const second = getFirestoreInstance();
    expect(first).toBe(second);
    expect(first).toBe(mockFirestore);
    expect(firestore.getFirestore).toHaveBeenCalledTimes(1);
  });

  it("getFirestoreInstance returns null when NEXT_PUBLIC_FIREBASE_CONFIG is missing", async () => {
    vi.stubGlobal("window", originalWindow);
    delete process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
    vi.resetModules();
    const { getFirestoreInstance } =
      await import("@/application/config/firebase-config");
    expect(getFirestoreInstance()).toBeNull();
  });

  it("getFirestoreInstance returns null when NEXT_PUBLIC_FIREBASE_CONFIG is invalid JSON", async () => {
    vi.stubGlobal("window", originalWindow);
    process.env.NEXT_PUBLIC_FIREBASE_CONFIG = "invalid-json";
    vi.resetModules();
    const { getFirestoreInstance } =
      await import("@/application/config/firebase-config");
    expect(getFirestoreInstance()).toBeNull();
  });

  it("getAnalyticsInstance returns null when window is undefined", async () => {
    vi.stubGlobal("window", undefined);
    const { getAnalyticsInstance } =
      await import("@/application/config/firebase-config");
    expect(getAnalyticsInstance()).toBeNull();
    vi.stubGlobal("window", originalWindow);
  });

  it("getAnalyticsInstance returns analytics instance when window is defined", async () => {
    vi.stubGlobal("window", originalWindow);
    const mockAnalytics = { app: {} };
    const analyticsModule = await import("firebase/analytics");
    vi.mocked(analyticsModule.getAnalytics).mockReturnValue(
      mockAnalytics as never,
    );
    vi.resetModules();
    const { getAnalyticsInstance } =
      await import("@/application/config/firebase-config");
    expect(getAnalyticsInstance()).toBe(mockAnalytics);
  });

  it("getAnalyticsInstance returns same instance on subsequent calls", async () => {
    vi.stubGlobal("window", originalWindow);
    const mockAnalytics = { app: {} };
    const analyticsModule = await import("firebase/analytics");
    vi.mocked(analyticsModule.getAnalytics).mockReturnValue(
      mockAnalytics as never,
    );
    vi.resetModules();
    const { getAnalyticsInstance } =
      await import("@/application/config/firebase-config");
    const first = getAnalyticsInstance();
    const second = getAnalyticsInstance();
    expect(first).toBe(second);
    expect(first).toBe(mockAnalytics);
  });

  it("getAnalyticsInstance returns null when NEXT_PUBLIC_FIREBASE_CONFIG is missing", async () => {
    vi.stubGlobal("window", originalWindow);
    delete process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
    vi.resetModules();
    const { getAnalyticsInstance } =
      await import("@/application/config/firebase-config");
    expect(getAnalyticsInstance()).toBeNull();
  });

  it("getAnalyticsInstance returns null when NEXT_PUBLIC_FIREBASE_CONFIG is invalid JSON", async () => {
    vi.stubGlobal("window", originalWindow);
    process.env.NEXT_PUBLIC_FIREBASE_CONFIG = "invalid-json";
    vi.resetModules();
    const { getAnalyticsInstance } =
      await import("@/application/config/firebase-config");
    expect(getAnalyticsInstance()).toBeNull();
  });
});
