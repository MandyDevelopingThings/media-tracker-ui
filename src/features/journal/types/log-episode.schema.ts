import { z } from 'zod';

export const logEpisodeSchema = z.object({
  watchSessionId: z.string().uuid('Sessão de exibição inválida.').optional().or(z.literal('')),
  tmdbShowId: z.number().int().positive(),
  seasonNumber: z.number().int().min(0),
  episodeNumber: z.number().int().positive(),
  watchedAt: z.string().optional()
    .refine((val) => {
      if (!val) return true; 
      const date = new Date(val);
      if (isNaN(date.getTime())) return false; 
      
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      return date.getTime() <= today.getTime();
    }, { message: 'A data da exibição não pode estar no futuro.' }),
  rating: z.number().min(1).max(10).optional(),
});

export type LogEpisodeFormValues = z.infer<typeof logEpisodeSchema>;
