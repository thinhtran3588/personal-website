import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/card";

describe("Card", () => {
  it("renders with default variant", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveAttribute("data-slot", "card");
    expect(card).toHaveClass("glass-panel");
    expect(card).toHaveTextContent("Content");
  });

  it("renders with strong variant", () => {
    const { container } = render(<Card variant="strong">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("glass-panel-strong");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges custom className", () => {
    const { container } = render(<Card className="custom">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("custom");
  });
});

describe("CardHeader", () => {
  it("renders with data-slot", () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    expect(
      container.querySelector("[data-slot='card-header']"),
    ).toHaveTextContent("Header");
  });
});

describe("CardTitle", () => {
  it("renders as h3 with data-slot", () => {
    render(<CardTitle>Title</CardTitle>);
    const title = screen.getByRole("heading", { level: 3, name: "Title" });
    expect(title).toHaveAttribute("data-slot", "card-title");
  });
});

describe("CardDescription", () => {
  it("renders with data-slot", () => {
    const { container } = render(
      <CardDescription>Description text</CardDescription>,
    );
    const desc = container.querySelector("[data-slot='card-description']");
    expect(desc).toHaveTextContent("Description text");
  });
});

describe("CardContent", () => {
  it("renders with data-slot", () => {
    const { container } = render(<CardContent>Body</CardContent>);
    expect(
      container.querySelector("[data-slot='card-content']"),
    ).toHaveTextContent("Body");
  });
});
