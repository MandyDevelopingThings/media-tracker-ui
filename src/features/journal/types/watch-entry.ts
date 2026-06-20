export type WatchEntryDto = Readonly<{
  id: string;
  userId: string;
  tmdbId: number;
  type: number;
  status: number;
  rating?: number;
  statusUpdatedAt: string;
  watchedEpisodesCount: number;
  mediaTitle: string;
  mediaPosterPath?: string;
  watchedEpisodes?: Record<number, number[]>;
  isFavorite?: boolean;
}>;
