import { z } from 'zod';

// Form Schema for AddReviewCommand
export const addReviewSchema = z.object({
  tmdbId: z.number().int().positive(),
  type: z.number().int(), // MediaType enum
  rating: z.number().min(0).max(10).optional(),
  title: z.string().max(255).optional(),
  content: z.string().min(1, 'O review não pode ser vazio.').max(10000, 'O review não pode ultrapassar 10.000 caracteres.'),
  containsSpoilers: z.boolean().default(false),
  syncGlobalRating: z.boolean().default(true),
});

export type AddReviewFormValues = z.infer<typeof addReviewSchema>;

export const editReviewSchema = z.object({
  rating: z.number().min(0).max(10).optional(),
  title: z.string().max(255).optional(),
  content: z.string().min(1, 'O review não pode ser vazio.').max(10000, 'O review não pode ultrapassar 10.000 caracteres.'),
  containsSpoilers: z.boolean().default(false),
  syncGlobalRating: z.boolean().default(true),
});

export type EditReviewFormValues = z.infer<typeof editReviewSchema>;

// DTOs (readonly for safety)
export type ReviewDto = Readonly<{
  id: string;
  userId: string;
  userName: string;
  tmdbId: number;
  type: number;
  rating?: number;
  title?: string;
  content: string;
  containsSpoilers: boolean;
  createdAt: string;
}>;

export type WatchSessionDto = Readonly<{
  id: string;
  isActive: boolean;
  startedAt: string;
  createdAt: string;
}>;

export type WatchEntrySessionsDto = ReadonlyArray<WatchSessionDto>;
