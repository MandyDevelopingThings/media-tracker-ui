import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';
import type { UpdateProfilePayload } from '../types';

export const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<ApiResponse<void>> => {
  return api.command<void>('/api/profiles', payload, { method: 'PUT' });
};
