import { requireGuest } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { LoginForm } from "@/features/accounts/components/login-form";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, DEFAULT_LOCALE, type Locale } from "@/lib/i18n-config";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get(LOCALE_COOKIE)?.value || DEFAULT_LOCALE) as Locale;
  const dict = await getDictionary("accounts", locale);

  return {
    title: dict.login.pageTitle,
  };
}

export default async function LoginPage() {
  await requireGuest();
  const cookieStore = await cookies();
  const locale = (cookieStore.get(LOCALE_COOKIE)?.value || DEFAULT_LOCALE) as Locale;
  const dict = await getDictionary("accounts", locale);

  return <LoginForm dict={dict.login} />;
}
