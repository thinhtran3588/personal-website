import { render } from "@testing-library/react";
import { vi } from "vitest";

import { ThemeProvider } from "@/common/components/theme-provider";
import { useUserSettingsStore } from "@/modules/settings/presentation/hooks/use-user-settings-store";

describe("ThemeProvider", () => {
  it("renders children", () => {
    const { getByText } = render(
      <ThemeProvider>
        <span>Child</span>
      </ThemeProvider>,
    );
    expect(getByText("Child")).toBeInTheDocument();
  });

  it("applies dark class when theme is dark", () => {
    useUserSettingsStore.setState({ settings: { theme: "dark" } });
    render(
      <ThemeProvider>
        <span>Child</span>
      </ThemeProvider>,
    );
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });

  it("applies light class when theme is light", () => {
    useUserSettingsStore.setState({ settings: { theme: "light" } });
    render(
      <ThemeProvider>
        <span>Child</span>
      </ThemeProvider>,
    );
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("applies theme when system preference changes and theme is system", () => {
    let changeListener: () => void;
    const addEventListener = vi.fn((_event: string, listener: () => void) => {
      changeListener = listener;
    });
    const removeEventListener = vi.fn();
    Object.defineProperty(window, "matchMedia", {
      value: vi.fn(() => ({
        matches: false,
        addEventListener,
        removeEventListener,
      })),
      writable: true,
    });
    useUserSettingsStore.setState({ settings: { theme: "system" } });
    render(
      <ThemeProvider>
        <span>Child</span>
      </ThemeProvider>,
    );
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    changeListener!();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
