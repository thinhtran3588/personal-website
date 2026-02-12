import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";

import messages from "@/application/localization/en.json";
import { SUPPORT_API_URL } from "@/common/constants";
import { ContactForm } from "@/modules/landing-page/presentation/pages/contact/components/contact-form";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const formMessages = messages.modules.contact.pages.contact.form;
const contactMessages = messages.modules.contact.pages.contact;

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

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

  it("sends contact request on valid submission", async () => {
    let resolveFetch: (value: Partial<Response>) => void;
    const fetchPromise = new Promise<Partial<Response>>((resolve) => {
      resolveFetch = resolve;
    });
    global.fetch = vi.fn().mockReturnValue(fetchPromise);

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

    // Check loading state
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: formMessages.submittingButton }),
      ).toBeInTheDocument();
    });

    // Resolve the fetch
    resolveFetch!({ ok: true });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        SUPPORT_API_URL,
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"name":"Alice"'),
        }),
      );
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        contactMessages.successMessage,
      );
      expect(
        screen.getByText(contactMessages.successMessage),
      ).toBeInTheDocument();
    });
  });

  it("includes source in the request payload", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;

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
      expect(mockFetch).toHaveBeenCalled();
    });

    const callArguments = mockFetch.mock.calls[0];
    const payload = JSON.parse(callArguments[1]?.body as string);
    expect(payload.source).toBeDefined();
    expect(payload.name).toBe("Bob");
  });

  it("shows success message only after successful submission", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;

    render(<ContactForm />);

    fireEvent.change(
      screen.getByPlaceholderText(formMessages.namePlaceholder),
      { target: { value: "Charlie" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.emailPlaceholder),
      { target: { value: "charlie@example.com" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.subjectPlaceholder),
      { target: { value: "Feedback" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.messagePlaceholder),
      { target: { value: "Great site!" } },
    );

    fireEvent.click(
      screen.getByRole("button", { name: formMessages.submitButton }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(contactMessages.successMessage),
      ).toBeInTheDocument();
    });
  });

  it("handles API error response", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: false });
    global.fetch = mockFetch;

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<ContactForm />);

    fireEvent.change(
      screen.getByPlaceholderText(formMessages.namePlaceholder),
      { target: { value: "Dave" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.emailPlaceholder),
      { target: { value: "dave@example.com" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.subjectPlaceholder),
      { target: { value: "Error" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.messagePlaceholder),
      { target: { value: "Testing error" } },
    );

    fireEvent.click(
      screen.getByRole("button", { name: formMessages.submitButton }),
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error submitting form:",
        expect.any(Error),
      );
      expect(toast.error).toHaveBeenCalledWith("Failed to send message");
    });

    consoleSpy.mockRestore();
  });

  it("handles network error", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Network Error"));
    global.fetch = mockFetch;

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<ContactForm />);

    fireEvent.change(
      screen.getByPlaceholderText(formMessages.namePlaceholder),
      { target: { value: "Eve" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.emailPlaceholder),
      { target: { value: "eve@example.com" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.subjectPlaceholder),
      { target: { value: "Network" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.messagePlaceholder),
      { target: { value: "Testing network error" } },
    );

    fireEvent.click(
      screen.getByRole("button", { name: formMessages.submitButton }),
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error submitting form:",
        expect.any(Error),
      );
      expect(toast.error).toHaveBeenCalledWith("Network Error");
    });

    consoleSpy.mockRestore();
  });

  it("handles non-Error object rejection", async () => {
    const mockFetch = vi.fn().mockRejectedValue("String Error");
    global.fetch = mockFetch;

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<ContactForm />);

    fireEvent.change(
      screen.getByPlaceholderText(formMessages.namePlaceholder),
      { target: { value: "Frank" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.emailPlaceholder),
      { target: { value: "frank@example.com" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.subjectPlaceholder),
      { target: { value: "Fallback" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.messagePlaceholder),
      { target: { value: "Testing fallback error" } },
    );

    fireEvent.click(
      screen.getByRole("button", { name: formMessages.submitButton }),
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error submitting form:",
        "String Error",
      );
      expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });

    consoleSpy.mockRestore();
  });
});
