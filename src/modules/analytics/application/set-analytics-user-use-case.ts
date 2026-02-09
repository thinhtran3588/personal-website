import { BaseUseCase } from "@/common/utils/base-use-case";
import type { AnalyticsService } from "@/modules/analytics/domain/interfaces";

interface SetAnalyticsUserInput {
  userId: string | null;
}

export class SetAnalyticsUserUseCase extends BaseUseCase {
  constructor(private readonly analyticsService: AnalyticsService) {
    super();
  }

  async execute(input: SetAnalyticsUserInput): Promise<void> {
    this.analyticsService.setUserId(input.userId);
  }
}
