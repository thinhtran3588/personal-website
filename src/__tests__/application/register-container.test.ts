import { beforeEach, describe, expect, it } from "vitest";

import { initializeContainer } from "@/application/register-container";
import { getContainer, getContainerOrNull } from "@/common/utils/container";

describe("register-container", () => {
  beforeEach(() => {
    initializeContainer();
  });

  it("getContainerOrNull returns container after initializeContainer", () => {
    expect(getContainerOrNull()).not.toBeNull();
  });

  it("returns a container that resolves authService", () => {
    const container = getContainer();
    const authService = container.resolve("authService") as {
      signInWithGoogle: () => unknown;
      signOut: () => unknown;
      subscribeToAuthState: (cb: (u: unknown) => void) => () => void;
    };
    expect(authService).toBeDefined();
    expect(typeof authService.signInWithGoogle).toBe("function");
    expect(typeof authService.signOut).toBe("function");
    expect(typeof authService.subscribeToAuthState).toBe("function");
  });

  it("returns a container that resolves use case instances with execute", () => {
    const container = getContainer();
    const signInWithGoogleUseCase = container.resolve(
      "signInWithGoogleUseCase",
    ) as { execute: () => unknown };
    const signOutUseCase = container.resolve("signOutUseCase") as {
      execute: () => unknown;
    };
    const getAuthStateSubscriptionUseCase = container.resolve(
      "getAuthStateSubscriptionUseCase",
    ) as { execute: () => unknown };
    const deleteAccountUseCase = container.resolve("deleteAccountUseCase") as {
      execute: () => unknown;
    };
    expect(typeof signInWithGoogleUseCase.execute).toBe("function");
    expect(typeof signOutUseCase.execute).toBe("function");
    expect(typeof getAuthStateSubscriptionUseCase.execute).toBe("function");
    expect(typeof deleteAccountUseCase.execute).toBe("function");
  });

  it("returns the same container instance on subsequent calls", () => {
    const a = getContainer();
    const b = getContainer();
    expect(a).toBe(b);
  });

  it("resolved authService is a singleton", () => {
    const container = getContainer();
    const a = container.resolve("authService");
    const b = container.resolve("authService");
    expect(a).toBe(b);
  });

  it("resolved use case instances are singletons", () => {
    const container = getContainer();
    const a = container.resolve("signInWithGoogleUseCase");
    const b = container.resolve("signInWithGoogleUseCase");
    expect(a).toBe(b);
  });

  it("returns a container that resolves settings repository and use cases", () => {
    const container = getContainer();
    const repo = container.resolve("userSettingsRepository") as {
      get: (userId: string) => Promise<unknown>;
      set: (userId: string, settings: unknown) => Promise<void>;
    };
    const loadUseCase = container.resolve("loadUserSettingsUseCase") as {
      execute: (input: { userId: string | null }) => Promise<unknown>;
    };
    const saveUseCase = container.resolve("saveUserSettingsUseCase") as {
      execute: (input: {
        userId: string | null;
        settings: unknown;
      }) => Promise<void>;
    };
    expect(repo).toBeDefined();
    expect(typeof repo.get).toBe("function");
    expect(typeof repo.set).toBe("function");
    expect(typeof loadUseCase.execute).toBe("function");
    expect(typeof saveUseCase.execute).toBe("function");
  });

  it("returns a container that resolves books repository and use cases", () => {
    const container = getContainer();
    const repo = container.resolve("bookRepository") as {
      find: (userId: string, query: unknown) => Promise<unknown>;
      get: (userId: string, bookId: string) => Promise<unknown>;
    };
    const findUseCase = container.resolve("findBooksUseCase") as {
      execute: (input: unknown) => Promise<unknown>;
    };
    expect(repo).toBeDefined();
    expect(typeof repo.find).toBe("function");
    expect(typeof repo.get).toBe("function");
    expect(typeof findUseCase.execute).toBe("function");
  });

  it("returns a container that resolves analytics service and use cases", () => {
    const container = getContainer();
    const service = container.resolve("analyticsService") as {
      logEvent: (eventName: string, params?: Record<string, unknown>) => void;
      setUserId: (userId: string | null) => void;
    };
    const logEventUseCase = container.resolve("logEventUseCase") as {
      execute: (input: unknown) => Promise<unknown>;
    };
    const setAnalyticsUserUseCase = container.resolve(
      "setAnalyticsUserUseCase",
    ) as {
      execute: (input: unknown) => Promise<unknown>;
    };
    expect(service).toBeDefined();
    expect(typeof service.logEvent).toBe("function");
    expect(typeof service.setUserId).toBe("function");
    expect(typeof logEventUseCase.execute).toBe("function");
    expect(typeof setAnalyticsUserUseCase.execute).toBe("function");
  });
});
