"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/common/components/button";
import { ButtonGroup } from "@/common/components/button-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/form";
import { Input } from "@/common/components/input";
import { TagsInput } from "@/common/components/tags-input";
import { Textarea } from "@/common/components/textarea";
import {
  bookFormSchema,
  type BookFormInput,
} from "@/modules/books/domain/schemas";

type BookFormValuesInput = {
  title: string;
  description: string;
  authorsText: string;
  genresText: string;
  linksText: string;
};

function buildBookFormInputSchema(t: (key: string) => string) {
  return z.object({
    title: z
      .string()
      .min(1, t("validation.titleRequired"))
      .max(200, t("validation.titleMaxLength")),
    description: z
      .string()
      .min(1, t("validation.descriptionRequired"))
      .max(1000, t("validation.descriptionMaxLength")),
    authorsText: z
      .string()
      .refine(
        (val) => textToTags(val).length >= 1,
        t("validation.authorsRequired"),
      ),
    genresText: z.string(),
    linksText: z.string(),
  });
}

type BookFormProps = {
  defaultValues?: Partial<BookFormInput>;
  onSubmit?: (values: BookFormInput) => Promise<void>;
  submitLabel?: string;
  onCancel?: () => void;
  readonly?: boolean;
};

function textToTags(text: string): string[] {
  return text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toBookFormInput(values: BookFormValuesInput): BookFormInput {
  return {
    title: values.title,
    description: values.description,
    authors: textToTags(values.authorsText),
    genres: textToTags(values.genresText),
    links: textToTags(values.linksText),
  };
}

export function BookForm({
  defaultValues,
  onSubmit,
  submitLabel,
  onCancel,
  readonly = false,
}: BookFormProps) {
  const t = useTranslations("modules.books.form");
  const bookFormInputSchema = useMemo(() => buildBookFormInputSchema(t), [t]);

  const form = useForm<BookFormValuesInput>({
    resolver: zodResolver(bookFormInputSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      genresText:
        defaultValues?.genres && defaultValues.genres.length > 0
          ? defaultValues.genres.join("\n")
          : "",
      authorsText:
        defaultValues?.authors && defaultValues.authors.length > 0
          ? defaultValues.authors.join("\n")
          : "",
      linksText:
        defaultValues?.links && defaultValues.links.length > 0
          ? defaultValues.links.join("\n")
          : "",
    },
  });

  async function handleSubmit(values: BookFormValuesInput) {
    if (readonly || !onSubmit) return;
    const input = toBookFormInput(values);
    const parsed = bookFormSchema.safeParse(input);
    if (!parsed.success) return;
    await onSubmit(parsed.data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("title")}</FormLabel>
              <FormControl>
                <Input {...field} maxLength={200} readOnly={readonly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("description")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value}
                  onChange={field.onChange}
                  maxLength={1000}
                  rows={4}
                  readOnly={readonly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="authorsText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("authors")}</FormLabel>
              <FormControl>
                <TagsInput
                  value={textToTags(field.value)}
                  onChange={
                    readonly
                      ? undefined
                      : (arr) => field.onChange(arr.join("\n"))
                  }
                  placeholder={t("authorsPlaceholder")}
                  readOnly={readonly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="genresText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("genres")}</FormLabel>
              <FormControl>
                <TagsInput
                  value={textToTags(field.value)}
                  onChange={
                    readonly
                      ? undefined
                      : (arr) => field.onChange(arr.join("\n"))
                  }
                  placeholder={t("genresPlaceholder")}
                  readOnly={readonly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linksText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("links")}</FormLabel>
              <FormControl>
                {readonly ? (
                  <div className="flex flex-col gap-1">
                    {textToTags(field.value).length > 0 ? (
                      textToTags(field.value).map((url, i) => (
                        <a
                          key={`${url}-${i}`}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[var(--accent)] hover:underline"
                        >
                          {url}
                        </a>
                      ))
                    ) : (
                      <span className="text-sm text-[var(--text-muted)]">
                        —
                      </span>
                    )}
                  </div>
                ) : (
                  <TagsInput
                    value={textToTags(field.value)}
                    onChange={(arr) => field.onChange(arr.join("\n"))}
                    placeholder={t("linksPlaceholder")}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!readonly && (submitLabel ?? onCancel) && (
          <ButtonGroup>
            {submitLabel && (
              <Button
                type="submit"
                variant="primary"
                disabled={form.formState.isSubmitting}
              >
                {submitLabel}
              </Button>
            )}
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {t("cancel")}
              </Button>
            )}
          </ButtonGroup>
        )}
      </form>
    </Form>
  );
}
