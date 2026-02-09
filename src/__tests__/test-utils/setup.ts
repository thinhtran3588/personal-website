import "@testing-library/jest-dom/vitest";

import { vi } from "vitest";

import messages from "@/application/localization/en.json";
import { initializeContainer } from "@/application/register-container";
import { getContainerOrNull } from "@/common/utils/container";

vi.mock("@/application/config/firebase-config", () => ({
  getAnalyticsInstance: vi.fn(() => null),
  getAuthInstance: vi.fn(() => null),
  getFirestoreInstance: vi.fn(() => null),
}));

vi.mock("firebase/analytics", () => ({
  getAnalytics: vi.fn(),
  logEvent: vi.fn(),
  setUserId: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  EmailAuthProvider: { credential: vi.fn() },
  createUserWithEmailAndPassword: vi.fn(),
  deleteUser: vi.fn(),
  onAuthStateChanged: vi.fn(() => () => {}),
  reauthenticateWithCredential: vi.fn(),
  reauthenticateWithPopup: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  updatePassword: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  documentId: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
  startAfter: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  writeBatch: vi.fn(),
}));

if (getContainerOrNull() === null) {
  initializeContainer();
}

const lookupMessage = (fullKey: string) => {
  const value = fullKey.split(".").reduce<unknown>((result, key) => {
    if (result && typeof result === "object" && key in result) {
      return (result as Record<string, unknown>)[key];
    }
    return undefined;
  }, messages);

  return typeof value === "string" ? value : String(value ?? fullKey);
};

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: async (namespace?: string) => (key: string) =>
    lookupMessage(namespace ? `${namespace}.${key}` : key),
  getMessages: async () => messages,
  getLocale: async () => "en",
  getRequestConfig: (
    handler: (params: {
      requestLocale: Promise<string | undefined>;
    }) => unknown,
  ) => handler,
}));

vi.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    const t = (key: string) =>
      lookupMessage(namespace ? `${namespace}.${key}` : key);
    t.rich = (key: string) =>
      lookupMessage(namespace ? `${namespace}.${key}` : key);
    return t;
  },
  useLocale: vi.fn(() => "en"),
}));

class IntersectionObserverMock implements IntersectionObserver {
  private callback: IntersectionObserverCallback;
  readonly root: Element | Document | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
    this.root = options?.root ?? null;
    this.rootMargin = options?.rootMargin ?? "0px";
    const threshold = options?.threshold ?? 0;
    this.thresholds = Array.isArray(threshold) ? threshold : [threshold];
  }

  observe(target: Element) {
    const boundingClientRect =
      "getBoundingClientRect" in target
        ? target.getBoundingClientRect()
        : new DOMRect();
    this.callback(
      [
        {
          isIntersecting: true,
          target,
          boundingClientRect,
          intersectionRatio: 1,
          intersectionRect: boundingClientRect,
          rootBounds: null,
          time: 0,
        } as IntersectionObserverEntry,
      ],
      this,
    );
  }

  unobserve() {}

  disconnect() {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
});

const storage = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  writable: true,
  value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
    clear: () => storage.clear(),
    get length() {
      return storage.size;
    },
    key: (index: number) => Array.from(storage.keys())[index] ?? null,
  },
});

Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: query === "(prefers-color-scheme: light)",
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  })),
});
