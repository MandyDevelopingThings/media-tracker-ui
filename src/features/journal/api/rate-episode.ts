import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';

export type RateEpisodeCommand = {
  tmdbShowId: number;
  seasonNumber: number;
  episodeNumber: number;
  rating: number;
};

export const rateEpisode = async (data: RateEpisodeCommand): Promise<ApiResponse<void>> => {
  const { tmdbShowId, seasonNumber, episodeNumber, rating } = data;
  return api.command<void>(
    `/api/episodewatchentries/${tmdbShowId}/season/${seasonNumber}/episode/${episodeNumber}/rate`,
    { rating },
    { method: 'PATCH' }
  );
};
