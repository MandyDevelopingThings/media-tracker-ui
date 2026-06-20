import { Film, Tv, Star, ScrollText } from 'lucide-react';
import { ProfileStatCard } from './ProfileStatCard';
import type { UserStatisticsDto } from '@/features/journal/types/profile';

type ProfileStatsSectionProps = {
  statistics: UserStatisticsDto;
  dict: {
    title: string;
    moviesWatched: string;
    episodesWatched: string;
    averageRating: string;
    reviewsWritten: string;
  };
};

const formatRating = (value: number): string =>
  value === 0 ? '–' : value.toFixed(1);

export const ProfileStatsSection = ({ statistics, dict }: ProfileStatsSectionProps) => (
  <aside aria-label={dict.title} className="flex flex-col gap-3">
    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
      {dict.title}
    </h2>
    <ProfileStatCard
      icon={Film}
      label={dict.moviesWatched}
      value={statistics.moviesWatchedCount.toLocaleString()}
    />
    <ProfileStatCard
      icon={Tv}
      label={dict.episodesWatched}
      value={statistics.tvEpisodesWatchedCount.toLocaleString()}
    />
    <ProfileStatCard
      icon={Star}
      label={dict.averageRating}
      value={formatRating(statistics.averageRating)}
    />
    <ProfileStatCard
      icon={ScrollText}
      label={dict.reviewsWritten}
      value={statistics.reviewsWrittenCount.toLocaleString()}
    />
  </aside>
);
