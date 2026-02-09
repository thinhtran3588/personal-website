import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocale } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";

import messages from "@/application/localization/en.json";
import { LanguageSelector } from "@/modules/settings/presentation/components/language-selector";
import { useUserSettings } from "@/modules/settings/presentation/hooks/use-user-settings-store";

vi.mock(
  "@/modules/settings/presentation/hooks/use-user-settings-store",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/modules/settings/presentation/hooks/use-user-settings-store")
      >();
    return { ...actual, useUserSettings: vi.fn() };
  },
);

const enFlags = messages.settings.language.flags as Record<string, string>;

describe("LanguageSelector", () => {
  beforeEach(() => {
    vi.mocked(useLocale).mockReturnValue("en");
    vi.mocked(useUserSettings).mockReturnValue({
      settings: {},
      setSettings: vi.fn(),
      persistLocale: vi.fn(),
      persistTheme: vi.fn(),
    });
  });

  it("renders the trigger with current locale label and flag", () => {
    render(<LanguageSelector />);

    expect(
      screen.getByRole("button", { name: "Language: English" }),
    ).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText(enFlags.en)).toBeInTheDocument();
  });

  it("uses current pathname for locale links so URL is preserved when changing language", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    await user.click(screen.getByRole("button", { name: "Language: English" }));

    await screen.findByRole("menu");
    const items = screen.getAllByRole("menuitem");
    items.forEach((item) => {
      const anchor = item.closest("a");
      expect(anchor).toHaveAttribute("href", "/");
    });
  });

  it("opens dropdown when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Language: English" }));

    const menu = await screen.findByRole("menu");
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveAttribute("aria-label", "Language");
    expect(
      screen.getByRole("menuitem", { name: /English/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /Vietnamese/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /Chinese/ }),
    ).toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <LanguageSelector />
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "Language: English" }));
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes dropdown when focus moves outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button" data-testid="outside-button">
          Outside
        </button>
        <LanguageSelector />
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "Language: English" }));
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByTestId("outside-button"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes dropdown when selecting a locale", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    await user.click(screen.getByRole("button", { name: "Language: English" }));
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: /Vietnamese/ }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("renders empty locale label when current locale has no matching option", () => {
    vi.mocked(useLocale).mockReturnValue("fr" as "en");
    render(<LanguageSelector />);

    const button = screen.getByRole("button", { name: /^Language:/ });
    expect(button).toHaveAttribute("aria-label", "Language: ");
  });

  it("calls persistLocale when a locale option is clicked", async () => {
    const user = userEvent.setup();
    const persistLocaleMock = vi.fn();
    vi.mocked(useUserSettings).mockReturnValue({
      settings: {},
      setSettings: vi.fn(),
      persistLocale: persistLocaleMock,
      persistTheme: vi.fn(),
    });

    render(<LanguageSelector />);

    await user.click(screen.getByRole("button", { name: "Language: English" }));
    const vietnameseItem = await screen.findByRole("menuitem", {
      name: /Vietnamese/,
    });
    await user.click(vietnameseItem);

    expect(persistLocaleMock).toHaveBeenCalledTimes(1);
    expect(persistLocaleMock).toHaveBeenCalledWith("vi");
  });
});
