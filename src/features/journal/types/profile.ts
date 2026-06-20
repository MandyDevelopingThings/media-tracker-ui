export type UserStatisticsDto = Readonly<{
  moviesWatchedCount: number;
  tvEpisodesWatchedCount: number;
  averageRating: number;
  reviewsWrittenCount: number;
}>;

export type FavoriteMediaDto = Readonly<{
  tmdbId: number;
  type: number;
  title: string;
  posterPath: string;
  addedAt: string;
}>;

export type LastReviewDto = Readonly<{
  tmdbId: number;
  type: number;
  reviewTitle: string | null;
  mediaTitle: string;
  posterPath: string | null;
  rating: number;
  content: string;
  containsSpoilers: boolean;
  createdAt: string;
}>;

export type UserJournalProfileDto = Readonly<{
  statistics: UserStatisticsDto;
  favorites: ReadonlyArray<FavoriteMediaDto>;
  lastReview: LastReviewDto | null;
}>;
