import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';
import type { LogEpisodeFormValues } from '../types/log-episode.schema';

export const logEpisodeWatchEntry = async (
  payload: LogEpisodeFormValues
): Promise<ApiResponse<void>> => {
  return await api.command<void>(
    '/api/episodewatchentries/log-episode',
    payload
  );
};
