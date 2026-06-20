'use server';

import { revalidatePath } from 'next/cache';
import { addMovieSessionSchema } from '../types/watch-session.schema';
import { addMovieSession } from '../api/add-movie-session';

export type AddSessionState = {
  isSuccess: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export const addMovieSessionAction = async (
  prevState: AddSessionState,
  formData: FormData,
): Promise<AddSessionState> => {
  const toIso = (name: string): string | undefined => {
    const val = formData.get(name);
    if (!val || typeof val !== 'string' || val.trim() === '') return undefined;
    return new Date(val).toISOString();
  };

  const rawData = {
    tmdbId: parseInt(formData.get('tmdbId') as string, 10),
    startedAt: toIso('startedAt'),
    finishedAt: toIso('finishedAt'),
  };

  const validated = addMovieSessionSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      isSuccess: false,
      message: 'Falha na validação dos campos.',
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const result = await addMovieSession(validated.data);

  if (!result.success) {
    return {
      isSuccess: false,
      message:
        result.error?.detail ||
        result.error?.title ||
        'Erro ao registrar a sessão.',
    };
  }

  revalidatePath(`/movie/${validated.data.tmdbId}`);

  return {
    isSuccess: true,
    message: 'Sessão registrada com sucesso!',
  };
};
