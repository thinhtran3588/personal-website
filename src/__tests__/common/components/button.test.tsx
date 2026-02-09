import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import { Button, buttonVariants } from "@/common/components/button";
import { Link } from "@/common/routing/navigation";

describe("Button", () => {
  it("renders as a button with default variant and size", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-slot", "button");
  });

  it("forwards ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Click</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe("Click");
  });

  it("renders as child element when asChild is true", () => {
    render(
      <Button asChild variant="default">
        <Link href="/test">Link text</Link>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Link text" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
    expect(link).toHaveAttribute("data-slot", "button");
  });

  it("renders as button when asChild but children is not a single element", () => {
    render(
      <Button asChild variant="default">
        <span>One</span>
        <span>Two</span>
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("OneTwo");
  });

  it("renders as button when asChild but single child is not a valid element", () => {
    render(
      <Button asChild variant="default">
        plain text
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("plain text");
  });

  it("merges className from Button and child when asChild", () => {
    render(
      <Button asChild className="button-class">
        <Link href="/" className="child-class">
          Link
        </Link>
      </Button>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveClass("button-class");
    expect(link).toHaveClass("child-class");
  });

  it("invokes ref callback with object ref when asChild", () => {
    const parentRef = createRef<HTMLButtonElement>();
    render(
      <Button asChild ref={parentRef}>
        <Link href="/">Link</Link>
      </Button>,
    );

    expect(parentRef.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it("merges parent and child ref when asChild and child has object ref", () => {
    const parentRef = createRef<HTMLButtonElement>();
    const childRef = createRef<HTMLAnchorElement>();
    render(
      <Button asChild ref={parentRef}>
        <Link href="/" ref={childRef}>
          Link
        </Link>
      </Button>,
    );

    expect(parentRef.current).toBeInstanceOf(HTMLAnchorElement);
    expect(childRef.current).toBeInstanceOf(HTMLAnchorElement);
    expect(parentRef.current).toBe(childRef.current);
  });

  it("invokes function ref when asChild", () => {
    let captured: HTMLAnchorElement | null = null;
    render(
      <Button
        asChild
        ref={(el) => {
          captured = el as HTMLAnchorElement | null;
        }}
      >
        <Link href="/">Link</Link>
      </Button>,
    );

    expect(captured).toBeInstanceOf(HTMLAnchorElement);
  });

  it("invokes child function ref when asChild", () => {
    let childCaptured: HTMLAnchorElement | null = null;
    render(
      <Button asChild>
        <Link
          href="/"
          ref={(el) => {
            childCaptured = el;
          }}
        >
          Link
        </Link>
      </Button>,
    );

    expect(childCaptured).toBeInstanceOf(HTMLAnchorElement);
  });

  it("applies buttonVariants classes", () => {
    const { container } = render(
      <Button variant="secondary" size="sm">
        Secondary
      </Button>,
    );
    const button = container.querySelector("button");
    expect(button?.className).toMatch(/rounded-full/);
  });

  it("applies primary variant with gradient", () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    const button = container.querySelector("button");
    expect(button?.className).toMatch(/linear-gradient/);
    expect(button?.className).toMatch(/text-white/);
  });

  it("when loading is true, shows loading icon and is disabled", () => {
    render(<Button loading>Submit</Button>);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});

describe("buttonVariants", () => {
  it("returns base and variant classes", () => {
    const classes = buttonVariants({ variant: "default", size: "default" });
    expect(classes).toContain("inline-flex");
    expect(classes).toMatch(/rounded-full/);
  });
});
