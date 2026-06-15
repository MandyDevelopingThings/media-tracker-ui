import { api } from '@/lib/api-client';
import type { MediaSearchResult, MediaSearchParams } from '../types';

export const searchMedia = async (params: MediaSearchParams) => {
  const qs = new URLSearchParams();
  qs.set('Name', params.q);
  if (params.type) qs.set('MediaType', params.type);
  if (params.year) qs.set('Year', String(params.year));
  if (params.page) qs.set('PageNumber', String(params.page));

  return api.query<MediaSearchResult>(`/api/Media/search?${qs}`, {
    cache: 'no-store',
  });
};
