export type EpisodeWatchEntryDto = Readonly<{
  id: string;
  watchSessionId: string;
  tmdbShowId: number;
  seasonNumber: number;
  episodeNumber: number;
  watchedAt: string;
  rating: number | null;
}>;
