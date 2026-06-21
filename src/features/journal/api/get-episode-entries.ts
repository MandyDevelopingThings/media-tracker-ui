import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';
import type { EpisodeWatchEntryDto } from '../types/episode-watch-entry';

export const getEpisodeEntries = async (
  tmdbShowId: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<ApiResponse<EpisodeWatchEntryDto[]>> => {
  return api.query<EpisodeWatchEntryDto[]>(
    `/api/episodewatchentries/${tmdbShowId}/season/${seasonNumber}/episode/${episodeNumber}/entries`,
    { cache: 'no-store' }
  );
};
