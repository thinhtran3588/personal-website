import { cn } from "@/common/utils/cn";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { MermaidDiagram } from "./mermaid-diagram";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

const proseClasses = {
  h1: "mt-8 text-3xl font-semibold text-[var(--text-primary)] first:mt-0 sm:text-4xl",
  h2: "mt-8 text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl",
  h3: "mt-6 text-xl font-semibold text-[var(--text-primary)]",
  p: "mt-3 text-[var(--text-muted)] leading-relaxed",
  ul: "mt-3 list-disc space-y-1 pl-6 text-[var(--text-muted)]",
  ol: "mt-3 list-decimal space-y-1 pl-6 text-[var(--text-muted)]",
  li: "leading-relaxed",
  code: "rounded bg-[var(--glass-highlight)] px-1.5 py-0.5 font-mono text-sm text-[var(--text-primary)]",
  pre: "mt-3 overflow-x-auto rounded-xl bg-[var(--glass-highlight)] p-4",
  blockquote:
    "mt-3 border-l-4 border-[var(--glass-border)] pl-4 italic text-[var(--text-muted)]",
  a: "text-[var(--text-primary)] underline underline-offset-2 hover:opacity-90",
  strong: "font-semibold text-[var(--text-primary)]",
  hr: "my-8 border-[var(--glass-border)]",
  table: "mt-3 w-full border-collapse text-[var(--text-muted)]",
  th: "border border-[var(--glass-border)] bg-[var(--glass-highlight)] px-3 py-2 text-left font-semibold text-[var(--text-primary)]",
  td: "border border-[var(--glass-border)] px-3 py-2",
  tr: "border-b border-[var(--glass-border)]",
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn("doc-content space-y-4", className)}
      data-testid="markdown-content"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h1: ({ id, children }) => (
            <h1 id={id} className={proseClasses.h1}>
              {children}
            </h1>
          ),
          h2: ({ id, children }) => (
            <h2 id={id} className={proseClasses.h2}>
              {children}
            </h2>
          ),
          h3: ({ id, children }) => (
            <h3 id={id} className={proseClasses.h3}>
              {children}
            </h3>
          ),
          p: ({ children }) => <p className={proseClasses.p}>{children}</p>,
          ul: ({ children }) => (
            <ul className={proseClasses.ul}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className={proseClasses.ol}>{children}</ol>
          ),
          li: ({ children }) => (
            <li className={proseClasses.li}>{children}</li>
          ),
          code: ({ className: codeClassName, children, ...props }) => {
            const isMermaid =
              codeClassName?.includes("language-mermaid");
            if (isMermaid) {
              return <MermaidDiagram>{children}</MermaidDiagram>;
            }
            const isBlock = codeClassName?.includes("language-");
            if (isBlock) {
              return (
                <code
                  className="block overflow-x-auto font-mono text-sm text-[var(--text-primary)]"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={proseClasses.code} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className={proseClasses.pre}>{children}</pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className={proseClasses.blockquote}>
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className={proseClasses.a}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className={proseClasses.strong}>{children}</strong>
          ),
          hr: () => <hr className={proseClasses.hr} />,
          table: ({ children }) => (
            <table className={proseClasses.table}>{children}</table>
          ),
          thead: ({ children }) => <thead>{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className={proseClasses.tr}>{children}</tr>,
          th: ({ children }) => <th className={proseClasses.th}>{children}</th>,
          td: ({ children }) => <td className={proseClasses.td}>{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
