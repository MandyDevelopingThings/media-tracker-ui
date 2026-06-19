'use server';

import { revalidatePath } from 'next/cache';
import { api } from '@/lib/api-client';
import { requireAuth } from '@/lib/auth';

export type DeleteReviewState = {
  error?: string;
  isSuccess: boolean;
};

export async function deleteReviewAction(
  reviewId: string,
  tmdbId: number,
  type: number
): Promise<DeleteReviewState> {
  await requireAuth();

  const result = await api.command(`/api/reviews/${reviewId}`, undefined, {
    method: 'DELETE',
  });

  if (!result.success) {
    return {
      error: result.error?.detail || 'Erro ao excluir o review. Tente novamente.',
      isSuccess: false,
    };
  }

  revalidatePath(`/${type === 0 ? 'movie' : 'tv'}/${tmdbId}`);

  return {
    isSuccess: true,
  };
}
