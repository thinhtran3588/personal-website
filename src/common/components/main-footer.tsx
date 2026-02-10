type MainFooterProps = {
  copyright: string;
};

export function MainFooter({ copyright }: MainFooterProps) {
  return (
    <footer className="relative z-10 border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-[24px] backdrop-saturate-[1.8]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-8">
        <p className="text-sm text-[var(--text-muted)]">{copyright}</p>
      </div>
    </footer>
  );
}
