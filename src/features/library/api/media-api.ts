import { api } from '@/lib/api-client';
import type { MediaSearchResult, MediaSearchParams, MediaDetailsDto, EpisodeDto } from '../types';

export const searchMedia = async (params: MediaSearchParams) => {
  const qs = new URLSearchParams();
  qs.set('Name', params.q);
  if (params.type) qs.set('MediaType', params.type);
  if (params.year) qs.set('Year', String(params.year));
  if (params.page) qs.set('PageNumber', String(params.page));

  return api.query<MediaSearchResult>(`/api/media/search?${qs}`, {
    cache: 'no-store',
  });
};

export const getMovieDetails = async (tmdbId: number) =>
  api.query<MediaDetailsDto>(`/api/media/movie/${tmdbId}`, {
    tags: [`media-movie-${tmdbId}`],
  });

export const getTvDetails = async (tmdbId: number) =>
  api.query<MediaDetailsDto>(`/api/media/tv/${tmdbId}`, {
    tags: [`media-tv-${tmdbId}`],
  });

export const getSeasonDetails = async (tmdbId: number, seasonNumber: number) =>
  api.query<readonly EpisodeDto[]>(`/api/media/tv/${tmdbId}/season/${seasonNumber}`, {
    tags: [`season-${tmdbId}-${seasonNumber}`],
  });
