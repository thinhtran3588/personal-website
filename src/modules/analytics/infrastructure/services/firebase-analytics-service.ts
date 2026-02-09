import {
  logEvent as firebaseLogEvent,
  setUserId as firebaseSetUserId,
  type Analytics,
} from "firebase/analytics";

import type { AnalyticsService } from "@/modules/analytics/domain/interfaces";

export type GetAnalyticsInstance = () => Analytics | null;

export class FirebaseAnalyticsService implements AnalyticsService {
  constructor(private readonly getAnalyticsInstance: GetAnalyticsInstance) {}

  logEvent(eventName: string, params?: Record<string, unknown>): void {
    const analytics = this.getAnalyticsInstance();
    if (!analytics) return;
    firebaseLogEvent(analytics, eventName, params);
  }

  setUserId(userId: string | null): void {
    const analytics = this.getAnalyticsInstance();
    if (!analytics) return;
    firebaseSetUserId(analytics, userId);
  }
}
