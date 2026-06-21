export const WATCH_STATUS = {
  Watching: 0,
  Completed: 1,
  Dropped: 2,
  PlanToWatch: 3,
  Unspecified: 4,
} as const;

export type WatchStatus = (typeof WATCH_STATUS)[keyof typeof WATCH_STATUS];

export type WatchEntryDto = Readonly<{
  id: string;
  userId: string;
  tmdbId: number;
  type: number;
  status: WatchStatus;
  rating: number | null;
  statusUpdatedAt: string;
  watchedEpisodesCount: number;
  title: string;
  posterPath: string | null;
  watchedEpisodes: Record<number, number[]> | null;
  isFavorite: boolean;
}>;

export const LIST_LAYOUT_COOKIE = 'LIST_LAYOUT' as const;
export type ListLayout = 'grid' | 'grouped';
