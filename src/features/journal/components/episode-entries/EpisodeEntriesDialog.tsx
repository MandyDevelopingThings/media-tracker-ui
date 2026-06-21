'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getEpisodeEntriesAction } from '../../actions/get-episode-entries.action';
import { WatchEntryList } from './WatchEntryList';
import type { EpisodeWatchEntryDto } from '../../types/episode-watch-entry';

export type EpisodeEntriesDict = {
  title: string;
  entriesLabel: string;
  deleteEntrySuccess: string;
  rateSuccess: string;
  noEntries: string;
  deleteConfirmTitle: string;
  deleteConfirmDesc: string;
  confirmDelete: string;
  cancel: string;
};

type EpisodeEntriesDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tmdbShowId: number;
  seasonNumber: number;
  episodeNumber: number;
  episodeTitle: string;
  dict: EpisodeEntriesDict;
};

export const EpisodeEntriesDialog = ({
  isOpen,
  onOpenChange,
  tmdbShowId,
  seasonNumber,
  episodeNumber,
  episodeTitle,
  dict,
}: EpisodeEntriesDialogProps) => {
  const [entries, setEntries] = useState<EpisodeWatchEntryDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      let isMounted = true;
      setIsLoading(true);
      setError(null);

      getEpisodeEntriesAction(tmdbShowId, seasonNumber, episodeNumber)
        .then((res) => {
          if (!isMounted) return;
          if (res.success) {
            setEntries(res.data);
          } else {
            setError(res.error?.detail || res.error?.title || 'Erro ao carregar o histórico');
          }
        })
        .catch(() => {
          if (!isMounted) return;
          setError('Ocorreu um erro ao buscar os registros.');
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [isOpen, tmdbShowId, seasonNumber, episodeNumber]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background text-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-xl flex flex-col space-y-2">
            <span>{dict.title}</span>
            <span className="text-sm text-muted-foreground font-normal">{episodeTitle}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-6 mt-4">
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium">{dict.entriesLabel}</span>
            {isLoading ? (
              <div className="flex flex-col space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded-md"></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-sm text-destructive p-4 bg-destructive/10 rounded-md border border-destructive/20 text-center">
                {error}
              </div>
            ) : (
              <WatchEntryList initialEntries={entries} dict={dict} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
