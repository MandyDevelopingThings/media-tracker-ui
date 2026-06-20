'use server';

import { revalidatePath } from 'next/cache';
import { logSeasonSchema } from '../types/log-season.schema';
import { logSeasonWatchEntry } from '../api/log-season';

export type LogSeasonState = {
  isSuccess: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export const logSeasonAction = async (
  prevState: LogSeasonState,
  formData: FormData
): Promise<LogSeasonState> => {
  const watchedAtValue = formData.get('watchedAt');

  const rawData = {
    watchSessionId: formData.get('watchSessionId')
      ? (formData.get('watchSessionId') as string)
      : undefined,
    tmdbShowId: parseInt(formData.get('tmdbShowId') as string, 10),
    seasonNumber: parseInt(formData.get('seasonNumber') as string, 10),
    watchedAt: watchedAtValue
      ? new Date(watchedAtValue as string).toISOString()
      : undefined,
  };

  const validatedFields = logSeasonSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      isSuccess: false,
      message: 'Falha na validação dos campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const result = await logSeasonWatchEntry(validatedFields.data);

  if (!result.success) {
    return {
      isSuccess: false,
      message:
        result.error?.detail ||
        result.error?.title ||
        'Erro ao registrar a temporada.',
    };
  }

  revalidatePath(`/tv/${validatedFields.data.tmdbShowId}`);

  return {
    isSuccess: true,
    message: 'Temporada marcada como assistida!',
  };
};
