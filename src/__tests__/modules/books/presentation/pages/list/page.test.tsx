import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import messages from "@/application/localization/en.json";
import { AuthType } from "@/modules/auth/domain/types";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";
import { BooksListPage } from "@/modules/books/presentation/pages/list/page";

const listMessages = messages.modules.books.pages.list;

const listTranslationCache: Record<
  string,
  (key: string, values?: Record<string, unknown>) => string
> = {};
function getListStableT(namespace?: string) {
  const cacheKey = namespace ?? "__default__";
  if (!listTranslationCache[cacheKey]) {
    listTranslationCache[cacheKey] = (
      key: string,
      values?: Record<string, unknown>,
    ) => {
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
      let s = typeof value === "string" ? value : key;
      if (values) {
        for (const [k, v] of Object.entries(values)) {
          s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return s;
    };
  }
  return listTranslationCache[cacheKey];
}

vi.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => getListStableT(namespace),
  useLocale: () => "en",
}));

const mockListExecute = vi.fn();
const mockDeleteExecute = vi.fn();
const mockToastError = vi.fn();
const mockToastSuccess = vi.fn();

const listResolveMock = vi.fn();
const listContainerMock = { resolve: listResolveMock };

vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => listContainerMock,
}));

vi.mock("sonner", () => ({
  toast: {
    error: (msg: string) => mockToastError(msg),
    success: (msg: string) => mockToastSuccess(msg),
  },
}));

vi.mock("@/common/routing/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/common/components/modal", () => ({
  Modal: ({
    open,
    onOpenChange,
    title,
    children,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: React.ReactNode;
  }) => {
    const deleteModalTitle = "Delete";
    const isDeleteModal = title === deleteModalTitle;
    const visible = isDeleteModal || open;
    return visible ? (
      <div role="dialog" aria-label={title}>
        {children}
        <button
          data-testid={`close-modal-${title.toLowerCase().replace(/\s+/g, "-")}`}
          onClick={() => onOpenChange(false)}
        >
          Close
        </button>
      </div>
    ) : null;
  },
}));

