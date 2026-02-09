import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import messages from "@/application/localization/en.json";
import { bookFormSchema } from "@/modules/books/domain/schemas";
import { BookForm } from "@/modules/books/presentation/components/book-form";

const formLabels = messages.modules.books.form;

describe("BookForm", () => {
  it("renders form fields and submit button", () => {
    const onSubmit = vi.fn();
    render(<BookForm submitLabel="Create" onSubmit={onSubmit} />);

    expect(screen.getByLabelText(formLabels.title)).toBeInTheDocument();
    expect(screen.getByLabelText(formLabels.description)).toBeInTheDocument();
    expect(screen.getByLabelText(formLabels.authors)).toBeInTheDocument();
    expect(screen.getByLabelText(formLabels.genres)).toBeInTheDocument();
    expect(screen.getByLabelText(formLabels.links)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("renders cancel button when onCancel is provided", () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    render(
      <BookForm submitLabel="Save" onSubmit={onSubmit} onCancel={onCancel} />,
    );
    const cancel = screen.getByRole("button", {
      name: formLabels.cancel,
    });
    expect(cancel).toBeInTheDocument();
  });

  it("renders only cancel button when onCancel is provided without submitLabel", () => {
    const { container } = render(<BookForm onCancel={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: formLabels.cancel }),
    ).toBeInTheDocument();
    expect(container.querySelector('button[type="submit"]')).toBeNull();
  });

  it("does not render cancel button when onCancel is not provided", () => {
    render(<BookForm submitLabel="Create" onSubmit={vi.fn()} />);
    expect(
      screen.queryByRole("button", { name: formLabels.cancel }),
    ).toBeNull();
  });

  it("prefills form when defaultValues are provided", () => {
    render(
      <BookForm
        submitLabel="Save"
        onSubmit={vi.fn()}
        defaultValues={{
          title: "Existing Title",
          description: "Existing description",
          authors: ["Author Name"],
          genres: ["Fiction", "Sci-Fi"],
          links: ["https://example.com"],
        }}
      />,
    );
    expect(screen.getByLabelText(formLabels.title)).toHaveValue(
      "Existing Title",
    );
    expect(screen.getByLabelText(formLabels.description)).toHaveValue(
      "Existing description",
    );
    expect(screen.getByText("Author Name")).toBeInTheDocument();
    expect(screen.getByText("Fiction")).toBeInTheDocument();
    expect(screen.getByText("Sci-Fi")).toBeInTheDocument();
    expect(screen.getByText("https://example.com")).toBeInTheDocument();
  });

  it("calls onSubmit with parsed form data on valid submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<BookForm submitLabel="Create" onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(formLabels.title), "My Book");
    await user.type(
      screen.getByLabelText(formLabels.description),
      "A great read",
    );
    await user.type(screen.getByLabelText(formLabels.authors), "Jane Doe");
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: "My Book",
        description: "A great read",
        authors: ["Jane Doe"],
        genres: [],
        links: [],
      });
    });
  });

  it("parses genres from tags added via Enter", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<BookForm submitLabel="Create" onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(formLabels.title), "Book");
    await user.type(screen.getByLabelText(formLabels.description), "Desc");
    const authorsInput = screen.getByLabelText(formLabels.authors);
    await user.type(authorsInput, "Author");
    await user.keyboard("{Enter}");
    const genresInput = screen.getByLabelText(formLabels.genres);
    await user.type(genresInput, "Fiction");
    await user.keyboard("{Enter}");
    await user.type(genresInput, "Sci-Fi");
    await user.keyboard("{Enter}");
    await user.type(genresInput, "Thriller");
    await user.keyboard("{Enter}");
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          genres: ["Fiction", "Sci-Fi", "Thriller"],
        }),
      );
    });
  });

  it("parses links from tags added via Enter", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<BookForm submitLabel="Create" onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(formLabels.title), "Book");
    await user.type(screen.getByLabelText(formLabels.description), "Desc");
    await user.type(screen.getByLabelText(formLabels.authors), "Author");
    const linksInput = screen.getByLabelText(formLabels.links);
    await user.type(linksInput, "https://example.com");
    await user.keyboard("{Enter}");
    await user.type(linksInput, "https://other.org");
    await user.keyboard("{Enter}");
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          links: ["https://example.com", "https://other.org"],
        }),
      );
    });
  });

  it("shows translated validation message when title is empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BookForm submitLabel="Create" onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(formLabels.authors), "Author");
    await user.click(screen.getByRole("button", { name: "Create" }));
    await waitFor(() => {
      expect(
        screen.getByText(formLabels.validation.titleRequired),
      ).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not call onSubmit when onSubmit is not provided", async () => {
    const user = userEvent.setup();
    render(<BookForm submitLabel="Save" />);
    await user.type(screen.getByLabelText(formLabels.title), "Book");
    await user.type(screen.getByLabelText(formLabels.description), "Desc");
    await user.type(screen.getByLabelText(formLabels.authors), "Author");
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => {
      expect(
        screen.queryByText(formLabels.validation.titleRequired),
      ).toBeNull();
    });
  });

  it("does not call onSubmit when bookFormSchema validation fails", async () => {
    const parseSpy = vi.spyOn(bookFormSchema, "safeParse").mockReturnValue({
      success: false,
      error: new Error("validation error"),
    } as never);
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<BookForm submitLabel="Create" onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(formLabels.title), "Book");
    await user.type(screen.getByLabelText(formLabels.description), "Desc");
    await user.type(screen.getByLabelText(formLabels.authors), "Author");
    await user.click(screen.getByRole("button", { name: "Create" }));
    await waitFor(() => {
      expect(parseSpy).toHaveBeenCalled();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    parseSpy.mockRestore();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <BookForm submitLabel="Create" onSubmit={vi.fn()} onCancel={onCancel} />,
    );
    await user.click(screen.getByRole("button", { name: formLabels.cancel }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("renders all fields as readonly and hides submit/cancel when readonly is true", () => {
    const { container } = render(
      <BookForm
        defaultValues={{
          title: "A Title",
          description: "A description",
          authors: ["Author"],
          genres: ["Fiction"],
          links: ["https://example.com"],
        }}
        readonly
      />,
    );
    expect(screen.getByLabelText(formLabels.title)).toHaveAttribute("readonly");
    expect(screen.getByLabelText(formLabels.description)).toHaveAttribute(
      "readonly",
    );
    expect(screen.getByText("Author")).toBeInTheDocument();
    expect(screen.getByText("Fiction")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "https://example.com" }),
    ).toHaveAttribute("href", "https://example.com");
    expect(
      screen.queryByRole("button", { name: formLabels.cancel }),
    ).toBeNull();
    expect(container.querySelector('button[type="submit"]')).toBeNull();
  });

  it("renders readonly with empty genres and empty links as dash", () => {
    render(
      <BookForm
        defaultValues={{
          title: "T",
          description: "D",
          authors: ["A"],
          genres: [],
          links: [],
        }}
        readonly
      />,
    );
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });

  it("prefills with empty genres, authors, and links as empty string", () => {
    render(
      <BookForm
        submitLabel="Save"
        onSubmit={vi.fn()}
        defaultValues={{
          title: "Title",
          description: "Desc",
          authors: [],
          genres: [],
          links: [],
        }}
      />,
    );
    expect(screen.getByLabelText(formLabels.title)).toHaveValue("Title");
    expect(screen.getByLabelText(formLabels.description)).toHaveValue("Desc");
    expect(screen.getByLabelText(formLabels.authors)).toHaveValue("");
    expect(screen.getByLabelText(formLabels.genres)).toHaveValue("");
    expect(screen.getByLabelText(formLabels.links)).toHaveValue("");
  });

  it("does not call onSubmit when form is submitted in readonly mode", () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <BookForm
        defaultValues={{
          title: "T",
          description: "D",
          authors: ["A"],
          genres: [],
          links: [],
        }}
        readonly
        onSubmit={onSubmit}
      />,
    );
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
    act(() => {
      form?.requestSubmit();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disables submit button while submitting", async () => {
    let resolveSubmit: () => void;
    const submitPromise = new Promise<void>((r) => {
      resolveSubmit = r;
    });
    const onSubmit = vi.fn().mockReturnValue(submitPromise);
    const user = userEvent.setup();
    render(<BookForm submitLabel="Save" onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(formLabels.title), "Book");
    await user.type(screen.getByLabelText(formLabels.description), "Desc");
    await user.type(screen.getByLabelText(formLabels.authors), "Author");
    const submitButton = screen.getByRole("button", { name: "Save" });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    resolveSubmit!();
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
