import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';
import type { AddTvSessionFormValues } from '../types/watch-session.schema';
import type { WatchSessionCreatedDto } from '../types/watch-session-created.dto';

export const addTvSession = (
  payload: AddTvSessionFormValues,
): Promise<ApiResponse<WatchSessionCreatedDto>> =>
  api.command<WatchSessionCreatedDto>('/api/watchentries/tv-sessions', payload);
