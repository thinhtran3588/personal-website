import { z } from "zod";

export const userSettingsSchema = z.object({
  locale: z.string().optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
});

export type UserSettingsInput = z.infer<typeof userSettingsSchema>;
