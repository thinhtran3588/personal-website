import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { PrintButton } from "@/modules/landing-page/presentation/pages/cv/components/print-button";

describe("PrintButton", () => {
  it("triggers window.print when clicked", () => {
    const printSpy = vi.fn();
    Object.defineProperty(window, "print", {
      value: printSpy,
      writable: true,
    });

    render(<PrintButton label="Print CV" />);

    fireEvent.click(screen.getByRole("button", { name: "Print CV" }));

    expect(printSpy).toHaveBeenCalledTimes(1);
  });
});
