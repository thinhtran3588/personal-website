import { z } from "zod";

export type SignInInput = z.infer<ReturnType<typeof getSignInSchema>>;
export type SignUpInput = z.infer<ReturnType<typeof getSignUpSchema>>;
export type ForgotPasswordInput = z.infer<
  ReturnType<typeof getForgotPasswordSchema>
>;
export type ProfileInput = z.infer<typeof profileSchema>;

export function getSignInSchema(t: (key: string) => string) {
  return z.object({
    email: z.email(t("invalidEmail")),
    password: z
      .string()
      .min(1, t("passwordRequired"))
      .max(20, t("passwordMaxLength")),
  });
}

function strongPassword(t: (key: string) => string) {
  return z
    .string()
    .min(8, t("minLength"))
    .max(20, t("passwordMaxLength"))
    .refine((val) => /[A-Z]/.test(val), t("uppercase"))
    .refine((val) => /[a-z]/.test(val), t("lowercase"))
    .refine((val) => /\d/.test(val), t("number"))
    .refine((val) => /[^A-Za-z0-9]/.test(val), t("specialChar"));
}

export function getSignUpSchema(t: (key: string) => string) {
  return z
    .object({
      email: z.email(t("invalidEmail")),
      password: strongPassword(t),
      confirmPassword: z.string(),
      fullName: z.string().max(200, t("fullNameMaxLength")).optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });
}

export function getForgotPasswordSchema(t: (key: string) => string) {
  return z.object({
    email: z.email(t("invalidEmail")),
  });
}

export const profileSchema = z.object({
  displayName: z.string().max(200).optional(),
});

export function getProfileSchema(t: (key: string) => string) {
  return z.object({
    displayName: z.string().max(200, t("fullNameMaxLength")).optional(),
  });
}

export type UpdatePasswordInput = z.infer<
  ReturnType<typeof getUpdatePasswordSchema>
>;

export function getUpdatePasswordSchema(t: (key: string) => string) {
  return z
    .object({
      oldPassword: z.string().min(1, t("oldPasswordRequired")),
      newPassword: strongPassword(t),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });
}
