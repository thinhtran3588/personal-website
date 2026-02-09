type ErrorPageViewProps = {
  title: string;
  description: string;
  primaryAction: React.ReactNode;
  secondaryAction?: React.ReactNode;
  errorCode?: string;
  eyebrow?: string;
};

export function ErrorPageView({
  title,
  description,
  primaryAction,
  secondaryAction,
  errorCode,
  eyebrow,
}: ErrorPageViewProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-2xl">
        <div className="hero-grid glass-panel-strong liquid-border rounded-2xl px-6 py-12 text-center sm:rounded-3xl sm:px-10 sm:py-16">
          {eyebrow && (
            <p className="text-xs font-medium tracking-[0.3em] text-[var(--text-muted)] uppercase">
              {eyebrow}
            </p>
          )}
          {errorCode && (
            <p
              className="mt-2 font-mono text-6xl font-semibold text-[var(--accent)] tabular-nums drop-shadow-[0_0_24px_var(--accent-glow)] sm:text-7xl"
              aria-hidden
            >
              {errorCode}
            </p>
          )}
          <h1 className="mt-4 text-2xl leading-tight font-semibold text-[var(--text-primary)] sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            {description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {secondaryAction}
            {primaryAction}
          </div>
        </div>
      </div>
    </div>
  );
}
