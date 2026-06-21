'use server';

import { revalidatePath } from 'next/cache';
import { addTvSessionSchema } from '../types/watch-session.schema';
import { addTvSession } from '../api/add-tv-session';

export type AddSessionState = {
  isSuccess: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export const addTvSessionAction = async (
  prevState: AddSessionState,
  formData: FormData,
): Promise<AddSessionState> => {
  const toIso = (name: string): string | undefined => {
    const val = formData.get(name);
    if (!val || typeof val !== 'string' || val.trim() === '') return undefined;
    return new Date(val).toISOString();
  };

  const toInt = (name: string): number | undefined => {
    const val = formData.get(name);
    if (!val || typeof val !== 'string' || val.trim() === '') return undefined;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? undefined : parsed;
  };

  const rawData = {
    tmdbId: parseInt(formData.get('tmdbId') as string, 10),
    startedAt: toIso('startedAt'),
    finishedAt: toIso('finishedAt'),
    stoppedAtSeasonNumber: toInt('stoppedAtSeasonNumber'),
    stoppedAtEpisodeNumber: toInt('stoppedAtEpisodeNumber'),
  };

  if (rawData.finishedAt) {
    rawData.stoppedAtSeasonNumber = undefined;
    rawData.stoppedAtEpisodeNumber = undefined;
  }

  const validated = addTvSessionSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      isSuccess: false,
      message: 'Falha na validação dos campos.',
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const result = await addTvSession(validated.data);

  if (!result.success) {
    if (result.status === 409) {
      return {
        isSuccess: false,
        message: 'Você já possui uma sessão ativa para esta mídia. Encerre-a antes de iniciar uma nova.',
      };
    }
    
    return {
      isSuccess: false,
      message:
        result.error?.detail ||
        result.error?.title ||
        'Erro ao registrar a sessão.',
    };
  }

  revalidatePath(`/tv/${validated.data.tmdbId}`);

  return {
    isSuccess: true,
    message: `Sessão registrada com sucesso! ${result.data.episodesSynced} episódios marcados como assistidos.`,
  };
};
