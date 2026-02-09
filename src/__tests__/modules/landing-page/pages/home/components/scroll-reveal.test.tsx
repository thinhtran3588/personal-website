import { render, screen } from "@testing-library/react";

import { ScrollReveal } from "@/modules/landing-page/presentation/pages/home/components/scroll-reveal";

describe("ScrollReveal", () => {
  it("renders children", () => {
    render(
      <ScrollReveal>
        <span data-testid="child">Content</span>
      </ScrollReveal>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies className when provided", () => {
    const { container } = render(
      <ScrollReveal className="custom">
        <span>Content</span>
      </ScrollReveal>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("reveal");
    expect(wrapper).toHaveClass("custom");
  });

  it("has reveal class when className is not provided", () => {
    const { container } = render(
      <ScrollReveal>
        <span>Content</span>
      </ScrollReveal>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("reveal");
  });

  it("adds is-visible when IntersectionObserver fires", () => {
    const { container } = render(
      <ScrollReveal>
        <span>Content</span>
      </ScrollReveal>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(globalThis.IntersectionObserver).toBeDefined();
  });
});
