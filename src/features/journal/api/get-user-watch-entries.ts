import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/http/api-response';
import type { WatchEntryDto } from '@/features/journal/types/watch-entry';
import type { PagedResult } from '@/types/pagination';

export type GetUserWatchEntriesParams = {
  pageNumber?: number;
  pageSize?: number;
  type?: number;
  orderBy?: string;
  isAscendingOrder?: boolean;
};

export const getUserWatchEntries = async (
  userId: string,
  params: GetUserWatchEntriesParams,
): Promise<ApiResponse<PagedResult<WatchEntryDto>>> => {
  const sp = new URLSearchParams();

  if (params.pageNumber !== undefined) sp.append('PageNumber', params.pageNumber.toString());
  if (params.pageSize !== undefined) sp.append('PageSize', params.pageSize.toString());
  if (params.type !== undefined) sp.append('Type', params.type.toString());
  if (params.orderBy) sp.append('OrderBy', params.orderBy);
  if (params.isAscendingOrder !== undefined)
    sp.append('IsAscendingOrder', params.isAscendingOrder.toString());

  const qs = sp.toString();
  return api.query<PagedResult<WatchEntryDto>>(
    `/api/watchentries/user/${userId}${qs ? `?${qs}` : ''}`,
    { tags: [`user-watch-entries-${userId}`] },
  );
};
