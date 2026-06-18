import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';
import type { WatchEntrySessionsDto } from '@/features/journal/types/review.schema';

export const getWatchSessions = async (
  tmdbId: number,
  type: number, // 0 = Movie, 1 = TvShow
): Promise<ApiResponse<WatchEntrySessionsDto>> => {
  return await api.query<WatchEntrySessionsDto>(
    `/api/watchentries/sessions/${type}/${tmdbId}`,
    {
      tags: [`watch-sessions-${type}-${tmdbId}`],
    }
  );
};
