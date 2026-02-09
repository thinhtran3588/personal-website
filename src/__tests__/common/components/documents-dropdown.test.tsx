import { act, fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { DocumentsDropdown } from "@/common/components/documents-dropdown";

let mockPathname = "/";
vi.mock("@/common/routing/navigation", async (importOriginal) => {
  const mod =
    await importOriginal<typeof import("@/common/routing/navigation")>();
  return {
    ...mod,
    usePathname: () => mockPathname,
  };
});

const defaultProps = {
  documentsLabel: "Documents",
  items: [
    { label: "Architecture", href: "/docs/architecture" },
    { label: "Development guide", href: "/docs/development-guide" },
    { label: "Testing guide", href: "/docs/testing-guide" },
  ],
};

describe("DocumentsDropdown", () => {
  it("renders the trigger with documents label", () => {
    render(<DocumentsDropdown {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: defaultProps.documentsLabel }),
    ).toBeInTheDocument();
    expect(screen.getByText(defaultProps.documentsLabel)).toBeInTheDocument();
  });

  it("opens dropdown when trigger is clicked", () => {
    render(<DocumentsDropdown {...defaultProps} />);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: defaultProps.documentsLabel }),
    );

    expect(
      screen.getByRole("menu", { name: defaultProps.documentsLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Architecture" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Development guide" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Testing guide" }),
    ).toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <DocumentsDropdown {...defaultProps} />
      </div>,
    );

    fireEvent.click(
      screen.getByRole("button", { name: defaultProps.documentsLabel }),
    );
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes dropdown when focus moves outside", () => {
    render(
      <div>
        <button type="button" data-testid="outside-button">
          Outside
        </button>
        <DocumentsDropdown {...defaultProps} />
      </div>,
    );

    fireEvent.click(
      screen.getByRole("button", { name: defaultProps.documentsLabel }),
    );
    expect(screen.getByRole("menu")).toBeInTheDocument();

    const outsideButton = screen.getByTestId("outside-button");
    act(() => {
      outsideButton.focus();
      fireEvent.focusIn(outsideButton);
    });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes dropdown when a document link is clicked", () => {
    render(<DocumentsDropdown {...defaultProps} />);

    fireEvent.click(
      screen.getByRole("button", { name: defaultProps.documentsLabel }),
    );
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("menuitem", { name: "Development guide" }),
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("applies active styling when pathname starts with /docs", () => {
    mockPathname = "/docs/architecture";
    render(<DocumentsDropdown {...defaultProps} />);

    const trigger = screen.getByRole("button", {
      name: defaultProps.documentsLabel,
    });
    expect(trigger).toHaveClass("font-bold");
  });

  it("does not apply active styling when pathname is not under /docs", () => {
    mockPathname = "/";
    render(<DocumentsDropdown {...defaultProps} />);

    const trigger = screen.getByRole("button", {
      name: defaultProps.documentsLabel,
    });
    expect(trigger).not.toHaveClass("font-bold");
  });

  it("renders document links with correct hrefs", () => {
    render(<DocumentsDropdown {...defaultProps} />);

    fireEvent.click(
      screen.getByRole("button", { name: defaultProps.documentsLabel }),
    );

    expect(
      screen.getByRole("menuitem", { name: "Architecture" }),
    ).toHaveAttribute("href", "/docs/architecture");
    expect(
      screen.getByRole("menuitem", { name: "Development guide" }),
    ).toHaveAttribute("href", "/docs/development-guide");
    expect(
      screen.getByRole("menuitem", { name: "Testing guide" }),
    ).toHaveAttribute("href", "/docs/testing-guide");
  });

  it("keeps dropdown open when pointerdown is inside the container", () => {
    render(<DocumentsDropdown {...defaultProps} />);

    fireEvent.click(
      screen.getByRole("button", { name: defaultProps.documentsLabel }),
    );
    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();

    fireEvent.pointerDown(menu);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("applies rotate-180 to chevron when dropdown is open", () => {
    render(<DocumentsDropdown {...defaultProps} />);

    const trigger = screen.getByRole("button", {
      name: defaultProps.documentsLabel,
    });
    const svg = trigger.querySelector("svg");
    expect(svg).not.toHaveClass("rotate-180");

    fireEvent.click(trigger);
    expect(svg).toHaveClass("rotate-180");
  });

  it("applies active styling to the current document menuitem", () => {
    mockPathname = "/docs/architecture";
    render(<DocumentsDropdown {...defaultProps} />);

    fireEvent.click(
      screen.getByRole("button", { name: defaultProps.documentsLabel }),
    );

    const architectureLink = screen.getByRole("menuitem", {
      name: "Architecture",
    });
    expect(architectureLink).toHaveClass(
      "bg-[var(--glass-highlight)]",
      "text-[var(--text-primary)]",
    );
  });

  it("closes when focus moves outside and event target is a Node", () => {
    render(
      <div>
        <button type="button" data-testid="outside-button">
          Outside
        </button>
        <DocumentsDropdown {...defaultProps} />
      </div>,
    );

    fireEvent.click(
      screen.getByRole("button", { name: defaultProps.documentsLabel }),
    );
    expect(screen.getByRole("menu")).toBeInTheDocument();

    const outsideButton = screen.getByTestId("outside-button");
    act(() => {
      const focusInEvent = new FocusEvent("focusin", {
        bubbles: true,
        relatedTarget: outsideButton,
      });
      Object.defineProperty(focusInEvent, "target", {
        value: outsideButton,
        writable: false,
      });
      outsideButton.focus();
      outsideButton.dispatchEvent(focusInEvent);
    });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
