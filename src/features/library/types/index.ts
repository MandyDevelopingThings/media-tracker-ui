import { z } from 'zod';

export type MediaType = 'Movie' | 'TVShow' | 'Unknown';

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
