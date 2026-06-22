'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { deleteEpisodeEntry as deleteEpisodeEntryApi } from '../api/delete-episode-entry';

const deleteEpisodeEntrySchema = z.object({
  entryId: z.string().uuid(),
  tmdbShowId: z.number(), 
});

export const deleteEpisodeEntryAction = async (prevState: unknown, formData: FormData) => {
  try {
    const rawData = {
      entryId: formData.get('entryId'),
      tmdbShowId: Number(formData.get('tmdbShowId')),
    };

    const validated = deleteEpisodeEntrySchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: 'ID de registro inválido.' };
    }

    const res = await deleteEpisodeEntryApi(validated.data.entryId);

    if (res.success) {
      revalidatePath(`/tv/${validated.data.tmdbShowId}`, 'page');
      return { success: true };
    }

    return { success: false, error: res.error?.detail || res.error?.title || 'Erro desconhecido do servidor.' };
  } catch (error) {
    return { success: false, error: 'Ocorreu um erro ao excluir o registro do episódio.' };
  }
};
