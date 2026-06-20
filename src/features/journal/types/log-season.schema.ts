import { z } from 'zod';

export const logSeasonSchema = z.object({
  watchSessionId: z.string().uuid('Sessão de exibição inválida.').optional().or(z.literal('')),
  tmdbShowId: z.number().int().positive(),
  seasonNumber: z.number().int().min(0),
  watchedAt: z.string().optional()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;

      const today = new Date();
      today.setHours(23, 59, 59, 999);

      return date.getTime() <= today.getTime();
    }, { message: 'A data da exibição não pode estar no futuro.' }),
});

export type LogSeasonFormValues = z.infer<typeof logSeasonSchema>;
