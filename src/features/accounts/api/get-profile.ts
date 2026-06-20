import { cache } from 'react';
import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';
import type { ProfileDto } from '@/features/accounts/types/profile';

export const getProfile = cache(
  async (username: string): Promise<ApiResponse<ProfileDto>> =>
    api.query<ProfileDto>(`/api/profiles/${username}`, {
      tags: [`profile-${username}`],
    }),
);
