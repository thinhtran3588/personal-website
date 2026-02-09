import { describe, expect, it } from "vitest";

import { BaseUseCase } from "@/common/utils/base-use-case";

class ConcreteUseCase extends BaseUseCase {
  async execute(_input: unknown): Promise<unknown> {
    return this.handle(async () => "ok");
  }
}

class ConcreteUseCaseWithMapError extends BaseUseCase {
  async execute(_input: unknown): Promise<unknown> {
    return this.handle(
      async () => {
        throw new Error("fail");
      },
      (err) => (err as Error).message,
    );
  }
}

class ConcreteUseCaseWithoutMapError extends BaseUseCase {
  async execute(_input: unknown): Promise<unknown> {
    return this.handle(async () => {
      throw new Error("raw");
    });
  }
}

describe("BaseUseCase", () => {
  it("handle returns success with data when action resolves", async () => {
    const useCase = new ConcreteUseCase();
    const result = await useCase.execute({});
    expect(result).toEqual({ success: true, data: "ok" });
  });

  it("handle returns failure with mapped error when action rejects and mapError provided", async () => {
    const useCase = new ConcreteUseCaseWithMapError();
    const result = await useCase.execute({});
    expect(result).toEqual({ success: false, error: "fail" });
  });

  it("handle returns failure with error as-is when action rejects and mapError not provided", async () => {
    const useCase = new ConcreteUseCaseWithoutMapError();
    const result = await useCase.execute({});
    expect(result).toEqual({
      success: false,
      error: new Error("raw"),
    });
  });
});
