import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SettingsSidebar } from "@/features/accounts/components/SettingsSidebar";
import { isAuthenticated } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n-config";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const authenticated = await isAuthenticated();
  const dict = await getDictionary("accounts", locale);

  const sidebarNavItems = [];

  if (authenticated) {
    sidebarNavItems.push({
      title: dict.settings.profile.title,
      href: "/settings/profile",
    });
  }

  sidebarNavItems.push({
    title: dict.settings.appearance.title,
    href: "/settings/appearance",
  });

  return (
    <div className="container relative flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 mt-8 mb-16">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
        <div className="h-full py-6 pl-4 pr-6 lg:py-8">
          <h2 className="mb-4 text-2xl font-bold tracking-tight">
            {dict.settings.title}
          </h2>
          <SettingsSidebar items={sidebarNavItems} />
        </div>
      </aside>

      <main className="flex w-full flex-col overflow-hidden py-6 lg:py-8">
        {/* Mobile Nav */}
        <div className="mb-6 md:hidden">
          <h2 className="mb-4 text-2xl font-bold tracking-tight">
            {dict.settings.title}
          </h2>
          <SettingsSidebar
            items={sidebarNavItems}
            className="flex flex-row space-x-2 space-y-0 overflow-x-auto pb-2"
          />
        </div>

        {children}
      </main>
    </div>
  );
}
