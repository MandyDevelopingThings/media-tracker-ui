'use server';

import { revalidatePath } from 'next/cache';
import { api } from '@/lib/api-client';
import { addReviewSchema } from '@/features/journal/types/review.schema';
import type { ProblemDetails } from '@/types/http/problem-details';

export type SubmitReviewState = {
  isSuccess: boolean;
  message?: string;
  errors?: Record<string, readonly string[] | undefined>;
};

export const submitReviewAction = async (
  prevState: SubmitReviewState,
  formData: FormData
): Promise<SubmitReviewState> => {
  
  const data = {
    tmdbId: parseInt(formData.get('tmdbId') as string, 10),
    type: parseInt(formData.get('type') as string, 10),
    rating: formData.get('rating') ? parseInt(formData.get('rating') as string, 10) : undefined,
    title: (formData.get('title') as string) || undefined,
    content: formData.get('content') as string,
    containsSpoilers: formData.get('containsSpoilers') === 'on',
    syncGlobalRating: formData.get('syncGlobalRating') === 'on',
  };

  const validation = addReviewSchema.safeParse(data);

  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    return {
      isSuccess: false,
      message: 'Erro de validação nos dados fornecidos.',
      errors: fieldErrors as Record<string, readonly string[] | undefined>,
    };
  }

  const response = await api.command('/api/reviews', validation.data, {
    method: 'POST',
  });

  if (!response.success) {
    const problem = response.error as ProblemDetails;
    return {
      isSuccess: false,
      message: problem.detail || problem.title || 'Falha ao postar a avaliação. Tente novamente.',
      errors: problem.errors,
    };
  }

  const mediaPath = validation.data.type === 0 ? `/movie/${validation.data.tmdbId}` : `/tv/${validation.data.tmdbId}`;
  revalidatePath(mediaPath);

  return {
    isSuccess: true,
    message: 'Avaliação publicada com sucesso!',
  };
};
