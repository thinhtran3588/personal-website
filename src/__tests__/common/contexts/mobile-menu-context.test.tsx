import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  MobileMenuProvider,
  useMobileMenu,
} from "@/common/contexts/mobile-menu-context";

function Consumer() {
  const isMobileMenu = useMobileMenu();
  return <span data-testid="value">{isMobileMenu ? "true" : "false"}</span>;
}

describe("mobile-menu-context", () => {
  it("useMobileMenu returns false when outside provider", () => {
    render(<Consumer />);
    expect(screen.getByTestId("value")).toHaveTextContent("false");
  });

  it("useMobileMenu returns true when inside MobileMenuProvider with value true", () => {
    render(
      <MobileMenuProvider value={true}>
        <Consumer />
      </MobileMenuProvider>,
    );
    expect(screen.getByTestId("value")).toHaveTextContent("true");
  });
});
