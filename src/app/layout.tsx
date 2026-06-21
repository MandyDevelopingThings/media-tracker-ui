import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { THEME_STORAGE_KEY, resolveTheme, THEME_IDS } from "@/lib/theme";
import { cookies } from "next/headers";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n-config";
import { Navbar } from "@/components/navbar/navbar";
import { Toaster } from "@/components/ui/sonner";

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

const validThemes = THEME_IDS.flatMap(id => [`${id}-dark`, `${id}-light`]);

const themeInitScript = `
(function () {
  var key = "${THEME_STORAGE_KEY}";
  var match = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));
  var stored = match ? match[2] : null;
  var valid = ${JSON.stringify(validThemes)};
  if (valid.indexOf(stored) === -1) {
    var resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "neon-green-dark" : "neon-green-light";
    document.documentElement.setAttribute("data-theme", resolved);
    if (resolved.indexOf("-dark") !== -1) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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

  const themeCookie = cookieStore.get(THEME_STORAGE_KEY)?.value;
  const initialTheme = themeCookie && validThemes.includes(themeCookie)
    ? themeCookie
    : null;

  return (
    <html
      lang={locale}
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        inter.variable,
        "font-sans",
        initialTheme && initialTheme.includes("-dark") ? "dark" : ""
      )}
      data-theme={initialTheme || undefined}
      suppressHydrationWarning
    >
      <head>
        {!initialTheme && <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />}
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}

