'use server';

import { getWatchSessions } from '../api/get-watch-sessions';
import type { WatchEntrySessionsDto } from '../types/review.schema';

export const getWatchSessionsAction = async (
  tmdbId: number,
  type: number
): Promise<{ success: boolean; data?: WatchEntrySessionsDto; error?: string }> => {
  try {
    const result = await getWatchSessions(tmdbId, type);
    if (!result.success) {
      return { success: false, error: result.error?.detail || 'Failed to fetch watch sessions' };
    }
    return { success: true, data: result.data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};
