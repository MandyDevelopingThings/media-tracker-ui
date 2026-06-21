'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { rateEpisode as rateEpisodeApi } from '../api/rate-episode';

const rateEpisodeSchema = z.object({
  tmdbShowId: z.number(),
  seasonNumber: z.number(),
  episodeNumber: z.number(),
  rating: z.number().int().min(0).max(10),
});

export const rateEpisodeAction = async (prevState: unknown, formData: FormData) => {
  try {
    const rawData = {
      tmdbShowId: Number(formData.get('tmdbShowId')),
      seasonNumber: Number(formData.get('seasonNumber')),
      episodeNumber: Number(formData.get('episodeNumber')),
      rating: Number(formData.get('rating')),
    };

    const validated = rateEpisodeSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: 'Nota inválida. As notas devem ser números inteiros de 1 a 10.' };
    }

    const res = await rateEpisodeApi(validated.data);

    if (res.success) {
      revalidatePath(`/tv/${validated.data.tmdbShowId}`, 'page');
      return { success: true };
    }

    return { success: false, error: res.error?.detail || res.error?.title || 'Erro desconhecido do servidor.' };
  } catch (error) {
    return { success: false, error: 'Ocorreu um erro ao atualizar a nota do episódio.' };
  }
};
