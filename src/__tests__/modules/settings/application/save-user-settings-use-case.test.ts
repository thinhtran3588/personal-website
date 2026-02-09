import { beforeEach, describe, expect, it, vi } from "vitest";

import { SaveUserSettingsUseCase } from "@/modules/settings/application/save-user-settings-use-case";
import type { UserSettingsRepository } from "@/modules/settings/domain/interfaces";

describe("SaveUserSettingsUseCase", () => {
  let saveUseCase: SaveUserSettingsUseCase;
  let mockRepository: UserSettingsRepository;

  beforeEach(() => {
    mockRepository = {
      get: vi.fn(),
      set: vi.fn().mockResolvedValue(undefined),
    };
    saveUseCase = new SaveUserSettingsUseCase(mockRepository);
  });

  it("returns success without calling repository when userId is null", async () => {
    const result = await saveUseCase.execute({
      userId: null,
      settings: { locale: "en", theme: "dark" },
    });
    expect(result).toEqual({ success: true });
    expect(mockRepository.set).not.toHaveBeenCalled();
  });

  it("returns success and writes to repository when userId is set", async () => {
    const result = await saveUseCase.execute({
      userId: "user-1",
      settings: { locale: "vi", theme: "light" },
    });
    expect(result).toEqual({ success: true });
    expect(mockRepository.set).toHaveBeenCalledWith("user-1", {
      locale: "vi",
      theme: "light",
    });
  });

  it("returns failure with mapped error when repository throws", async () => {
    vi.mocked(mockRepository.set).mockRejectedValue(
      new Error("network unavailable"),
    );
    const result = await saveUseCase.execute({
      userId: "user-1",
      settings: { locale: "en" },
    });
    expect(result).toEqual({ success: false, error: "unavailable" });
  });

  it("returns failure with generic error when repository throws unknown error", async () => {
    vi.mocked(mockRepository.set).mockRejectedValue(
      new Error("something went wrong"),
    );
    const result = await saveUseCase.execute({
      userId: "user-1",
      settings: { locale: "en" },
    });
    expect(result).toEqual({ success: false, error: "generic" });
  });
});
