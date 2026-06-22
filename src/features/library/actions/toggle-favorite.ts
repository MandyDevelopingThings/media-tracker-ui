'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { api } from '@/lib/api-client';

const toggleFavoriteSchema = z.object({
  tmdbId: z.number().int().positive(),
  type: z.number().int(), 
});

export const toggleFavoriteAction = async (tmdbId: number, type: number) => {
  const parsed = toggleFavoriteSchema.safeParse({ tmdbId, type });
  if (!parsed.success) {
    return { success: false, error: 'Dados inválidos' };
  }

  const response = await api.command('/api/userlists/favorites/toggle', parsed.data, {
    method: 'POST',
  });

  if (response.success) {
    revalidatePath(`/${type === 0 ? 'movie' : 'tv'}/${tmdbId}`);
  }

  return response;
};
