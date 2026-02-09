"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

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
import {
  createContactFormSchema,
  type ContactFormData,
} from "@/modules/landing-page/domain/schemas";

const SUPPORT_EMAIL = "support@gemsignal.com";

export function ContactForm() {
  const t = useTranslations("modules.contact.pages.contact");
  const [submitted, setSubmitted] = useState(false);

  const contactFormSchema = useMemo(
    () => createContactFormSchema((key) => t(`form.validation.${key}`)),
    [t],
  );

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  function onSubmit(values: ContactFormData) {
    const mailtoBody = `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`;
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(mailtoBody)}`;
    window.open(mailtoUrl, "_self");
    setSubmitted(true);
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
          <Button type="submit" variant="primary" className="w-full sm:w-auto">
            {t("form.submitButton")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
