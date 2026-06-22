'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogEpisodeDialog } from '@/features/journal/components/log-episode-dialog';
import { EpisodeEntriesDialog } from '@/features/journal/components/episode-entries/EpisodeEntriesDialog';
import type { EpisodeDto } from '../types';

type EpisodeRowProps = {
  tmdbId: number;
  seasonNumber: number;
  episode: EpisodeDto;
  isAuthenticated: boolean;
  addWatchedLabel: string;
  episodeLabel: string;
  journalDict?: any;
  isWatched?: boolean;
};

export const EpisodeRow = ({
  tmdbId,
  seasonNumber,
  episode,
  isAuthenticated,
  addWatchedLabel,
  episodeLabel,
  journalDict,
  isWatched,
}: EpisodeRowProps) => {
  const [isEntriesDialogOpen, setIsEntriesDialogOpen] = useState(false);

  const handleContainerClick = (e: React.MouseEvent) => {
    
    if (isAuthenticated) {
      setIsEntriesDialogOpen(true);
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleContainerClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleContainerClick(e as any);
          }
        }}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg',
          'border border-transparent',
          'transition-colors duration-150',
          'hover:bg-muted/40 hover:border-border/50',
          'group',
          isAuthenticated && 'cursor-pointer'
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

        {isWatched && (
          <div
            title="Episódio assistido"
            className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10 text-green-500 mr-1"
          >
            <Check className="w-3.5 h-3.5" />
          </div>
        )}

        {isAuthenticated && (
          <div onClick={(e) => e.stopPropagation()}>
            <LogEpisodeDialog
              tmdbShowId={tmdbId}
              seasonNumber={seasonNumber}
              episode={episode}
              addWatchedLabel={addWatchedLabel}
              episodeLabel={episodeLabel}
            />
          </div>
        )}
      </div>

      {isAuthenticated && journalDict?.episodeEntries && (
        <EpisodeEntriesDialog
          isOpen={isEntriesDialogOpen}
          onOpenChange={setIsEntriesDialogOpen}
          tmdbShowId={tmdbId}
          seasonNumber={seasonNumber}
          episodeNumber={episode.episodeNumber}
          episodeTitle={episode.title}
          dict={journalDict.episodeEntries}
        />
      )}
    </>
  );
};
