import { z } from "zod";

export function createContactFormSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(1, t("nameRequired")).max(200, t("nameMaxLength")),
    email: z.string().email(t("invalidEmail")),
    subject: z
      .string()
      .min(1, t("subjectRequired"))
      .max(200, t("subjectMaxLength")),
    message: z
      .string()
      .min(1, t("messageRequired"))
      .max(2000, t("messageMaxLength")),
  });
}

export type ContactFormData = z.infer<
  ReturnType<typeof createContactFormSchema>
>;
