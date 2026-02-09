"use client";

import { useEffect, useId, useState } from "react";
import mermaid from "mermaid";
import { cn } from "@/common/utils/cn";

type MermaidDiagramProps = {
  children: React.ReactNode;
  className?: string;
};

function getCodeString(children: React.ReactNode): string {
  if (typeof children === "string") {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(getCodeString).join("");
  }
  if (children && typeof children === "object" && "props" in children) {
    const element = children as React.ReactElement<{ children?: React.ReactNode }>;
    return getCodeString(element.props.children ?? "");
  }
  return String(children ?? "");
}

export function MermaidDiagram({ children, className }: MermaidDiagramProps) {
  const id = useId().replace(/:/g, "-");
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const code = getCodeString(children);

  useEffect(() => {
    let cancelled = false;

    const reset = () => {
      if (!cancelled) {
        setError(false);
        setSvg(null);
      }
    };
    queueMicrotask(reset);

    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "loose",
    });

    mermaid
      .render(`mermaid-${id}`, code.trim())
      .then(({ svg: result }) => {
        if (!cancelled) {
          setSvg(result);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, code]);

  if (error) {
    return (
      <pre
        className={cn(
          "mt-3 overflow-x-auto rounded-xl bg-white/5 p-4 font-mono text-sm text-white/90",
          className,
        )}
      >
        <code>{code}</code>
      </pre>
    );
  }

  if (svg === null) {
    return (
      <div
        className={cn(
          "mt-3 flex min-h-[120px] items-center justify-center rounded-xl bg-[var(--glass-highlight)]",
          className,
        )}
        aria-busy="true"
      >
        <span className="text-sm text-[var(--text-muted)]">Loading diagram…</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mt-3 flex justify-center overflow-x-auto rounded-xl bg-[var(--glass-highlight)] p-4 [&_svg]:max-w-full",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
