'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { Loader2, Plus, Info } from 'lucide-react';
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
import { HarmonicNumberInput } from '@/components/ui/harmonic-number-input';
import {
  addMovieSessionAction,
  type AddSessionState,
} from '../actions/add-movie-session.action';
import { addTvSessionAction } from '../actions/add-tv-session.action';
import { useTvWatchOptional } from '@/features/library/components/tv-watch-context';

type AddSessionDialogProps = {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  mediaTitle: string;
  dict: {
    button: string;
    title: string;
    startedAt: string;
    finishedAt: string;
    stoppedAtSeason: string;
    stoppedAtEpisode: string;
    save: string;
    autoAddHint: string;
    mutuallyExclusiveHint: string;
  };
};

const initialState: AddSessionState = { isSuccess: false };

export const AddSessionDialog = ({
  tmdbId,
  mediaType,
  mediaTitle,
  dict,
}: AddSessionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [, startServerTransition] = useTransition();

  const action = mediaType === 'movie' ? addMovieSessionAction : addTvSessionAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const tvWatch = useTvWatchOptional();

  const [finishedAtValue, setFinishedAtValue] = useState('');
  const [stoppedSeason, setStoppedSeason] = useState('');
  const [stoppedEpisode, setStoppedEpisode] = useState('');

  const hasStoppedAt = stoppedSeason !== '' || stoppedEpisode !== '';

  useEffect(() => {
    if (!state.isSuccess) return;
    setOpen(false);
    setFinishedAtValue('');
  }, [state.isSuccess]);

  const resetForm = () => {
    setFinishedAtValue('');
    setStoppedSeason('');
    setStoppedEpisode('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (tvWatch && mediaType === 'tv') {
      const finishedAt = formData.get('finishedAt') as string | null;
      const stoppedAtSeasonNumber = formData.get('stoppedAtSeasonNumber') as string | null;
      const stoppedAtEpisodeNumber = formData.get('stoppedAtEpisodeNumber') as string | null;

      tvWatch.addOptimisticSession({
        finishedAt: finishedAt || undefined,
        stoppedAtSeasonNumber: stoppedAtSeasonNumber ? parseInt(stoppedAtSeasonNumber, 10) : undefined,
        stoppedAtEpisodeNumber: stoppedAtEpisodeNumber ? parseInt(stoppedAtEpisodeNumber, 10) : undefined,
      });

      setOpen(false);
      resetForm();
    }

    startServerTransition(() => {
      formAction(formData);
    });
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={dict.button}
            title={dict.button}
            className={cn(
              'flex items-center gap-1.5',
              'px-3 py-1.5 rounded-full',
              'text-xs font-semibold',
              'border border-primary/40 text-primary/80 bg-primary/5',
              'transition-all duration-150',
              'hover:bg-primary/15 hover:border-primary/70 hover:text-primary',
              'focus:outline-none focus:ring-2 focus:ring-primary',
            )}
          />
        }
      >
        <Plus className="w-3.5 h-3.5" />
        <span>{dict.button}</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription>{mediaTitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <input type="hidden" name="tmdbId" value={tmdbId} />

          {/* Auto-add hint */}
          <div className="flex gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-3.5 py-3 text-xs text-primary/80">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{dict.autoAddHint}</span>
          </div>

          {/* Form error */}
          {state.message && !state.isSuccess && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
              {state.message}
            </div>
          )}

          {/* startedAt */}
          <div className="space-y-2">
            <Label
              htmlFor={`add-session-startedAt-${tmdbId}`}
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {dict.startedAt}
            </Label>
            <input
              type="date"
              id={`add-session-startedAt-${tmdbId}`}
              name="startedAt"
              max={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border border-border/40 bg-background px-3 py-2.5 text-sm text-foreground [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
            />
            {state.errors?.startedAt && (
              <span className="text-xs text-destructive">
                {state.errors.startedAt[0]}
              </span>
            )}
          </div>

          {/* finishedAt */}
          <div className="space-y-2">
            <Label
              htmlFor={`add-session-finishedAt-${tmdbId}`}
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {dict.finishedAt}
            </Label>
            <input
              type="date"
              id={`add-session-finishedAt-${tmdbId}`}
              name="finishedAt"
              max={new Date().toISOString().split('T')[0]}
              value={finishedAtValue}
              onChange={(e) => setFinishedAtValue(e.target.value)}
              disabled={hasStoppedAt}
              className="w-full rounded-lg border border-border/40 bg-background px-3 py-2.5 text-sm text-foreground [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {state.errors?.finishedAt && (
              <span className="text-xs text-destructive">
                {state.errors.finishedAt[0]}
              </span>
            )}
          </div>

          {/* stoppedAt — TV only */}
          {mediaType === 'tv' && (
            <div className="space-y-4">
              <div className="flex gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-3.5 py-3 text-xs text-primary/80">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{dict.mutuallyExclusiveHint}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label
                    htmlFor={`add-session-stoppedSeason-${tmdbId}`}
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {dict.stoppedAtSeason}
                  </Label>
                  <HarmonicNumberInput
                    id={`add-session-stoppedSeason-${tmdbId}`}
                    name="stoppedAtSeasonNumber"
                    min={0}
                    placeholder="—"
                    value={stoppedSeason}
                    onChange={(e) => setStoppedSeason(e.target.value)}
                    disabled={finishedAtValue !== ''}
                    className={finishedAtValue !== '' ? "opacity-50 cursor-not-allowed" : ""}
                  />
                  {state.errors?.stoppedAtSeasonNumber && (
                    <span className="text-xs text-destructive">
                      {state.errors.stoppedAtSeasonNumber[0]}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`add-session-stoppedEpisode-${tmdbId}`}
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {dict.stoppedAtEpisode}
                  </Label>
                  <HarmonicNumberInput
                    id={`add-session-stoppedEpisode-${tmdbId}`}
                    name="stoppedAtEpisodeNumber"
                    min={1}
                    placeholder="—"
                    value={stoppedEpisode}
                    onChange={(e) => setStoppedEpisode(e.target.value)}
                    disabled={finishedAtValue !== ''}
                    className={finishedAtValue !== '' ? "opacity-50 cursor-not-allowed" : ""}
                  />
                  {state.errors?.stoppedAtEpisodeNumber && (
                    <span className="text-xs text-destructive">
                      {state.errors.stoppedAtEpisodeNumber[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-bold text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{dict.save}</span>
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
