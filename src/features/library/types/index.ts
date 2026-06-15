import { z } from 'zod';

export type MediaType = 'Movie' | 'TVShow' | 'Unknown' | 'movie' | 'tv';

export type MediaSearchItem = Readonly<{
  tmdbId: number;
  title: string;
  posterPath: string;
  releaseYear: number | null;
  type: MediaType;
}>;

export type MediaSearchResult = Readonly<{
  items: readonly MediaSearchItem[];
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageNumber: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}>;

export const MediaSearchParamsSchema = z.object({
  q: z.string().min(1),
  type: z.enum(['Movie', 'TVShow']).optional(),
  year: z.coerce.number().int().min(1880).optional(),
  page: z.coerce.number().int().min(1).optional(),
});

export type MediaSearchParams = z.infer<typeof MediaSearchParamsSchema>;

export type SearchLayout = 'grid' | 'table';
export const SEARCH_LAYOUT_COOKIE = 'SEARCH_LAYOUT' as const;
export const DEFAULT_SEARCH_LAYOUT: SearchLayout = 'grid';

export type CastMemberDto = Readonly<{
  id: number;
  name: string;
  character: string;
  profilePath: string;
}>;

export type EpisodeDto = Readonly<{
  episodeNumber: number;
  title: string;
}>;

export type SeasonDto = Readonly<{
  seasonNumber: number;
  name: string;
  episodes: readonly EpisodeDto[];
}>;

export type MediaDetailsDto = Readonly<{
  tmdbId: number;
  title: string;
  posterPath: string;
  backdropPath: string;
  type: 'movie' | 'tv';
  overview: string;
  releaseDate: string;
  status: string;
  runtime: number;
  genres: readonly string[];
  numberOfSeasons: number | null;
  numberOfEpisodes: number | null;
  seasons: readonly SeasonDto[] | null;
  topCast: readonly CastMemberDto[];
}>;
