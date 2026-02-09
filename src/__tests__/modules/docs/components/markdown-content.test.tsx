import { render, screen } from "@testing-library/react";
import { MarkdownContent } from "@/modules/docs/presentation/components/markdown-content";

describe("MarkdownContent", () => {
  it("renders markdown content as HTML", () => {
    render(
      <MarkdownContent
        content={"# Hello\n\n## Sub\n\n### SubSub\n\nParagraph **bold**."}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /Hello/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /Sub/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /SubSub/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Paragraph/)).toBeInTheDocument();
    expect(screen.getByText("bold")).toBeInTheDocument();
  });

  it("renders code blocks with pre wrapper", () => {
    render(
      <MarkdownContent content={"```js\nconst x = 1;\n```"} />,
    );

    expect(screen.getByText(/const x = 1/)).toBeInTheDocument();
  });

  it("renders links with correct attributes for external URLs", () => {
    render(
      <MarkdownContent content="[External](https://example.com)" />,
    );

    const link = screen.getByRole("link", { name: "External" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders internal links without target and rel", () => {
    render(<MarkdownContent content="[Home](/)" />);

    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveAttribute("href", "/");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });

  it("renders mermaid code block as MermaidDiagram", () => {
    render(
      <MarkdownContent
        content={"```mermaid\ngraph TD\nA --> B\n```"}
      />,
    );

    expect(screen.getByTestId("markdown-content")).toBeInTheDocument();
    expect(screen.getByText("Loading diagram…")).toBeInTheDocument();
  });

  it("renders inline code with code class", () => {
    render(<MarkdownContent content="Use `inlineCode` here." />);

    expect(screen.getByText("inlineCode")).toHaveClass("rounded");
  });

  it("renders unordered list and list items", () => {
    render(<MarkdownContent content="- One\n- Two" />);

    const list = screen.getByRole("list");
    expect(list).toHaveAttribute(
      "class",
      expect.stringContaining("list-disc"),
    );
    expect(screen.getByRole("listitem")).toBeInTheDocument();
  });

  it("renders ordered list and list items", () => {
    render(<MarkdownContent content="1. First\n2. Second" />);

    const list = screen.getByRole("list");
    expect(list).toHaveAttribute(
      "class",
      expect.stringContaining("list-decimal"),
    );
    expect(screen.getByRole("listitem")).toBeInTheDocument();
  });

  it("renders blockquote", () => {
    render(<MarkdownContent content="> A quote" />);

    expect(screen.getByText("A quote")).toBeInTheDocument();
  });

  it("renders horizontal rule when content has thematic break", () => {
    render(<MarkdownContent content="***" />);

    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders table with head and body", () => {
    render(
      <MarkdownContent
        content={"| A | B |\n| --- | --- |\n| 1 | 2 |"}
      />,
    );

    expect(screen.getByRole("columnheader", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "1" })).toBeInTheDocument();
  });

  it("applies data-testid markdown-content", () => {
    const { container } = render(
      <MarkdownContent content="Text" />,
    );
    expect(container.querySelector("[data-testid=markdown-content]")).toBeInTheDocument();
  });

  it("generates anchor ids for headers using rehype-slug", () => {
    render(
      <MarkdownContent
        content={
          "# Architecture Overview\n\n## Getting Started\n\n### Step 1: Install"
        }
      />,
    );

    const h1 = screen.getByRole("heading", {
      level: 1,
      name: /Architecture Overview/,
    });
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: /Getting Started/,
    });
    const h3 = screen.getByRole("heading", {
      level: 3,
      name: /Step 1: Install/,
    });

    expect(h1).toHaveAttribute("id", "architecture-overview");
    expect(h2).toHaveAttribute("id", "getting-started");
    expect(h3).toHaveAttribute("id", "step-1-install");
  });

  it("allows anchor links in table of contents to navigate to headers", () => {
    render(
      <MarkdownContent
        content={
          "## Table of Contents\n\n- [Overview](#overview)\n\n## Overview\n\nContent here."
        }
      />,
    );

    const tocLink = screen.getByRole("link", { name: "Overview" });
    expect(tocLink).toHaveAttribute("href", "#overview");

    const overviewHeading = screen.getByRole("heading", {
      level: 2,
      name: "Overview",
    });
    expect(overviewHeading).toHaveAttribute("id", "overview");
  });
});
