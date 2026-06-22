'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { editReviewAction, type EditReviewState } from '@/features/journal/actions/edit-review.action';
import type { ReviewDto } from '@/features/journal/types/review.schema';
import type { Dictionary } from '@/lib/i18n';
import { Loader2, Star } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type EditReviewFormProps = {
  review: ReviewDto;
  dict: Dictionary<'journal'>['reviews']['form'];
  onSuccess?: () => void;
};

const initialState: EditReviewState = {
  isSuccess: false,
};

export const EditReviewForm = ({ review, dict, onSuccess }: EditReviewFormProps) => {
  const action = editReviewAction.bind(null, review.id, review.tmdbId, review.type);

  const [state, formAction, isPending] = useActionState(action, initialState);
  const [rating, setRating] = useState<number | null>(review.rating ?? null);

  useEffect(() => {
    if (state.isSuccess) onSuccess?.();
  }, [state.isSuccess, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="tmdbId" value={review.tmdbId} />
      <input type="hidden" name="type" value={review.type} />
      <input type="hidden" name="rating" value={rating ?? ''} />

      {state.errors?.server && (
        <div className="px-4 py-3 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20">
          {state.errors.server[0]}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {(dict as any).titleLabel || 'TÍTULO'} <span className="font-normal normal-case lowercase ml-1 opacity-70">({(dict as any).optional || 'opcional'})</span>
        </Label>
        <input
          name="title"
          type="text"
          defaultValue={review.title || ''}
          placeholder={dict.titlePlaceholder}
          className="w-full bg-background border border-border/50 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
        />
        {state.errors?.title && <span className="text-red-400 text-xs">{state.errors.title[0]}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {(dict as any).contentLabel || 'CONTEÚDO'} <span className="text-destructive ml-0.5">*</span>
        </Label>
        <textarea
          name="content"
          defaultValue={review.content || ''}
          placeholder={dict.contentPlaceholder}
          rows={6}
          className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all resize-none"
        ></textarea>
        {state.errors?.content && <span className="text-red-400 text-xs">{state.errors.content[0]}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" />
            {dict.ratingLabel}
          </Label>
          <span className="text-primary font-bold text-sm tabular-nums">
            {rating !== null ? `${rating} / 10` : '—'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={rating ?? 0}
            onChange={(e) => setRating(parseInt(e.target.value, 10))}
            className="flex-1 h-2 bg-border/50 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <button
            type="button"
            onClick={() => setRating(null)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            Limpar
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/40 mt-1">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch
              id="edit-containsSpoilers"
              name="containsSpoilers"
              defaultChecked={review.containsSpoilers ?? false}
            />
            <Label htmlFor="edit-containsSpoilers" className="text-sm text-foreground/80 cursor-pointer">
              {dict.spoilersLabel}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="edit-syncGlobalRating"
              name="syncGlobalRating"
            />
            <Label htmlFor="edit-syncGlobalRating" className="text-sm text-foreground/80 cursor-pointer">
              {dict.syncGlobalLabel}
            </Label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-primary text-primary-foreground hover:brightness-50 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0 shadow-lg shadow-primary/20"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{(dict as any).editButton || dict.submitButton}</span>
        </button>
      </div>
    </form>
  );
};
