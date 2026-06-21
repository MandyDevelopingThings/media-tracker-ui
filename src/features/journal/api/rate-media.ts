import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';

export type RateMediaCommand = {
  tmdbId: number;
  type: number;
  rating: number;
};

export const rateMedia = async (data: RateMediaCommand): Promise<ApiResponse<void>> => {
  return api.command<void>('/api/watchentries/rate', data, {
    method: 'PATCH',
  });
};
