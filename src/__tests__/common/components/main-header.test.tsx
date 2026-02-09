import { fireEvent, render, screen, within } from "@testing-library/react";
import { vi } from "vitest";

import { MainHeader } from "@/common/components/main-header";
import type { ResolvedMenuItem } from "@/common/interfaces";

let mockPathname = "/";
vi.mock("@/common/routing/navigation", async (importOriginal) => {
  const mod =
    await importOriginal<typeof import("@/common/routing/navigation")>();
  return {
    ...mod,
    usePathname: () => mockPathname,
  };
});

const menuItems: ResolvedMenuItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "products", label: "Products", href: "/products" },
  { id: "contact", label: "Contact", href: "/contact" },
];

const defaultSettingsSlot = (
  <>
    <button type="button" aria-label="Theme: System">
      Theme
    </button>
    <button type="button" aria-label="Language: English">
      Language
    </button>
  </>
);

const baseProps = {
  badge: "Liquid Badge",
  menuItems,
  menuLabel: "Menu",
  settingsSlot: defaultSettingsSlot,
};

const setScrollY = (value: number) => {
  Object.defineProperty(window, "scrollY", {
    value,
    writable: true,
    configurable: true,
  });
};

describe("MainHeader", () => {
  it("renders the primary navigation", () => {
    render(<MainHeader {...baseProps} />);

    expect(screen.getByText(baseProps.badge)).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Theme:/ })).toBeInTheDocument();
  });

  it("highlights the current page in the menu", () => {
    mockPathname = "/";
    render(<MainHeader {...baseProps} />);

    const homeLinks = screen.getAllByRole("link", {
      name: "Home",
    });
    expect(homeLinks.length).toBeGreaterThan(0);
    homeLinks.forEach((link) => {
      expect(link).toHaveClass("font-bold");
    });
  });

  it("highlights Products when on products page", () => {
    mockPathname = "/products";
    render(<MainHeader {...baseProps} />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    const productsLink = screen.getByRole("link", { name: "Products" });

    expect(homeLink).not.toHaveClass("font-bold");
    expect(productsLink).toHaveClass("font-bold");
  });

  it("highlights current page in mobile menu when open", () => {
    mockPathname = "/contact";
    render(<MainHeader {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));

    const contactLinks = within(screen.getByTestId("mobile-menu")).getAllByRole(
      "link",
      { name: "Contact" },
    );
    expect(contactLinks.length).toBeGreaterThanOrEqual(1);
    contactLinks.forEach((link) => {
      expect(link).toHaveClass("font-bold");
    });
  });

  it("closes mobile menu when backdrop is clicked", () => {
    render(<MainHeader {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("mobile-menu-backdrop"));
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
  });

  it("closes mobile menu when a nav link is clicked", () => {
    render(<MainHeader {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));
    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toBeInTheDocument();

    fireEvent.click(within(mobileMenu).getByRole("link", { name: "Home" }));
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
  });

  it("highlights Home in mobile menu when on home page", () => {
    mockPathname = "/";
    render(<MainHeader {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));

    const homeLinks = screen.getAllByRole("link", {
      name: "Home",
    });
    homeLinks.forEach((link) => {
      expect(link).toHaveClass("font-bold");
    });
  });

  it("hides on scroll down and shows on scroll up", () => {
    setScrollY(0);
    const { container } = render(<MainHeader {...baseProps} />);
    const header = container.querySelector("header");
    expect(header).not.toBeNull();

    setScrollY(120);
    fireEvent.scroll(window);
    expect(header).toHaveClass("-translate-y-full");

    setScrollY(40);
    fireEvent.scroll(window);
    expect(header).not.toHaveClass("-translate-y-full");
  });

  it("keeps the header visible near the top", () => {
    setScrollY(0);
    const { container } = render(<MainHeader {...baseProps} />);
    const header = container.querySelector("header");
    expect(header).not.toBeNull();

    setScrollY(2);
    fireEvent.scroll(window);
    expect(header).not.toHaveClass("-translate-y-full");

    setScrollY(20);
    fireEvent.scroll(window);
    expect(header).not.toHaveClass("-translate-y-full");
  });

  it("renders settings slot content when provided", () => {
    render(
      <MainHeader
        {...baseProps}
        settingsSlot={
          <button type="button" aria-label="Language: ">
            Lang
          </button>
        }
      />,
    );

    const languageButton = screen.getByRole("button", { name: /^Language:/ });
    expect(languageButton).toHaveAttribute("aria-label", "Language: ");
  });

  it("toggles the mobile menu", () => {
    render(<MainHeader {...baseProps} />);

    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });

  it("does not render settings slot when settingsSlot is undefined", () => {
    render(<MainHeader {...baseProps} settingsSlot={undefined} />);
    expect(screen.queryByTestId("settings-slot")).not.toBeInTheDocument();
  });

  it("renders GitHub link when githubUrl is provided", () => {
    render(
      <MainHeader {...baseProps} githubUrl="https://github.com/test/repo" />,
    );

    const githubLink = screen.getByTestId("github-link");
    expect(githubLink).toHaveAttribute("href", "https://github.com/test/repo");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(githubLink).toHaveAttribute("aria-label", "GitHub");
  });

  it("does not render GitHub link when githubUrl is not provided", () => {
    render(<MainHeader {...baseProps} />);

    expect(screen.queryByTestId("github-link")).not.toBeInTheDocument();
  });
});
