import type { AwilixContainer } from "awilix";

export function registerModule(_container: AwilixContainer<object>): void {
  // Settings are persisted locally via Zustand — no DI registrations needed.
}
