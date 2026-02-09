import { BaseUseCase } from "@/common/utils/base-use-case";
import type { AnalyticsService } from "@/modules/analytics/domain/interfaces";

interface LogEventInput {
  eventName: string;
  params?: Record<string, unknown>;
}

export class LogEventUseCase extends BaseUseCase {
  constructor(private readonly analyticsService: AnalyticsService) {
    super();
  }

  async execute(input: LogEventInput): Promise<void> {
    this.analyticsService.logEvent(input.eventName, input.params);
  }
}
