import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { RouteProgress } from "./providers";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AEO Tracker - AI Search Visibility",
  description: "Track your brand visibility across AI search engines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased min-h-full bg-background`}
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {try {const s = localStorage.getItem('theme'); const m = window.matchMedia('(prefers-color-scheme: dark)').matches; const d = document.documentElement; if ((s === 'dark') || (!s && m)) { d.classList.add('dark'); } else { d.classList.remove('dark'); }} catch(e) {}})();`
          }}
        />
        <ThemeProvider>
          <RouteProgress />
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
