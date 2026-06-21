import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isAuthenticated } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n-config";
import { getCurrentUser } from "@/features/accounts/api/user-api";
import { getProfile } from "@/features/accounts/api/get-profile";
import { ProfileForm } from "@/features/accounts/components/ProfileForm";

export default async function ProfileSettingsPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login?callbackUrl=/settings/profile");
  }

  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const dict = await getDictionary("accounts", locale);

  const currentUserRes = await getCurrentUser();
  if (!currentUserRes.success || !currentUserRes.data) {
    redirect("/login?callbackUrl=/settings/profile");
  }

  const profileRes = await getProfile(currentUserRes.data.userName);
  if (!profileRes.success || !profileRes.data) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-sm text-destructive">Falha ao carregar os dados do perfil.</p>
      </div>
    );
  }

  const apiBaseUrl = process.env.API_BASE_URL ?? "";

  return (
    <div className="space-y-6">
      <div className="border-t pt-6">
        <ProfileForm 
          profile={profileRes.data} 
          dict={dict.settings.profile} 
          apiBaseUrl={apiBaseUrl} 
        />
      </div>
    </div>
  );
}
