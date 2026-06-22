'use client';

import React, { useActionState, useEffect, useState, useTransition } from 'react';
import { Loader2, Tv2, Info } from 'lucide-react';
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
import { logSeasonAction, type LogSeasonState } from '../actions/log-season.action';
import { getWatchSessionsAction } from '../actions/get-watch-sessions.action';
import type { WatchEntrySessionsDto } from '../types/review.schema';

type LogSeasonDialogProps = {
  tmdbShowId: number;
  seasonNumber: number;
  seasonName: string;
  totalEpisodes: number;
  onSuccess: (seasonNumber: number, episodeNumbers: number[]) => void;
  dict: {
    markSeason: string;
    logSeasonHint: string;
  };
};

const initialState: LogSeasonState = {
  isSuccess: false,
};

export const LogSeasonDialog = ({
  tmdbShowId,
  seasonNumber,
  seasonName,
  totalEpisodes,
  onSuccess,
  dict,
}: LogSeasonDialogProps) => {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(logSeasonAction, initialState);

  const [sessions, setSessions] = useState<WatchEntrySessionsDto>([]);
  const [isLoadingSessions, startLoadingSessions] = useTransition();
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!open) return;

    startLoadingSessions(async () => {
      const result = await getWatchSessionsAction(tmdbShowId, 1);
      if (result.success && result.data) {
        setSessions(result.data);
        setSessionsError(null);
      } else {
        setSessionsError(result.error || 'Erro ao carregar sessões.');
      }
    });
  }, [open, tmdbShowId]);

  useEffect(() => {
    if (!state.isSuccess) return;

    const allEpisodeNumbers = Array.from(
      { length: totalEpisodes },
      (_, i) => i + 1
    );
    onSuccess(seasonNumber, allEpisodeNumbers);
    setOpen(false);
  }, [state.isSuccess, seasonNumber, totalEpisodes, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={dict.markSeason}
            title={dict.markSeason}
            className={cn(
              'flex items-center gap-1.5',
              'px-2 py-1 rounded-full',
              'text-[11px] font-semibold',
              'border border-primary/30 text-primary/70',
              'transition-all duration-150',
              'hover:bg-primary/10 hover:border-primary/60 hover:text-primary',
              'focus:outline-none focus:ring-2 focus:ring-primary'
            )}
          />
        }
      >
        <Tv2 className="w-3 h-3" />
        <span>{dict.markSeason}</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Marcar temporada como assistida</DialogTitle>
          <DialogDescription>{seasonName}</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-5 pt-2">
          <input type="hidden" name="tmdbShowId" value={tmdbShowId} />
          <input type="hidden" name="seasonNumber" value={seasonNumber} />

          <div className="flex gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-3.5 py-3 text-xs text-primary/80">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{dict.logSeasonHint}</span>
          </div>

          {state.message && !state.isSuccess && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
              {state.message}
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="watchSessionId-season"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Sessão de Exibição
            </Label>
            {isLoadingSessions ? (
              <div className="h-10 w-full animate-pulse rounded-md border border-border/40 bg-muted/50" />
            ) : sessionsError ? (
              <p className="text-sm text-destructive">{sessionsError}</p>
            ) : sessions.length === 0 ? (
              <select
                name="watchSessionId"
                id="watchSessionId-season"
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-border/40 bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground focus:outline-none"
              >
                <option value="">-- Sessão será criada automaticamente --</option>
              </select>
            ) : (
              <select
                name="watchSessionId"
                id="watchSessionId-season"
                required
                className="w-full rounded-lg border border-border/40 bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {new Date(s.createdAt).toLocaleDateString()}{' '}
                    {s.isActive ? '(Ativa)' : ''}
                  </option>
                ))}
              </select>
            )}
            {state.errors?.watchSessionId && (
              <span className="text-xs text-destructive">
                {state.errors.watchSessionId[0]}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="watchedAt-season"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Data
            </Label>
            <input
              type="date"
              id="watchedAt-season"
              name="watchedAt"
              defaultValue={todayStr}
              max={todayStr}
              className="w-full rounded-lg border border-border/40 bg-background px-3 py-2.5 text-sm text-foreground [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
            />
            {state.errors?.watchedAt && (
              <span className="text-xs text-destructive">
                {state.errors.watchedAt[0]}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-primary px-4 py-2.5 font-bold text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Salvar</span>
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
