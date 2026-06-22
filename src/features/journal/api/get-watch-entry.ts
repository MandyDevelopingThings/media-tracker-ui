import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';
import type { WatchEntryDto } from '../types/watch-entry';

export const getWatchEntry = async (
  tmdbId: number,
  type: number, 
): Promise<ApiResponse<WatchEntryDto>> => {
  return await api.query<WatchEntryDto>(
    `/api/watchentries/${type}/${tmdbId}`,
    {
      tags: [`watch-entry-${type}-${tmdbId}`],
    }
  );
};
