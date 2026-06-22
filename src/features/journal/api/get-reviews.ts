import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';
import type { ReviewDto } from '@/features/journal/types/review.schema';
import type { PagedResult } from '@/types/pagination';

type SearchReviewsParams = {
  tmdbId?: number;
  type?: number;
  page?: number;
  pageSize?: number;
  minRating?: number;
  maxRating?: number;
  hasSpoilers?: boolean;
  orderBy?: string; 
  isAscendingOrder?: boolean;
};

export const getReviews = async (
  params: SearchReviewsParams,
): Promise<ApiResponse<PagedResult<ReviewDto>>> => {
  const searchParams = new URLSearchParams();

  if (params.tmdbId !== undefined) searchParams.append('TmdbId', params.tmdbId.toString());
  if (params.type !== undefined) searchParams.append('Type', params.type.toString());
  if (params.page !== undefined) searchParams.append('PageNumber', params.page.toString());
  if (params.pageSize !== undefined) searchParams.append('PageSize', params.pageSize.toString());
  if (params.minRating !== undefined) searchParams.append('MinRating', params.minRating.toString());
  if (params.maxRating !== undefined) searchParams.append('MaxRating', params.maxRating.toString());
  if (params.hasSpoilers !== undefined) searchParams.append('HasSpoilers', params.hasSpoilers.toString());
  if (params.orderBy) searchParams.append('OrderBy', params.orderBy);
  if (params.isAscendingOrder !== undefined) searchParams.append('IsAscendingOrder', params.isAscendingOrder.toString());

  const queryString = searchParams.toString();
  const path = `/api/reviews/search${queryString ? `?${queryString}` : ''}`;

  return await api.query<PagedResult<ReviewDto>>(path, {
    tags: [`reviews-${params.type}-${params.tmdbId}`],
  });
};
