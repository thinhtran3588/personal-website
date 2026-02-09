import { z } from "zod";

export const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Max 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Max 1000 characters"),
  genres: z.array(z.string()),
  authors: z.array(z.string()).min(1, "At least one author is required"),
  links: z.array(z.string()),
});

export type BookFormInput = z.infer<typeof bookFormSchema>;

export const bookUpdateSchema = bookFormSchema.partial();

export type BookUpdateInput = z.infer<typeof bookUpdateSchema>;
