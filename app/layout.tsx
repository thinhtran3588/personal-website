import { Geist_Mono, Inter } from "next/font/google";

import { ThemeProvider } from "@/common/components/theme-provider";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const themeScript = `
(function(){
  var key = 'app-theme';
  var raw = null;
  try { raw = localStorage.getItem(key); } catch (e) {}
  var theme = 'system';
  if (raw) {
    try {
      var data = JSON.parse(raw);
      if (data && data.state && data.state.theme) theme = data.state.theme;
    } catch (e) {}
  }
  var resolved = theme === 'light' ? 'light' : theme === 'dark' ? 'dark' : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(resolved);
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
          suppressHydrationWarning
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
