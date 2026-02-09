import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import messages from "@/application/localization/en.json";
import { AuthType } from "@/modules/auth/domain/types";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";
import { BookDetailPage } from "@/modules/books/presentation/pages/detail/page";

const detailMessages = messages.modules.books.pages.detail;
const formLabels = messages.modules.books.form;

const translationCache: Record<string, (key: string) => string> = {};
function getStableT(namespace?: string) {
  const cacheKey = namespace ?? "__default__";
  if (!translationCache[cacheKey]) {
    translationCache[cacheKey] = (key: string) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const value = fullKey
        .split(".")
        .reduce<unknown>(
          (acc, part) =>
            acc && typeof acc === "object" && part in acc
              ? (acc as Record<string, unknown>)[part]
              : key,
          messages as unknown,
        );
      return typeof value === "string" ? value : key;
    };
  }
  return translationCache[cacheKey];
}

vi.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => getStableT(namespace),
  useLocale: () => "en",
}));

const mockPush = vi.fn();
const mockGetExecute = vi.fn();
const mockUpdateExecute = vi.fn();
const mockDeleteExecute = vi.fn();
const mockToastError = vi.fn();
const mockToastSuccess = vi.fn();

const resolveMock = vi.fn();
const containerMock = { resolve: resolveMock };

vi.mock("@/common/routing/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => containerMock,
}));

vi.mock("sonner", () => ({
  toast: {
    error: (msg: string) => mockToastError(msg),
    success: (msg: string) => mockToastSuccess(msg),
  },
}));

