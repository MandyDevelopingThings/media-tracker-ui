export type MediaType = 'Movie' | 'TVShow';

export type FeaturedMediaDto = Readonly<{
  tmdbId: number;
  type: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  averageRating: number | null;
}>;

export type TopRatedMediaDto = Readonly<{
  tmdbId: number;
  type: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  averageRating: number | null;
}>;

export type HomeDataDto = Readonly<{
  featuredMedia: FeaturedMediaDto | null;
  topRatedMedia: ReadonlyArray<TopRatedMediaDto>;
}>;