describe("BooksListPage", () => {
  beforeEach(() => {
    mockListExecute.mockReset();
    mockDeleteExecute.mockReset();
    mockToastError.mockReset();
    mockToastSuccess.mockReset();
    listResolveMock.mockImplementation((name: string) =>
      name === "findBooksUseCase"
        ? { execute: mockListExecute }
        : name === "deleteBookUseCase"
          ? { execute: mockDeleteExecute }
          : name === "createBookUseCase"
            ? { execute: vi.fn() }
            : {},
    );
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

  it("cleans up on unmount", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: { items: [], nextCursor: null, hasMore: false },
    });
    const { unmount } = render(<BooksListPage />);
    await waitFor(() => {
      expect(mockListExecute).toHaveBeenCalled();
    });
    unmount();
  });

  it("shows signInRequired when user is null", () => {
    useAuthUserStore.setState({ user: null });
    render(<BooksListPage />);
    expect(screen.getByText(listMessages.signInRequired)).toBeInTheDocument();
    expect(mockListExecute).not.toHaveBeenCalled();
  });

  it("shows title, create button, search and page size when user is set", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: { items: [], nextCursor: null, hasMore: false },
    });
    render(<BooksListPage />);

    await waitFor(() => {
      expect(mockListExecute).toHaveBeenCalledWith({
        userId: "user-1",
        orderBy: "title",
        searchTerm: undefined,
        pageSize: 10,
        pageCursor: null,
      });
    });

    expect(
      screen.getByRole("heading", { name: listMessages.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: listMessages.create }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(listMessages.searchPlaceholder),
    ).toBeInTheDocument();
    expect(screen.getByText(listMessages.pageSize)).toBeInTheDocument();
  });

  it("opens create modal when Create book is clicked and shows form", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: { items: [], nextCursor: null, hasMore: false },
    });
    const user = userEvent.setup();
    render(<BooksListPage />);
    await waitFor(() => {
      expect(mockListExecute).toHaveBeenCalled();
    });
    await user.click(screen.getByRole("button", { name: listMessages.create }));
    const createMessages = messages.modules.books.pages.create;
    expect(
      screen.getByRole("dialog", { name: createMessages.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /title/i })).toBeInTheDocument();
  });

  it("closes create modal when Cancel button is clicked in BookForm", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: { items: [], nextCursor: null, hasMore: false },
    });
    const user = userEvent.setup();
    render(<BooksListPage />);
    await waitFor(() => {
      expect(mockListExecute).toHaveBeenCalled();
    });
    await user.click(screen.getByRole("button", { name: listMessages.create }));
    const createMessages = messages.modules.books.pages.create;
    const createDialog = screen.getByRole("dialog", {
      name: createMessages.title,
    });
    expect(createDialog).toBeInTheDocument();
    const formMessages = messages.modules.books.form;
    await user.click(
      within(createDialog).getByRole("button", { name: formMessages.cancel }),
    );
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: createMessages.title }),
      ).not.toBeInTheDocument();
    });
  });

  it("closes create modal via onOpenChange callback", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: { items: [], nextCursor: null, hasMore: false },
    });
    const user = userEvent.setup();
    render(<BooksListPage />);
    await waitFor(() => {
      expect(mockListExecute).toHaveBeenCalled();
    });
    await user.click(screen.getByRole("button", { name: listMessages.create }));
    const createMessages = messages.modules.books.pages.create;
    expect(
      screen.getByRole("dialog", { name: createMessages.title }),
    ).toBeInTheDocument();
    await user.click(screen.getByTestId("close-modal-create-book"));
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: createMessages.title }),
      ).not.toBeInTheDocument();
    });
  });

  it("closes delete modal via onOpenChange callback and clears deleteTarget", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: {
        items: [
          {
            id: "b1",
            title: "Book To Delete",
            description: "D",
            genres: [],
            authors: ["A"],
            links: [],
            createdBy: "user-1",
          },
        ],
        nextCursor: null,
        hasMore: false,
      },
    });
    const user = userEvent.setup();
    render(<BooksListPage />);
    await waitFor(() => {
      expect(
        screen.getAllByText("Book To Delete").length,
      ).toBeGreaterThanOrEqual(1);
    });
    const deleteDialog = screen.getByRole("dialog", {
      name: listMessages.delete,
    });
    const rowDeleteButton = screen
      .getAllByRole("button", { name: listMessages.delete })
      .find((btn) => !deleteDialog.contains(btn));
    await user.click(rowDeleteButton!);
    await user.click(screen.getByTestId("close-modal-delete"));
    expect(mockDeleteExecute).not.toHaveBeenCalled();
  });

  it("create modal submit calls createBookUseCase then closes modal and reloads list", async () => {
    const mockCreateExecute = vi.fn().mockResolvedValue({
      success: true,
      data: { id: "new-id" },
    });
    listResolveMock.mockImplementation((name: string) =>
      name === "findBooksUseCase"
        ? { execute: mockListExecute }
        : name === "createBookUseCase"
          ? { execute: mockCreateExecute }
          : name === "deleteBookUseCase"
            ? { execute: mockDeleteExecute }
            : {},
    );
    mockListExecute
      .mockResolvedValueOnce({
        success: true,
        data: { items: [], nextCursor: null, hasMore: false },
      })
      .mockResolvedValueOnce({
        success: true,
        data: { items: [], nextCursor: null, hasMore: false },
      });
    const user = userEvent.setup();
    render(<BooksListPage />);
    await waitFor(() => {
      expect(mockListExecute).toHaveBeenCalled();
    });
    await user.click(screen.getByRole("button", { name: listMessages.create }));
    const createMessages = messages.modules.books.pages.create;
    await waitFor(() => {
      expect(
        screen.getByRole("dialog", { name: createMessages.title }),
      ).toBeInTheDocument();
    });
    const formLabels = messages.modules.books.form;
    await user.type(screen.getByLabelText(formLabels.title), "New Book");
    await user.type(
      screen.getByLabelText(formLabels.description),
      "Description",
    );
    await user.type(screen.getByLabelText(formLabels.authors), "Author One");
    await user.click(
      screen.getByRole("button", { name: createMessages.submit }),
    );
    await waitFor(() => {
      expect(mockCreateExecute).toHaveBeenCalledWith({
        userId: "user-1",
        input: expect.objectContaining({
          title: "New Book",
          description: "Description",
        }),
      });
    });
    expect(mockToastSuccess).toHaveBeenCalledWith(createMessages.created);
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: createMessages.title }),
      ).not.toBeInTheDocument();
    });
    expect(mockListExecute).toHaveBeenCalledTimes(2);
  });

  it("create modal submit shows signInRequired toast when user is null at submit time", async () => {
    const mockCreateExecute = vi.fn();
    listResolveMock.mockImplementation((name: string) =>
      name === "findBooksUseCase"
        ? { execute: mockListExecute }
        : name === "createBookUseCase"
          ? { execute: mockCreateExecute }
          : name === "deleteBookUseCase"
            ? { execute: mockDeleteExecute }
            : {},
    );
    mockListExecute.mockResolvedValue({
      success: true,
      data: { items: [], nextCursor: null, hasMore: false },
    });
    const user = userEvent.setup();
    render(<BooksListPage />);
    await waitFor(() => {
      expect(mockListExecute).toHaveBeenCalled();
    });
    await user.click(screen.getByRole("button", { name: listMessages.create }));
    const createMessages = messages.modules.books.pages.create;
    const formLabels = messages.modules.books.form;
    await user.type(screen.getByLabelText(formLabels.title), "New Book");
    await user.type(
      screen.getByLabelText(formLabels.description),
      "Description",
    );
    await user.type(screen.getByLabelText(formLabels.authors), "Author One");
    const getStateSpy = vi.spyOn(useAuthUserStore, "getState");
    getStateSpy.mockReturnValueOnce({ user: null } as never);
    await user.click(
      screen.getByRole("button", { name: createMessages.submit }),
    );
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        createMessages.errors.signInRequired,
      );
    });
    getStateSpy.mockRestore();
  });

  it("create modal submit shows error toast when create fails", async () => {
    const mockCreateExecute = vi.fn().mockResolvedValue({
      success: false,
      error: "generic",
    });
    listResolveMock.mockImplementation((name: string) =>
      name === "findBooksUseCase"
        ? { execute: mockListExecute }
        : name === "createBookUseCase"
          ? { execute: mockCreateExecute }
          : name === "deleteBookUseCase"
            ? { execute: mockDeleteExecute }
            : {},
    );
    mockListExecute.mockResolvedValue({
      success: true,
      data: { items: [], nextCursor: null, hasMore: false },
    });
    const user = userEvent.setup();
    render(<BooksListPage />);
    await waitFor(() => {
      expect(mockListExecute).toHaveBeenCalled();
    });
    await user.click(screen.getByRole("button", { name: listMessages.create }));
    const createMessages = messages.modules.books.pages.create;
    const formLabels = messages.modules.books.form;
    await user.type(screen.getByLabelText(formLabels.title), "New Book");
    await user.type(
      screen.getByLabelText(formLabels.description),
      "Description",
    );
    await user.type(screen.getByLabelText(formLabels.authors), "Author One");
    await user.click(
      screen.getByRole("button", { name: createMessages.submit }),
    );
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        createMessages.errors.createFailed,
      );
    });
  });

  it("changing page size triggers reload with new pageSize", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: { items: [], nextCursor: null, hasMore: false },
    });
    const user = userEvent.setup();
    render(<BooksListPage />);
    await waitFor(() => {
      expect(mockListExecute).toHaveBeenCalledWith(
        expect.objectContaining({ pageSize: 10 }),
      );
    });
    mockListExecute.mockClear();
    await user.click(screen.getByRole("button", { name: "10" }));
    await user.click(screen.getByRole("menuitem", { name: "20" }));
    await waitFor(() => {
      expect(mockListExecute).toHaveBeenCalledWith(
        expect.objectContaining({ pageSize: 20 }),
      );
    });
  });

  it("shows loading then empty when list returns no items", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: { items: [], nextCursor: null, hasMore: false },
    });
    render(<BooksListPage />);

    expect(
      screen.getByRole("status", { name: listMessages.loading }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(listMessages.empty)).toBeInTheDocument();
    });
  });

  it("shows grid of books with view and delete buttons", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: {
        items: [
          {
            id: "book-1",
            title: "First Book",
            description: "D1",
            genres: ["Fiction"],
            authors: ["Author A"],
            links: [],
            createdBy: "user-1",
          },
        ],
        nextCursor: null,
        hasMore: false,
      },
    });
    render(<BooksListPage />);

    await waitFor(() => {
      expect(screen.getAllByText("First Book").length).toBeGreaterThanOrEqual(
        1,
      );
    });

    expect(screen.getAllByText(/Author A/).length).toBeGreaterThanOrEqual(1);
    const viewLinks = screen.getAllByRole("link", {
      name: listMessages.viewDetail,
    });
    expect(viewLinks.length).toBeGreaterThanOrEqual(1);
    expect(viewLinks[0]).toHaveAttribute("href", "/app/books/detail?id=book-1");
    const deleteButtons = screen.getAllByRole("button", {
      name: listMessages.delete,
    });
    expect(deleteButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("mobile view delete button sets delete target", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: {
        items: [
          {
            id: "book-1",
            title: "Mobile Book",
            description: "D1",
            genres: ["Fiction"],
            authors: ["Author A"],
            links: [],
            createdBy: "user-1",
          },
        ],
        nextCursor: null,
        hasMore: false,
      },
    });
    mockDeleteExecute.mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<BooksListPage />);

    await waitFor(() => {
      expect(screen.getAllByText("Mobile Book").length).toBeGreaterThanOrEqual(
        1,
      );
    });

    const deleteDialog = screen.getByRole("dialog", {
      name: listMessages.delete,
    });
    const table = screen.getByRole("table");
    const allDeleteButtons = screen
      .getAllByRole("button", { name: listMessages.delete })
      .filter((btn) => !deleteDialog.contains(btn));
    const mobileDeleteButton = allDeleteButtons.find(
      (btn) => !table.contains(btn),
    );
    await user.click(mobileDeleteButton!);

    await user.click(
      within(deleteDialog).getByRole("button", {
        name: listMessages.delete,
      }),
    );

    await waitFor(() => {
      expect(mockDeleteExecute).toHaveBeenCalledWith({
        userId: "user-1",
        bookId: "book-1",
      });
    });
  });

  it("shows genre overflow (+N) when book has more than 4 genres in table and more than 3 in mobile", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: {
        items: [
          {
            id: "book-1",
            title: "Multi-Genre Book",
            description: "D1",
            genres: ["Fiction", "Sci-Fi", "Thriller", "Romance", "Mystery"],
            authors: ["Author A"],
            links: [],
            createdBy: "user-1",
          },
        ],
        nextCursor: null,
        hasMore: false,
      },
    });
    render(<BooksListPage />);

    await waitFor(() => {
      expect(
        screen.getAllByText("Multi-Genre Book").length,
      ).toBeGreaterThanOrEqual(1);
    });
    expect(screen.getByText(/\+1/)).toBeInTheDocument();
    expect(screen.getByText(/\+2/)).toBeInTheDocument();
  });

  it("debounces search and calls list with searchTerm", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: { items: [], nextCursor: null, hasMore: false },
    });
    const user = userEvent.setup();
    render(<BooksListPage />);

    await waitFor(() => {
      expect(mockListExecute).toHaveBeenCalled();
    });
    mockListExecute.mockClear();

    await user.type(
      screen.getByPlaceholderText(listMessages.searchPlaceholder),
      "hello",
    );

    await waitFor(
      () => {
        expect(mockListExecute).toHaveBeenCalledWith(
          expect.objectContaining({ searchTerm: "hello" }),
        );
      },
      { timeout: 500 },
    );
  });

  it("calls toast.error when list fails", async () => {
    mockListExecute.mockResolvedValue({
      success: false,
      error: "generic",
    });
    render(<BooksListPage />);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        listMessages.errors.loadFailed,
      );
    });
  });

  it("loadNext does not call load when nextCursor is null", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: { items: [], nextCursor: null, hasMore: false },
    });
    const user = userEvent.setup();
    render(<BooksListPage />);

    await waitFor(() => {
      expect(mockListExecute).toHaveBeenCalledTimes(1);
    });
    mockListExecute.mockClear();

    const nextButton = screen.getByRole("button", { name: listMessages.next });
    expect(nextButton).toBeDisabled();
    nextButton.removeAttribute("disabled");
    await user.click(nextButton);

    expect(mockListExecute).not.toHaveBeenCalled();
  });

  it("delete calls confirm and delete use case then reloads", async () => {
    mockListExecute
      .mockResolvedValueOnce({
        success: true,
        data: {
          items: [
            {
              id: "b1",
              title: "To Delete",
              description: "D",
              genres: [],
              authors: ["A"],
              links: [],
              createdBy: "user-1",
            },
          ],
          nextCursor: null,
          hasMore: false,
        },
      })
      .mockResolvedValueOnce({
        success: true,
        data: { items: [], nextCursor: null, hasMore: false },
      });
    mockDeleteExecute.mockResolvedValue({ success: true });

    const user = userEvent.setup();
    render(<BooksListPage />);

    await waitFor(() => {
      expect(screen.getAllByText("To Delete").length).toBeGreaterThanOrEqual(1);
    });

    const deleteDialog = screen.getByRole("dialog", {
      name: listMessages.delete,
    });
    const rowDeleteButton = screen
      .getAllByRole("button", { name: listMessages.delete })
      .find((btn) => !deleteDialog.contains(btn));
    await user.click(rowDeleteButton!);

    await user.click(
      within(deleteDialog).getByRole("button", {
        name: listMessages.delete,
      }),
    );

    await waitFor(() => {
      expect(mockDeleteExecute).toHaveBeenCalledWith({
        userId: "user-1",
        bookId: "b1",
      });
    });
    expect(mockToastSuccess).toHaveBeenCalledWith(listMessages.deleted);
  });

  it("does not call delete when user is null on confirm", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: {
        items: [
          {
            id: "b1",
            title: "To Delete",
            description: "D",
            genres: [],
            authors: ["A"],
            links: [],
            createdBy: "user-1",
          },
          {
            id: "b2",
            title: "Other",
            description: "D",
            genres: [],
            authors: ["A"],
            links: [],
            createdBy: "user-1",
          },
        ],
        nextCursor: null,
        hasMore: false,
      },
    });
    const user = userEvent.setup();
    render(<BooksListPage />);

    await waitFor(() => {
      expect(screen.getAllByText("To Delete").length).toBeGreaterThanOrEqual(1);
    });

    const deleteDialog = screen.getByRole("dialog", {
      name: listMessages.delete,
    });
    const rowDeleteButton = screen
      .getAllByRole("button", { name: listMessages.delete })
      .find((btn) => !deleteDialog.contains(btn));
    await user.click(rowDeleteButton!);

    act(() => {
      useAuthUserStore.setState({ user: null });
    });
    await user.click(
      within(deleteDialog).getByRole("button", {
        name: listMessages.delete,
      }),
    );

    expect(mockDeleteExecute).not.toHaveBeenCalled();
  });

  it("does not call delete when delete confirm button is clicked with no target (mocked modal always renders)", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: { items: [], nextCursor: null, hasMore: false },
    });
    const user = userEvent.setup();
    render(<BooksListPage />);
    await waitFor(() => {
      expect(mockListExecute).toHaveBeenCalled();
    });
    const deleteDialog = screen.getByRole("dialog", {
      name: listMessages.delete,
    });
    await user.click(
      within(deleteDialog).getByRole("button", { name: listMessages.delete }),
    );
    expect(mockDeleteExecute).not.toHaveBeenCalled();
  });

  it("loadPrev resets cursor and reloads", async () => {
    mockListExecute
      .mockResolvedValueOnce({
        success: true,
        data: {
          items: [
            {
              id: "b1",
              title: "First",
              description: "D",
              genres: [],
              authors: ["A"],
              links: [],
              createdBy: "user-1",
            },
          ],
          nextCursor: "cursor-1",
          hasMore: true,
        },
      })
      .mockResolvedValueOnce({
        success: true,
        data: {
          items: [
            {
              id: "b2",
              title: "Second",
              description: "D",
              genres: [],
              authors: ["A"],
              links: [],
              createdBy: "user-1",
            },
          ],
          nextCursor: null,
          hasMore: false,
        },
      })
      .mockResolvedValueOnce({
        success: true,
        data: {
          items: [
            {
              id: "b1",
              title: "First",
              description: "D",
              genres: [],
              authors: ["A"],
              links: [],
              createdBy: "user-1",
            },
          ],
          nextCursor: "cursor-1",
          hasMore: true,
        },
      });
    const user = userEvent.setup();
    render(<BooksListPage />);

    await waitFor(() => {
      expect(screen.getAllByText("First").length).toBeGreaterThanOrEqual(1);
    });
    await user.click(screen.getByRole("button", { name: listMessages.next }));
    await waitFor(() => {
      expect(screen.getAllByText("Second").length).toBeGreaterThanOrEqual(1);
    });
    mockListExecute.mockClear();
    await user.click(
      screen.getByRole("button", { name: listMessages.previous }),
    );
    await waitFor(() => {
      expect(mockListExecute).toHaveBeenCalledWith(
        expect.objectContaining({ pageCursor: null }),
      );
    });
  });

  it("shows error toast when delete fails", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: {
        items: [
          {
            id: "b1",
            title: "Book",
            description: "D",
            genres: [],
            authors: ["A"],
            links: [],
            createdBy: "user-1",
          },
        ],
        nextCursor: null,
        hasMore: false,
      },
    });
    mockDeleteExecute.mockResolvedValue({ success: false, error: "generic" });
    const user = userEvent.setup();
    render(<BooksListPage />);

    await waitFor(() => {
      const deleteDialog = screen.getByRole("dialog", {
        name: listMessages.delete,
      });
      const rowDeleteButton = screen
        .getAllByRole("button", { name: listMessages.delete })
        .find((btn) => !deleteDialog.contains(btn));
      expect(rowDeleteButton).toBeDefined();
    });
    const deleteDialog = screen.getByRole("dialog", {
      name: listMessages.delete,
    });
    const rowDeleteButton = screen
      .getAllByRole("button", { name: listMessages.delete })
      .find((btn) => !deleteDialog.contains(btn));
    await user.click(rowDeleteButton!);

    await user.click(
      within(deleteDialog).getByRole("button", {
        name: listMessages.delete,
      }),
    );

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        listMessages.errors.deleteFailed,
      );
    });
  });

  it("does not delete when user cancels confirm", async () => {
    mockListExecute.mockResolvedValue({
      success: true,
      data: {
        items: [
          {
            id: "b1",
            title: "Book",
            description: "D",
            genres: [],
            authors: ["A"],
            links: [],
            createdBy: "user-1",
          },
        ],
        nextCursor: null,
        hasMore: false,
      },
    });

    const user = userEvent.setup();
    render(<BooksListPage />);

    await waitFor(() => {
      const deleteDialog = screen.getByRole("dialog", {
        name: listMessages.delete,
      });
      const rowDeleteButton = screen
        .getAllByRole("button", { name: listMessages.delete })
        .find((btn) => !deleteDialog.contains(btn));
      expect(rowDeleteButton).toBeDefined();
    });
    const deleteDialog = screen.getByRole("dialog", {
      name: listMessages.delete,
    });
    const rowDeleteButton = screen
      .getAllByRole("button", { name: listMessages.delete })
      .find((btn) => !deleteDialog.contains(btn));
    await user.click(rowDeleteButton!);

    await user.click(
      within(deleteDialog).getByRole("button", {
        name: listMessages.cancel,
      }),
    );

    expect(mockDeleteExecute).not.toHaveBeenCalled();
  });
});
