import { render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { vi } from "vitest";
import { MermaidDiagram } from "@/modules/docs/presentation/components/mermaid-diagram";

const mockRender = vi.fn();
vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    render: (...args: unknown[]) => mockRender(...args),
  },
}));

describe("MermaidDiagram", () => {
  beforeEach(() => {
    mockRender.mockReset();
  });

  it("shows loading state initially", () => {
    mockRender.mockImplementation(
      () => new Promise(() => {}),
    );
    render(
      <MermaidDiagram>{"graph TD\nA --> B"}</MermaidDiagram>,
    );

    expect(screen.getByText("Loading diagram…")).toBeInTheDocument();
  });

  it("renders SVG when mermaid.render resolves", async () => {
    mockRender.mockResolvedValue({
      svg: "<svg><text>Diagram</text></svg>",
      bindFunctions: vi.fn(),
    });
    render(
      <MermaidDiagram>{"graph TD\nA --> B"}</MermaidDiagram>,
    );

    expect(await screen.findByText("Diagram")).toBeInTheDocument();
  });

  it("shows code fallback when mermaid.render rejects", async () => {
    mockRender.mockRejectedValue(new Error("parse error"));
    render(<MermaidDiagram>invalid mermaid</MermaidDiagram>);

    expect(await screen.findByText("invalid mermaid")).toBeInTheDocument();
  });

  it("extracts string from string children", async () => {
    mockRender.mockResolvedValue({
      svg: "<svg><g>ok</g></svg>",
      bindFunctions: vi.fn(),
    });
    render(<MermaidDiagram>{"graph LR\nx --> y"}</MermaidDiagram>);

    await screen.findByText("ok");
    expect(mockRender).toHaveBeenCalledWith(
      expect.stringMatching(/mermaid-/),
      expect.stringContaining("graph LR"),
    );
  });

  it("extracts code string from array children", async () => {
    mockRender.mockResolvedValue({
      svg: "<svg><g>ok</g></svg>",
      bindFunctions: vi.fn(),
    });
    render(
      <MermaidDiagram>{["graph TD\n", "A --> B"]}</MermaidDiagram>,
    );

    await screen.findByText("ok");
    expect(mockRender).toHaveBeenCalledWith(
      expect.stringMatching(/mermaid-/),
      "graph TD\nA --> B",
    );
  });

  it("extracts code string from React element children", async () => {
    mockRender.mockResolvedValue({
      svg: "<svg><g>ok</g></svg>",
      bindFunctions: vi.fn(),
    });
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    );
    render(
      <MermaidDiagram>
        <Wrapper>{"graph LR\nx --> y"}</Wrapper>
      </MermaidDiagram>,
    );

    await screen.findByText("ok");
    expect(mockRender).toHaveBeenCalledWith(
      expect.stringMatching(/mermaid-/),
      expect.stringContaining("graph LR"),
    );
  });

  it("extracts empty string from React element with no children", async () => {
    mockRender.mockResolvedValue({
      svg: "<svg><g /></svg>",
      bindFunctions: vi.fn(),
    });
    render(<MermaidDiagram><span /></MermaidDiagram>);

    await waitFor(() => {
      expect(mockRender).toHaveBeenCalledWith(
        expect.stringMatching(/mermaid-/),
        "",
      );
    });
  });

  it("uses String() for non-string non-array non-element children", async () => {
    mockRender.mockResolvedValue({
      svg: "<svg />",
      bindFunctions: vi.fn(),
    });
    render(<MermaidDiagram>{123 as unknown as React.ReactNode}</MermaidDiagram>);

    await waitFor(() => {
      expect(mockRender).toHaveBeenCalledWith(
        expect.stringMatching(/mermaid-/),
        "123",
      );
    });
  });

  it("uses empty string for null children", async () => {
    mockRender.mockResolvedValue({
      svg: "<svg />",
      bindFunctions: vi.fn(),
    });
    render(<MermaidDiagram>{null}</MermaidDiagram>);

    await waitFor(() => {
      expect(mockRender).toHaveBeenCalledWith(
        expect.stringMatching(/mermaid-/),
        "",
      );
    });
  });
});
