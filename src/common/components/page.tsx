type PageProps = {
  children: React.ReactNode;
};

export function Page({ children }: PageProps) {
  return (
    <div className="default-panel glass-panel-strong relative w-full overflow-hidden rounded-2xl px-8 py-8 sm:rounded-3xl sm:px-10 sm:py-10">
      <div className="relative z-10">{children}</div>
    </div>
  );
}
