import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';

export const deleteEpisodeEntry = async (entryId: string): Promise<ApiResponse<void>> => {
  return api.command<void>(`/api/episodewatchentries/${entryId}`, undefined, {
    method: 'DELETE',
  });
};
