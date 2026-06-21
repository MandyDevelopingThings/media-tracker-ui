'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { rateMedia as rateMediaApi } from '../api/rate-media';
import { getProfile } from '@/features/accounts/api/get-profile';
import { cookies } from 'next/headers';

const rateMediaSchema = z.object({
  tmdbId: z.number(),
  type: z.number(),
  rating: z.number().int().min(0).max(10),
});

export const rateMediaAction = async (prevState: unknown, formData: FormData) => {
  try {
    const rawData = {
      tmdbId: Number(formData.get('tmdbId')),
      type: Number(formData.get('type')),
      rating: Number(formData.get('rating')),
    };

    const validated = rateMediaSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: 'Nota inválida. As notas devem ser números inteiros de 1 a 10.' };
    }

    const res = await rateMediaApi(validated.data);

    if (res.success) {
      revalidatePath('/profile/[username]/list', 'page');
      return { success: true };
    }

    return { success: false, error: res.error?.detail || res.error?.title || 'Erro desconhecido do servidor.' };
  } catch (error) {
    return { success: false, error: 'Ocorreu um erro ao atualizar a nota.' };
  }
};
