import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';
import type { ProfileReviewDto } from '@/features/journal/types/profile';
import type { PagedResult } from '@/types/pagination';

export type GetProfileReviewsParams = {
  page?: number;
  pageSize?: number;
  minRating?: number;
  maxRating?: number;
  type?: number;
  hasSpoilers?: boolean;
  orderBy?: string;
  isAscendingOrder?: boolean;
};

export const getProfileReviews = async (
  userId: string,
  params: GetProfileReviewsParams,
): Promise<ApiResponse<PagedResult<ProfileReviewDto>>> => {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) searchParams.append('PageNumber', params.page.toString());
  if (params.pageSize !== undefined) searchParams.append('PageSize', params.pageSize.toString());
  if (params.minRating !== undefined) searchParams.append('MinRating', params.minRating.toString());
  if (params.maxRating !== undefined) searchParams.append('MaxRating', params.maxRating.toString());
  if (params.type !== undefined) searchParams.append('Type', params.type.toString());
  if (params.hasSpoilers !== undefined) searchParams.append('HasSpoilers', params.hasSpoilers.toString());
  if (params.orderBy) searchParams.append('OrderBy', params.orderBy);
  if (params.isAscendingOrder !== undefined) searchParams.append('IsAscendingOrder', params.isAscendingOrder.toString());

  const queryString = searchParams.toString();
  const path = `/api/journal/profiles/${userId}/reviews${queryString ? `?${queryString}` : ''}`;

  return await api.query<PagedResult<ProfileReviewDto>>(path, {
    tags: [`profile-reviews-${userId}`],
  });
};
