import { z } from 'zod';

const isoDateOrEmpty = z
  .string()
  .optional()
  .transform((val) => (val === '' ? undefined : val))
  .pipe(z.string().datetime({ offset: true }).optional());

export const addMovieSessionSchema = z
  .object({
    tmdbId: z.number().int().positive(),
    startedAt: isoDateOrEmpty,
    finishedAt: isoDateOrEmpty,
  })
  .superRefine((data, ctx) => {
    if (data.startedAt && data.finishedAt) {
      if (new Date(data.finishedAt) < new Date(data.startedAt)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A data de término não pode ser anterior à data de início.',
          path: ['finishedAt'],
        });
      }
    }
  });

export type AddMovieSessionFormValues = z.infer<typeof addMovieSessionSchema>;

export const addTvSessionSchema = z
  .object({
    tmdbId: z.number().int().positive(),
    startedAt: isoDateOrEmpty,
    finishedAt: isoDateOrEmpty,
    stoppedAtSeasonNumber: z.number().int().min(0).optional(),
    stoppedAtEpisodeNumber: z.number().int().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startedAt && data.finishedAt) {
      if (new Date(data.finishedAt) < new Date(data.startedAt)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A data de término não pode ser anterior à data de início.',
          path: ['finishedAt'],
        });
      }
    }

    if (data.stoppedAtSeasonNumber !== undefined && data.stoppedAtEpisodeNumber === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe também o número do episódio.',
        path: ['stoppedAtEpisodeNumber'],
      });
    }

    if (data.stoppedAtEpisodeNumber !== undefined && data.stoppedAtSeasonNumber === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe também o número da temporada.',
        path: ['stoppedAtSeasonNumber'],
      });
    }
  });

export type AddTvSessionFormValues = z.infer<typeof addTvSessionSchema>;
