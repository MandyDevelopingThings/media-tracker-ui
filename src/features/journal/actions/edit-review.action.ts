'use server';

import { revalidatePath } from 'next/cache';
import { api } from '@/lib/api-client';
import { editReviewSchema } from '@/features/journal/types/review.schema';
import { requireAuth } from '@/lib/auth';

export type EditReviewState = {
  errors?: {
    rating?: string[];
    title?: string[];
    content?: string[];
    containsSpoilers?: string[];
    syncGlobalRating?: string[];
    server?: string[];
  };
  isSuccess: boolean;
  message?: string;
};

export async function editReviewAction(
  reviewId: string,
  tmdbId: number,
  type: number,
  prevState: EditReviewState,
  formData: FormData
): Promise<EditReviewState> {
  await requireAuth();

  const data = {
    rating: formData.get('rating') ? parseInt(formData.get('rating') as string, 10) : undefined,
    title: (formData.get('title') as string) || undefined,
    content: formData.get('content') as string,
    containsSpoilers: formData.get('containsSpoilers') === 'on',
    syncGlobalRating: formData.get('syncGlobalRating') === 'on',
  };

  const validated = editReviewSchema.safeParse(data);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  const result = await api.command(`/api/reviews/${reviewId}`, validated.data, {
    method: 'PUT',
  });

  if (!result.success) {
    return {
      errors: {
        server: [result.error?.detail || 'Erro ao editar o review. Tente novamente.'],
      },
      isSuccess: false,
      message: result.error?.detail || 'Erro ao editar o review. Tente novamente.',
    };
  }

  revalidatePath(`/${type === 0 ? 'movie' : 'tv'}/${tmdbId}`);

  return {
    errors: {},
    isSuccess: true,
    message: 'Avaliação atualizada com sucesso!',
  };
}
