import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import { isValidLocale, DEFAULT_LOCALE } from '@/lib/i18n-config';
import { getProfile } from '@/features/accounts/api/get-profile';
import { getJournalProfile } from '@/features/journal/api/get-journal-profile';
import { ProfileStatsSection } from '@/features/journal/components/ProfileStatsSection';
import { ProfileFavoritesSection } from '@/features/journal/components/ProfileFavoritesSection';
import { ProfileLatestReview } from '@/features/journal/components/ProfileLatestReview';

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function ProfileOverviewPage({ params }: ProfilePageProps) {
  const { username } = await params;

  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const profileRes = await getProfile(username);
  if (!profileRes.success) {
    notFound();
  }

  const [journalRes, dict] = await Promise.all([
    getJournalProfile(profileRes.data.userId),
    getDictionary('journal', locale),
  ]);

  if (!journalRes.success) {
    notFound();
  }

  const { statistics, favorites, lastReview } = journalRes.data;
  const profileDict = dict.profile;

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <ProfileFavoritesSection
          favorites={favorites}
          dict={profileDict.favorites}
        />
        {lastReview && (
          <ProfileLatestReview
            lastReview={lastReview}
            dict={{
              ...profileDict.lastReview,
              revealSpoiler: dict.reviews.revealSpoiler,
            }}
          />
        )}
      </div>

      <div className="w-full lg:w-72 lg:shrink-0 lg:sticky lg:top-20">
        <ProfileStatsSection
          statistics={statistics}
          dict={profileDict.stats}
        />
      </div>
    </div>
  );
}
