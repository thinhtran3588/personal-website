import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import messages from "@/application/localization/en.json";
import { ContactForm } from "@/modules/landing-page/presentation/pages/contact/components/contact-form";

const formMessages = messages.modules.contact.pages.contact.form;
const contactMessages = messages.modules.contact.pages.contact;

describe("ContactForm", () => {
  it("renders all form fields and submit button", () => {
    render(<ContactForm />);

    expect(
      screen.getByPlaceholderText(formMessages.namePlaceholder),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(formMessages.emailPlaceholder),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(formMessages.subjectPlaceholder),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(formMessages.messagePlaceholder),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: formMessages.submitButton }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(<ContactForm />);

    fireEvent.click(
      screen.getByRole("button", { name: formMessages.submitButton }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(formMessages.validation.nameRequired),
      ).toBeInTheDocument();
    });
  });

  it("opens mailto link on valid submission", async () => {
    const mockOpen = vi.fn();
    vi.spyOn(window, "open").mockImplementation(mockOpen);

    render(<ContactForm />);

    fireEvent.change(
      screen.getByPlaceholderText(formMessages.namePlaceholder),
      { target: { value: "Alice" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.emailPlaceholder),
      { target: { value: "alice@example.com" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.subjectPlaceholder),
      { target: { value: "Test Subject" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.messagePlaceholder),
      { target: { value: "Hello, this is a test message." } },
    );

    fireEvent.click(
      screen.getByRole("button", { name: formMessages.submitButton }),
    );

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining("mailto:quangthinhtran3588@gmail.com"),
        "_self",
      );
    });

    expect(
      screen.getByText(contactMessages.successMessage),
    ).toBeInTheDocument();

    mockOpen.mockRestore();
  });

  it("includes subject and body in mailto URL", async () => {
    const mockOpen = vi.fn();
    vi.spyOn(window, "open").mockImplementation(mockOpen);

    render(<ContactForm />);

    fireEvent.change(
      screen.getByPlaceholderText(formMessages.namePlaceholder),
      { target: { value: "Bob" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.emailPlaceholder),
      { target: { value: "bob@example.com" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.subjectPlaceholder),
      { target: { value: "Help needed" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.messagePlaceholder),
      { target: { value: "I need assistance." } },
    );

    fireEvent.click(
      screen.getByRole("button", { name: formMessages.submitButton }),
    );

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalled();
    });

    const mailtoUrl = mockOpen.mock.calls[0][0] as string;
    expect(mailtoUrl).toContain("subject=Help%20needed");
    expect(mailtoUrl).toContain("body=");
    expect(mailtoUrl).toContain(encodeURIComponent("Name: Bob"));

    mockOpen.mockRestore();
  });
});
