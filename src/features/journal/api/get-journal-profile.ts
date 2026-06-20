import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';
import type { UserJournalProfileDto } from '@/features/journal/types/profile';

export const getJournalProfile = async (
  userId: string,
): Promise<ApiResponse<UserJournalProfileDto>> =>
  api.query<UserJournalProfileDto>(`/api/journal/profiles/${userId}`, {
    tags: [`journal-profile-${userId}`],
  });
