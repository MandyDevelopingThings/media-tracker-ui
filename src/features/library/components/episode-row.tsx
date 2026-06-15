import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EpisodeDto } from '../types';

type EpisodeRowProps = {
  episode: EpisodeDto;
  isAuthenticated: boolean;
  addWatchedLabel: string;
  episodeLabel: string;
};

export const EpisodeRow = ({
  episode,
  isAuthenticated,
  addWatchedLabel,
  episodeLabel,
}: EpisodeRowProps) => (
  <div
    className={cn(
      'flex items-center gap-3 px-4 py-3 rounded-lg',
      'border border-transparent',
      'transition-colors duration-150',
      'hover:bg-muted/40 hover:border-border/50',
      'group',
    )}
  >
    <span className={cn(
      'flex-shrink-0 w-8 h-6 flex items-center justify-center',
      'rounded text-[11px] font-bold tabular-nums',
      'bg-primary/10 text-primary',
    )}>
      {episode.episodeNumber}
    </span>

    <span className="flex-1 text-sm text-foreground leading-snug">
      <span className="text-muted-foreground text-xs mr-1">{episodeLabel}</span>
      {episode.title}
    </span>

    {isAuthenticated && (
      <button
        type="button"
        disabled
        aria-label={addWatchedLabel}
        title={addWatchedLabel}
        className={cn(
          'flex-shrink-0 flex items-center justify-center',
          'w-7 h-7 rounded-full',
          'border border-primary/30 text-primary/60',
          'opacity-0 group-hover:opacity-100',
          'transition-all duration-150',
          'hover:bg-primary/10 hover:border-primary/60 hover:text-primary',
          'disabled:cursor-not-allowed',
        )}
      >
        <Plus className="w-4 h-4" />
      </button>
    )}
  </div>
);
