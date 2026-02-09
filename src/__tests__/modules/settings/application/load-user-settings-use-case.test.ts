import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoadUserSettingsUseCase } from "@/modules/settings/application/load-user-settings-use-case";
import type { UserSettingsRepository } from "@/modules/settings/domain/interfaces";

describe("LoadUserSettingsUseCase", () => {
  let loadUseCase: LoadUserSettingsUseCase;
  let mockRepository: UserSettingsRepository;

  beforeEach(() => {
    mockRepository = {
      get: vi.fn().mockResolvedValue(null),
      set: vi.fn(),
    };
    loadUseCase = new LoadUserSettingsUseCase(mockRepository);
  });

  it("returns success with data null when userId is null", async () => {
    const result = await loadUseCase.execute({ userId: null });
    expect(result).toEqual({ success: true, data: null });
    expect(mockRepository.get).not.toHaveBeenCalled();
  });

  it("returns success with data null when userId is set but remote returns null", async () => {
    vi.mocked(mockRepository.get).mockResolvedValue(null);
    const result = await loadUseCase.execute({ userId: "user-1" });
    expect(result).toEqual({ success: true, data: null });
    expect(mockRepository.get).toHaveBeenCalledWith("user-1");
  });

  it("returns success with remote data when userId is set and remote exists", async () => {
    vi.mocked(mockRepository.get).mockResolvedValue({
      locale: "vi",
      theme: "dark",
    });
    const result = await loadUseCase.execute({ userId: "user-1" });
    expect(result).toEqual({
      success: true,
      data: { locale: "vi", theme: "dark" },
    });
    expect(mockRepository.get).toHaveBeenCalledWith("user-1");
  });

  it("returns failure with mapped error when repository throws", async () => {
    vi.mocked(mockRepository.get).mockRejectedValue(
      new Error("permission denied"),
    );
    const result = await loadUseCase.execute({ userId: "user-1" });
    expect(result).toEqual({ success: false, error: "unavailable" });
  });

  it("returns failure with generic error when repository throws unknown error", async () => {
    vi.mocked(mockRepository.get).mockRejectedValue(
      new Error("something went wrong"),
    );
    const result = await loadUseCase.execute({ userId: "user-1" });
    expect(result).toEqual({ success: false, error: "generic" });
  });
});
