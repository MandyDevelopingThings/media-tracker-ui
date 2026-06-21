import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';

export const uploadAvatar = async (
  formData: FormData
): Promise<ApiResponse<void>> => {
  return api.command<void>('/api/profiles/avatar', formData, { method: 'POST' });
};

export const uploadCover = async (
  formData: FormData
): Promise<ApiResponse<void>> => {
  return api.command<void>('/api/profiles/cover', formData, { method: 'POST' });
};
