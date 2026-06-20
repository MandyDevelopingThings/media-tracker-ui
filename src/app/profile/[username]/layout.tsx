import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import { isValidLocale, DEFAULT_LOCALE } from '@/lib/i18n-config';
import { isAuthenticated } from '@/lib/auth';
import { getCurrentUser } from '@/features/accounts/api/user-api';
import { getProfile } from '@/features/accounts/api/get-profile';
import { ProfileHero } from '@/features/accounts/components/ProfileHero';
import { ProfileNavTabs } from '@/features/accounts/components/ProfileNavTabs';

type ProfileLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
};

export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
  const { username } = await params;

  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [profileRes, dict, authenticated] = await Promise.all([
    getProfile(username),
    getDictionary('journal', locale),
    isAuthenticated(),
  ]);

  if (!profileRes.success) {
    notFound();
  }

  const profile = profileRes.data;
  const profileDict = dict.profile;

  let isOwner = false;
  if (authenticated) {
    const userRes = await getCurrentUser();
    if (userRes.success) {
      isOwner = userRes.data.id === profile.userId;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileHero
        profile={profile}
        isOwner={isOwner}
        dict={{ editProfile: profileDict.editProfile }}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ProfileNavTabs
          username={profile.username}
          dict={profileDict.tabs}
        />
        <main className="py-6">{children}</main>
      </div>
    </div>
  );
}
