'use client';

import React, { useActionState, useEffect, useRef, useState } from 'react';
import { submitReviewAction, type SubmitReviewState } from '@/features/journal/actions/submit-review.action';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import type { Dictionary } from '@/lib/i18n';

type ReviewFormProps = {
  tmdbId: number;
  type: number;
  dict: Dictionary<'journal'>['reviews']['form'];
};

const initialState: SubmitReviewState = {
  isSuccess: false,
};

export const ReviewForm = ({ tmdbId, type, dict }: ReviewFormProps) => {
  const [state, formAction, isPending] = useActionState(submitReviewAction, initialState);
  const [rating, setRating] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.isSuccess) {
      formRef.current?.reset();
      setRating(null);
    }
  }, [state.isSuccess]);

  return (
    <div className="rounded-xl border border-border/40 bg-card p-5 shadow-sm relative overflow-hidden">
      {/* Subtle neon glow from top */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-sm shadow-primary/50"></div>

      <form ref={formRef} action={formAction} className="flex flex-col space-y-6">
        <input type="hidden" name="tmdbId" value={tmdbId} />
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="rating" value={rating ?? ''} />

        {/* Form header/Status */}
        {state.message && (
          <div className={cn(
            "p-3 rounded-lg text-sm font-medium",
            state.isSuccess ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
          )}>
            {state.message}
          </div>
        )}

        {/* Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {(dict as any).titleLabel || 'TÍTULO'} <span className="font-normal normal-case lowercase ml-1 opacity-70">({(dict as any).optional || 'opcional'})</span>
            </Label>
            <input 
              name="title"
              type="text" 
              placeholder={dict.titlePlaceholder} 
              className="w-full bg-background border border-border/40 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
            />
            {state.errors?.title && <span className="text-red-400 text-xs">{state.errors.title[0]}</span>}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {(dict as any).contentLabel || 'CONTEÚDO'}
          </Label>
          <textarea 
            name="content"
            placeholder={dict.contentPlaceholder} 
            rows={5}
            className="w-full bg-background border border-border/40 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all resize-none"
          ></textarea>
          {state.errors?.content && <span className="text-red-400 text-xs">{state.errors.content[0]}</span>}
        </div>

        {/* Actions Row (Unified Toolbar) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-3 border-t border-border/40 mt-2">
          
          {/* Toolbar Container */}
          <div className="flex flex-col md:flex-row items-center w-full lg:w-auto bg-muted/30 border border-border/40 rounded-xl p-4 md:py-2 md:px-6">
            
            {/* Rating Section */}
            <div className="flex items-center justify-between md:justify-start space-x-4 w-full md:w-auto border-b md:border-b-0 md:border-r border-border/40 pb-4 md:pb-0 md:pr-10 shrink-0">
              <span className="text-sm font-medium text-foreground/80 shrink-0">{dict.ratingLabel}</span>
              <div className="flex items-center space-x-3 w-full md:w-[180px]">
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="1"
                  value={rating ?? 0}
                  onChange={(e) => setRating(parseInt(e.target.value, 10))}
                  className="flex-1 h-2 bg-border/50 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <input 
                  type="number"
                  min="0" 
                  max="10"
                  value={rating ?? ''}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      setRating(null);
                      return;
                    }
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 0;
                    if (val > 10) val = 10;
                    if (val < 0) val = 0;
                    setRating(val);
                  }}
                  onKeyDown={(e) => {
                    if (!/[0-9]/.test(e.key) && 
                        !['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-12 bg-background border border-border/40 rounded-md py-1 text-center text-primary font-bold text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="-"
                />
              </div>
            </div>

            {/* Toggles Section */}
            <div className="flex items-center justify-around md:justify-start space-x-8 w-full md:w-auto pt-4 md:pt-0 md:pl-10">
              <div className="flex items-center space-x-2">
                <Switch id="contains-spoilers" name="containsSpoilers" />
                <Label htmlFor="contains-spoilers" className="text-sm font-medium text-foreground/80 cursor-pointer shrink-0">{dict.spoilersLabel}</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="sync-global" name="syncGlobalRating" defaultChecked />
                <Label htmlFor="sync-global" className="text-sm font-medium text-foreground/80 cursor-pointer shrink-0">{dict.syncGlobalLabel}</Label>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full lg:w-auto px-8 py-3 bg-primary text-primary-foreground hover:brightness-50 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shrink-0 shadow-lg shadow-primary/20"
          >
            {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>{dict.submitButton}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
