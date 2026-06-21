'use client';

import React, { useActionState, useEffect, useState, useTransition } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { logEpisodeAction, type LogEpisodeState } from '../actions/log-episode.action';
import { getWatchSessionsAction } from '../actions/get-watch-sessions.action';
import { useTvWatchOptional } from '@/features/library/components/tv-watch-context';
import type { WatchEntrySessionsDto } from '../types/review.schema';
import type { EpisodeDto } from '@/features/library/types';

type LogEpisodeDialogProps = {
  tmdbShowId: number;
  seasonNumber: number;
  episode: EpisodeDto;
  addWatchedLabel: string;
  episodeLabel: string;
};

const initialState: LogEpisodeState = {
  isSuccess: false,
};

export const LogEpisodeDialog = ({
  tmdbShowId,
  seasonNumber,
  episode,
  addWatchedLabel,
  episodeLabel,
}: LogEpisodeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(logEpisodeAction, initialState);
  const [, startServerTransition] = useTransition();
  const [rating, setRating] = useState<number | null>(null);


  const tvWatch = useTvWatchOptional();
  // Watch Sessions state
  const [sessions, setSessions] = useState<WatchEntrySessionsDto>([]);
  const [isLoadingSessions, startLoadingSessions] = useTransition();
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  // Date formatted for input type="date" (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (open) {
      startLoadingSessions(async () => {
        const result = await getWatchSessionsAction(tmdbShowId, 1);
        if (result.success && result.data) {
          setSessions(result.data);
          setSessionsError(null);
        } else {
          setSessionsError(result.error || 'Erro ao carregar sessões.');
        }
      });
    } else {
      setRating(null);
    }
  }, [open, tmdbShowId]);

  useEffect(() => {
    if (state.isSuccess) setOpen(false);
  }, [state.isSuccess]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (tvWatch) {
      tvWatch.addOptimisticEpisode(seasonNumber, episode.episodeNumber);
      setOpen(false);
      setRating(null);
    }

    startServerTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={addWatchedLabel}
            title={addWatchedLabel}
            className={cn(
              'flex-shrink-0 flex items-center justify-center',
              'w-7 h-7 rounded-full',
              'border border-primary/30 text-primary/60',
              'transition-all duration-150',
              'hover:bg-primary/10 hover:border-primary/60 hover:text-primary',
              'focus:outline-none focus:ring-2 focus:ring-primary'
            )}
          />
        }
      >
        <Plus className="w-4 h-4" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Marcar como Assistido</DialogTitle>
          <DialogDescription>
            {episodeLabel} {episode.episodeNumber}: {episode.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <input type="hidden" name="tmdbShowId" value={tmdbShowId} />
          <input type="hidden" name="seasonNumber" value={seasonNumber} />
          <input type="hidden" name="episodeNumber" value={episode.episodeNumber} />
          <input type="hidden" name="rating" value={rating ?? ''} />

          {/* Form Status */}
          {state.message && !state.isSuccess && (
            <div className="p-3 rounded-lg text-sm font-medium bg-destructive/10 text-destructive border border-destructive/20">
              {state.message}
            </div>
          )}

          {/* Watch Session Select */}
          <div className="space-y-2">
            <Label htmlFor="watchSessionId" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sessão de Exibição
            </Label>
            {isLoadingSessions ? (
              <div className="h-10 w-full bg-muted/50 animate-pulse rounded-md border border-border/40" />
            ) : sessionsError ? (
              <p className="text-sm text-destructive">{sessionsError}</p>
            ) : sessions.length === 0 ? (
              <select
                name="watchSessionId"
                id="watchSessionId"
                className="w-full bg-muted/50 border border-border/40 rounded-lg px-3 py-2.5 text-sm text-muted-foreground focus:outline-none cursor-not-allowed"
                disabled
              >
                <option value="">-- Sessão será criada automaticamente --</option>
              </select>
            ) : (
              <select
                name="watchSessionId"
                id="watchSessionId"
                className="w-full bg-background border border-border/40 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
                defaultValue={sessions.find(s => s.isActive)?.id || ''}
                required
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    Iniciada em: {new Date(s.startedAt).toLocaleDateString()} {s.isActive ? '(Ativa)' : ''}
                  </option>
                ))}
              </select>
            )}
            {state.errors?.watchSessionId && <span className="text-destructive text-xs">{state.errors.watchSessionId[0]}</span>}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="watchedAt" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Data
            </Label>
            <input
              type="date"
              id="watchedAt"
              name="watchedAt"
              defaultValue={todayStr}
              max={todayStr}
              className="w-full bg-background border border-border/40 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 [color-scheme:dark]"
            />
            {state.errors?.watchedAt && <span className="text-destructive text-xs">{state.errors.watchedAt[0]}</span>}
          </div>

          {/* Rating */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Nota
              </Label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="1"
                value={rating ?? 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setRating(val === 0 ? null : val);
                }}
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
                className="w-14 bg-background border border-border/40 rounded-md py-1.5 text-center text-primary font-bold text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="-"
              />
            </div>
            {state.errors?.rating && <span className="text-destructive text-xs">{state.errors.rating[0]}</span>}
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full px-4 py-2.5 bg-primary text-primary-foreground hover:brightness-110 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Salvar</span>
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
