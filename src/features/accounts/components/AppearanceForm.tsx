"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocaleAction } from "@/actions/set-locale";
import type { Locale } from "@/lib/i18n-config";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

type AppearanceFormProps = {
  currentLocale: Locale;
  dict: {
    language: string;
    languageDesc: string;
    theme: string;
    themeDesc: string;
    light: string;
    dark: string;
    themeColor: string;
    themeColorDesc: string;
  };
};

export function AppearanceForm({ currentLocale, dict }: AppearanceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { theme, toggleVariant, setTheme } = useTheme();
  const isDark = theme.variant === "dark";

  const handleLanguageChange = (locale: Locale) => {
    if (locale === currentLocale) return;
    startTransition(async () => {
      await setLocaleAction(locale);
      router.refresh();
    });
  };

  const handleVariantChange = (newIsDark: boolean) => {
    if (newIsDark !== isDark) {
      toggleVariant();
    }
  };

  const handleThemeIdChange = (id: any) => {
    if (id !== theme.id) {
      setTheme({ id, variant: theme.variant });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">{dict.themeColor}</h3>
          <p className="text-sm text-muted-foreground">
            {dict.themeColorDesc}
          </p>
        </div>
        <div className="flex gap-4 max-w-sm pl-2 py-2">
          <button
            type="button"
            onClick={() => handleThemeIdChange('neon-green')}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all hover:scale-105",
              theme.id === "neon-green" ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background" : "border-transparent",
              "bg-green-500"
            )}
            title="Neon Green"
          />

          <button
            type="button"
            onClick={() => handleThemeIdChange('synthwave')}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all hover:scale-105",
              theme.id === "synthwave" ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background" : "border-transparent",
              "bg-pink-500"
            )}
            title="Synthwave"
          />
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <div>
          <h3 className="text-lg font-medium">{dict.theme}</h3>
          <p className="text-sm text-muted-foreground">
            {dict.themeDesc}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          <button
            type="button"
            onClick={() => handleVariantChange(false)}
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
              !isDark ? "border-primary" : ""
            )}
          >
            <div className="mb-2 space-y-2 rounded-sm bg-[#ecedef] p-2 w-full h-16 flex flex-col justify-center gap-2">
              <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">
              {dict.light}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleVariantChange(true)}
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
              isDark ? "border-primary" : ""
            )}
          >
            <div className="mb-2 space-y-2 rounded-sm bg-slate-950 p-2 w-full h-16 flex flex-col justify-center gap-2">
              <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">
              {dict.dark}
            </span>
          </button>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <div>
          <h3 className="text-lg font-medium">{dict.language}</h3>
          <p className="text-sm text-muted-foreground">
            {dict.languageDesc}
          </p>
        </div>
        <div className="flex gap-4 max-w-sm">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleLanguageChange("pt-BR")}
            className={cn(
              "flex-1 flex flex-col items-center justify-center rounded-md border-2 p-4 transition-all hover:bg-accent hover:text-accent-foreground",
              currentLocale === "pt-BR" ? "border-primary" : "border-muted opacity-60"
            )}
          >
            Português (BR)
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleLanguageChange("en-US")}
            className={cn(
              "flex-1 flex flex-col items-center justify-center rounded-md border-2 p-4 transition-all hover:bg-accent hover:text-accent-foreground",
              currentLocale === "en-US" ? "border-primary" : "border-muted opacity-60"
            )}
          >
            English (US)
          </button>
        </div>
      </div>
    </div>
  );
}
