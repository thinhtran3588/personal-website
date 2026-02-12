import { z } from "zod";

export type ContactFormData = z.infer<
  ReturnType<typeof createContactFormSchema>
>;

export function createContactFormSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(1, t("nameRequired")).max(200, t("nameMaxLength")),
    email: z.string().min(1, t("emailRequired")).email(t("invalidEmail")),
    subject: z
      .string()
      .min(1, t("subjectRequired"))
      .max(200, t("subjectMaxLength")),
    message: z
      .string()
      .min(1, t("messageRequired"))
      .max(1000, t("messageMaxLength")),
    source: z
      .string()
      .min(1, t("sourceRequired"))
      .max(200, t("sourceMaxLength")),
  });
}
