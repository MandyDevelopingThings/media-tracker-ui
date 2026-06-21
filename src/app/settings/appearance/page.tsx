import { cookies } from "next/headers";
import { getDictionary } from "@/lib/i18n";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n-config";
import { AppearanceForm } from "@/features/accounts/components/AppearanceForm";

export default async function AppearanceSettingsPage() {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const dict = await getDictionary("accounts", locale);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{dict.settings.appearance.title}</h3>
        <p className="text-sm text-muted-foreground">
          {dict.settings.appearance.description}
        </p>
      </div>
      <div className="border-t pt-6">
        <AppearanceForm
          currentLocale={locale}
          dict={{
            language: dict.settings.appearance.language,
            languageDesc: dict.settings.appearance.languageDesc,
            theme: dict.settings.appearance.theme,
            themeDesc: dict.settings.appearance.themeDesc,
            light: dict.settings.appearance.light,
            dark: dict.settings.appearance.dark,
            themeColor: dict.settings.appearance.themeColor,
            themeColorDesc: dict.settings.appearance.themeColorDesc,
          }}
        />
      </div>
    </div>
  );
}
