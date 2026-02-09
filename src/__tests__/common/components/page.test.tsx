import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Page } from "@/common/components/page";

describe("Page", () => {
  it("renders children inside panel", () => {
    render(
      <Page>
        <h1>Title</h1>
      </Page>,
    );
    expect(screen.getByRole("heading", { name: "Title" })).toBeInTheDocument();
  });

  it("applies default panel classes to wrapper", () => {
    const { container } = render(
      <Page>
        <span>Content</span>
      </Page>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("default-panel", "glass-panel-strong");
  });
});
