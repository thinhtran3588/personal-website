export interface AnalyticsService {
  logEvent(eventName: string, params?: Record<string, unknown>): void;
  setUserId(userId: string | null): void;
}
