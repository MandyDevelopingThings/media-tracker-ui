import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { cookies } from "next/headers";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n-config";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediaTracker",
  description: "Acompanhe filmes, séries e muito mais.",
};

const themeInitScript = `
(function () {
  var key = "${THEME_STORAGE_KEY}";
  var stored = null;
  try { stored = localStorage.getItem(key); } catch (_) {}
  var valid = ["neon-green-dark", "neon-green-light"];
  var resolved = valid.indexOf(stored) !== -1
    ? stored
    : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "neon-green-dark" : "neon-green-light");
  document.documentElement.setAttribute("data-theme", resolved);
  if (resolved.indexOf("-dark") !== -1) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
})();
`.trim();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  return (
    <html
      lang={locale}
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        inter.variable,
        "font-sans",
      )}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

