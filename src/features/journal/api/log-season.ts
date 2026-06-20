import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';
import type { LogSeasonFormValues } from '../types/log-season.schema';

export const logSeasonWatchEntry = async (
  payload: LogSeasonFormValues
): Promise<ApiResponse<void>> =>
  api.command<void>('/api/episodewatchentries/log-season', payload);
