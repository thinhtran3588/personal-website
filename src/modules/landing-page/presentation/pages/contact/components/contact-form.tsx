"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/common/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/form";
import { Input } from "@/common/components/input";
import { Textarea } from "@/common/components/textarea";
import { SUPPORT_API_URL } from "@/common/constants";
import { getWindowHost } from "@/common/utils/browser";
import {
  createContactFormSchema,
  type ContactFormData,
} from "@/modules/landing-page/domain/schemas";

export function ContactForm() {
  const t = useTranslations("modules.contact.pages.contact");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactFormSchema = useMemo(
    () => createContactFormSchema((key) => t(`form.validation.${key}`)),
    [t],
  );

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      source: getWindowHost(),
    },
  });

  async function onSubmit(values: ContactFormData) {
    setIsSubmitting(true);
    try {
      const response = await fetch(SUPPORT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitted(true);
      form.reset();
      toast.success(t("successMessage"));
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {submitted ? (
        <p className="text-sm text-[var(--text-primary)]" role="status">
          {t("successMessage")}
        </p>
      ) : null}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.nameLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.namePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.emailLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("form.emailPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.subjectLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form.subjectPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.messageLabel")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("form.messagePlaceholder")}
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("form.submittingButton") : t("form.submitButton")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
