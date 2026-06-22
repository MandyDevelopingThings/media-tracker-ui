'use server';

import { revalidatePath } from 'next/cache';
import { logEpisodeSchema, type LogEpisodeFormValues } from '../types/log-episode.schema';
import { logEpisodeWatchEntry } from '../api/log-episode';

export type LogEpisodeState = {
  isSuccess: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export const logEpisodeAction = async (
  prevState: LogEpisodeState,
  formData: FormData
): Promise<LogEpisodeState> => {
  const ratingValue = formData.get('rating');
  const watchedAtValue = formData.get('watchedAt');

  const rawData = {
    watchSessionId: formData.get('watchSessionId') ? (formData.get('watchSessionId') as string) : undefined,
    tmdbShowId: parseInt(formData.get('tmdbShowId') as string, 10),
    seasonNumber: parseInt(formData.get('seasonNumber') as string, 10),
    episodeNumber: parseInt(formData.get('episodeNumber') as string, 10),
    rating: ratingValue ? parseInt(ratingValue as string, 10) : undefined,
    watchedAt: watchedAtValue ? new Date(watchedAtValue as string).toISOString() : undefined,
  };

  const validatedFields = logEpisodeSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      isSuccess: false,
      message: 'Falha na validação dos campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const result = await logEpisodeWatchEntry(validatedFields.data);

  if (!result.success) {
    return {
      isSuccess: false,
      message: result.error?.detail || result.error?.title || 'Erro ao registrar exibição do episódio.',
    };
  }

  revalidatePath(`/tv/${validatedFields.data.tmdbShowId}`);

  return {
    isSuccess: true,
    message: 'Episódio marcado como assistido!',
  };
};
