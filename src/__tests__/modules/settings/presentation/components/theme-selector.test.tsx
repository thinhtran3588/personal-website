import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Theme } from "@/common/utils/theme";
import { ThemeSelector } from "@/modules/settings/presentation/components/theme-selector";
import { useUserSettingsStore } from "@/modules/settings/presentation/hooks/use-user-settings-store";

const mockPersistLocale = vi.fn();
const mockPersistTheme = vi.fn();

vi.mock(
  "@/modules/settings/presentation/hooks/use-user-settings-store",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/modules/settings/presentation/hooks/use-user-settings-store")
      >();
    return {
      ...actual,
      useUserSettings: vi.fn(() => ({
        settings: actual.useUserSettingsStore.getState().settings,
        setSettings: actual.useUserSettingsStore.getState().setSettings,
        persistLocale: mockPersistLocale,
        persistTheme: mockPersistTheme,
      })),
    };
  },
);

describe("ThemeSelector", () => {
  beforeEach(() => {
    useUserSettingsStore.setState({ settings: { theme: "system" } });
    mockPersistLocale.mockClear();
    mockPersistTheme.mockClear();
  });

  it("renders the trigger with accessible theme label", () => {
    render(<ThemeSelector />);

    expect(
      screen.getByRole("button", { name: "Theme: System" }),
    ).toBeInTheDocument();
  });

  it("opens dropdown when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<ThemeSelector />);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Theme: System" }));

    const menu = await screen.findByRole("menu");
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveAttribute("aria-label", "Theme");
    expect(
      screen.getByRole("menuitem", { name: /System/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Light/ })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Dark/ })).toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <ThemeSelector />
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "Theme: System" }));
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("calls persistTheme and closes dropdown when selecting an option", async () => {
    const user = userEvent.setup();
    render(<ThemeSelector />);

    await user.click(screen.getByRole("button", { name: "Theme: System" }));
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: /Light/ }));

    expect(mockPersistTheme).toHaveBeenCalledWith("light");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes dropdown when focus moves outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button" data-testid="outside-button">
          Outside
        </button>
        <ThemeSelector />
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "Theme: System" }));
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByTestId("outside-button"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("calls persistTheme when a theme option is clicked", async () => {
    const user = userEvent.setup();
    render(<ThemeSelector />);

    await user.click(screen.getByRole("button", { name: "Theme: System" }));
    const darkItem = await screen.findByRole("menuitem", { name: /Dark/ });
    await user.click(darkItem);

    expect(mockPersistTheme).toHaveBeenCalledTimes(1);
    expect(mockPersistTheme).toHaveBeenCalledWith("dark");
  });

  it("renders empty theme label when store theme has no matching option", () => {
    useUserSettingsStore.setState({
      settings: { theme: "invalid" as Theme },
    });

    render(<ThemeSelector />);

    const button = screen.getByRole("button", { name: /^Theme:/ });
    expect(button).toHaveAttribute("aria-label", "Theme: ");
  });
});