describe("BookDetailPage", () => {
  const sampleBook = {
    id: "book-1",
    title: "Sample Book",
    description: "A description",
    genres: ["Fiction"],
    authors: ["Jane Author"],
    links: ["https://example.com"],
    createdBy: "user-1",
    createdAt: 1000,
    lastModifiedAt: 1000,
  };

  beforeEach(() => {
    mockPush.mockClear();
    mockGetExecute.mockClear();
    mockUpdateExecute.mockClear();
    mockDeleteExecute.mockClear();
    mockToastError.mockClear();
    mockToastSuccess.mockClear();
    resolveMock.mockImplementation((name: string) => {
      if (name === "getBookUseCase") return { execute: mockGetExecute };
      if (name === "updateBookUseCase") return { execute: mockUpdateExecute };
      if (name === "deleteBookUseCase") return { execute: mockDeleteExecute };
      return {};
    });
    useAuthUserStore.setState({
      user: {
        id: "user-1",
        email: "u@example.com",
        displayName: "User",
        photoURL: null,
        authType: AuthType.Email,
      },
    });
  });

  it("shows sign in message when user is null", () => {
    useAuthUserStore.setState({ user: null });
    render(<BookDetailPage bookId="book-1" />);
    expect(screen.getByText(detailMessages.signInRequired)).toBeInTheDocument();
    expect(mockGetExecute).not.toHaveBeenCalled();
  });

  it("shows loading then book not found when get returns failure", async () => {
    mockGetExecute.mockResolvedValue({ success: false, error: "not-found" });
    render(<BookDetailPage bookId="book-1" />);

    expect(
      screen.getByRole("status", { name: detailMessages.loading }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        detailMessages.errors.loadFailed,
      );
    });
    await waitFor(() => {
      expect(screen.getByText(detailMessages.notFound)).toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      "/app/books",
    );
  });

  it("shows book details with empty genres and links as dash", async () => {
    mockGetExecute.mockResolvedValue({
      success: true,
      data: {
        ...sampleBook,
        genres: [],
        links: [],
      },
    });
    render(<BookDetailPage bookId="book-1" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Sample Book")).toBeInTheDocument();
    });

    const genresSection = screen
      .getByText(detailMessages.genresLabel)
      .closest("div");
    expect(genresSection).toHaveTextContent(detailMessages.emptyValue);
    const linksSection = screen
      .getByText(detailMessages.linksLabel)
      .closest("div");
    expect(linksSection).toHaveTextContent(detailMessages.emptyValue);
  });

  it("shows book details and edit/delete when book loads", async () => {
    mockGetExecute.mockResolvedValue({
      success: true,
      data: sampleBook,
    });
    render(<BookDetailPage bookId="book-1" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Sample Book")).toBeInTheDocument();
    });

    expect(screen.getByText("Jane Author")).toBeInTheDocument();
    expect(screen.getByText("A description")).toBeInTheDocument();
    expect(screen.getByText("Fiction")).toBeInTheDocument();
    const bookLink = screen.getByRole("link", {
      name: "https://example.com",
    });
    expect(bookLink).toHaveAttribute("href", "https://example.com");
    expect(
      screen.getByRole("button", { name: detailMessages.edit }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: detailMessages.delete }),
    ).toBeInTheDocument();
    const backLink = screen.getByRole("link", { name: "Back" });
    expect(backLink).toHaveAttribute("href", "/app/books");
  });

  it("switches to edit mode with form when edit is clicked", async () => {
    mockGetExecute.mockResolvedValue({
      success: true,
      data: sampleBook,
    });
    const user = userEvent.setup();
    render(<BookDetailPage bookId="book-1" />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: detailMessages.edit }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: detailMessages.edit }));

    await waitFor(() => {
      expect(screen.getByLabelText(formLabels.title)).toHaveValue(
        "Sample Book",
      );
    });
    expect(
      screen.getByRole("heading", { name: detailMessages.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: detailMessages.save }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: formLabels.cancel }),
    ).toBeInTheDocument();
  });

  it("save in edit mode calls update and exits edit mode", async () => {
    mockGetExecute
      .mockResolvedValueOnce({
        success: true,
        data: sampleBook,
      })
      .mockResolvedValueOnce({
        success: true,
        data: { ...sampleBook, title: "Updated Title" },
      });
    mockUpdateExecute.mockResolvedValue({ success: true });

    const user = userEvent.setup();
    render(<BookDetailPage bookId="book-1" />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: detailMessages.edit }),
      ).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: detailMessages.edit }));

    await waitFor(() => {
      expect(screen.getByLabelText(formLabels.title)).toBeInTheDocument();
    });
    const titleInput = screen.getByLabelText(formLabels.title);
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Title");
    await user.click(screen.getByRole("button", { name: detailMessages.save }));

    await waitFor(() => {
      expect(mockUpdateExecute).toHaveBeenCalledWith({
        userId: "user-1",
        bookId: "book-1",
        input: expect.objectContaining({ title: "Updated Title" }),
      });
    });
    expect(mockToastSuccess).toHaveBeenCalledWith(detailMessages.updated);
    await waitFor(() => {
      expect(mockGetExecute).toHaveBeenCalledTimes(2);
    });
  });

  it("cancel in edit mode exits without saving", async () => {
    mockGetExecute.mockResolvedValue({
      success: true,
      data: sampleBook,
    });
    const user = userEvent.setup();
    render(<BookDetailPage bookId="book-1" />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: detailMessages.edit }),
      ).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: detailMessages.edit }));
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: formLabels.cancel }),
      ).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: formLabels.cancel }));

    expect(mockUpdateExecute).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByDisplayValue("Sample Book")).toBeInTheDocument();
    });
  });

  it("delete with confirm pushes to list and shows toast", async () => {
    mockGetExecute.mockResolvedValue({
      success: true,
      data: sampleBook,
    });
    mockDeleteExecute.mockResolvedValue({ success: true });

    const user = userEvent.setup();
    render(<BookDetailPage bookId="book-1" />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: detailMessages.delete }),
      ).toBeInTheDocument();
    });
    await user.click(
      screen.getByRole("button", { name: detailMessages.delete }),
    );

    const dialog = screen.getByRole("dialog", {
      name: detailMessages.delete,
    });
    await user.click(
      within(dialog).getByRole("button", { name: detailMessages.delete }),
    );

    await waitFor(() => {
      expect(mockDeleteExecute).toHaveBeenCalledWith({
        userId: "user-1",
        bookId: "book-1",
      });
    });
    expect(mockToastSuccess).toHaveBeenCalledWith(detailMessages.deleted);
    expect(mockPush).toHaveBeenCalledWith("/app/books");
  });

  it("shows error toast when update fails", async () => {
    mockGetExecute.mockResolvedValue({
      success: true,
      data: sampleBook,
    });
    mockUpdateExecute.mockResolvedValue({ success: false, error: "generic" });
    const user = userEvent.setup();
    render(<BookDetailPage bookId="book-1" />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: detailMessages.edit }),
      ).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: detailMessages.edit }));
    await waitFor(() => {
      expect(screen.getByLabelText(formLabels.title)).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: detailMessages.save }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        detailMessages.errors.updateFailed,
      );
    });
  });

  it("shows error toast when delete fails", async () => {
    mockGetExecute.mockResolvedValue({
      success: true,
      data: sampleBook,
    });
    mockDeleteExecute.mockResolvedValue({ success: false, error: "generic" });
    const user = userEvent.setup();
    render(<BookDetailPage bookId="book-1" />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: detailMessages.delete }),
      ).toBeInTheDocument();
    });
    await user.click(
      screen.getByRole("button", { name: detailMessages.delete }),
    );

    const dialog = screen.getByRole("dialog", {
      name: detailMessages.delete,
    });
    await user.click(
      within(dialog).getByRole("button", { name: detailMessages.delete }),
    );

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        detailMessages.errors.deleteFailed,
      );
    });
  });

  it("does not call update when user is null on save", async () => {
    mockGetExecute.mockResolvedValue({
      success: true,
      data: sampleBook,
    });
    const getState = useAuthUserStore.getState;
    vi.spyOn(useAuthUserStore, "getState").mockImplementation(() => ({
      ...getState(),
      user: null,
    }));
    const user = userEvent.setup();
    render(<BookDetailPage bookId="book-1" />);
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: detailMessages.edit }),
      ).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: detailMessages.edit }));
    await waitFor(() => {
      expect(screen.getByLabelText(formLabels.title)).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: detailMessages.save }));
    expect(mockUpdateExecute).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it("does not delete when user cancels confirm", async () => {
    mockGetExecute.mockResolvedValue({
      success: true,
      data: sampleBook,
    });

    const user = userEvent.setup();
    render(<BookDetailPage bookId="book-1" />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: detailMessages.delete }),
      ).toBeInTheDocument();
    });
    await user.click(
      screen.getByRole("button", { name: detailMessages.delete }),
    );

    const dialog = screen.getByRole("dialog", {
      name: detailMessages.delete,
    });
    await user.click(
      within(dialog).getByRole("button", { name: detailMessages.cancel }),
    );

    expect(mockDeleteExecute).not.toHaveBeenCalled();
  });

  it("does not call delete when user is null on confirm", async () => {
    mockGetExecute.mockResolvedValue({
      success: true,
      data: sampleBook,
    });
    const getState = useAuthUserStore.getState;
    vi.spyOn(useAuthUserStore, "getState").mockImplementation(() => ({
      ...getState(),
      user: null,
    }));
    const user = userEvent.setup();
    render(<BookDetailPage bookId="book-1" />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: detailMessages.delete }),
      ).toBeInTheDocument();
    });
    await user.click(
      screen.getByRole("button", { name: detailMessages.delete }),
    );

    const dialog = screen.getByRole("dialog", {
      name: detailMessages.delete,
    });
    await user.click(
      within(dialog).getByRole("button", { name: detailMessages.delete }),
    );

    expect(mockDeleteExecute).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});
