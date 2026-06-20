import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';
import type { AddMovieSessionFormValues } from '../types/watch-session.schema';

export const addMovieSession = (
  payload: AddMovieSessionFormValues,
): Promise<ApiResponse<void>> =>
  api.command<void>('/api/watchentries/movie-sessions', payload);
