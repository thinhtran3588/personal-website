type RootLayoutProps = {
  children: React.ReactNode;
};

export function RootLayout({ children }: RootLayoutProps) {
  return <div className="min-h-screen">{children}</div>;
}
