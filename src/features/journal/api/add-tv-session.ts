import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';
import type { AddTvSessionFormValues } from '../types/watch-session.schema';

export const addTvSession = (
  payload: AddTvSessionFormValues,
): Promise<ApiResponse<void>> =>
  api.command<void>('/api/watchentries/tv-sessions', payload);
