'use client';

import { useTransition, useState, useEffect, useActionState, startTransition } from 'react';
import { Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { deleteEpisodeEntryAction } from '../../actions/delete-episode-entry.action';
import { rateEpisodeAction } from '../../actions/rate-episode.action';
import { HarmonicNumberInput } from '@/components/ui/harmonic-number-input';
import type { EpisodeWatchEntryDto } from '../../types/episode-watch-entry';
import type { EpisodeEntriesDict } from './EpisodeEntriesDialog';

type WatchEntryItemProps = {
  entry: EpisodeWatchEntryDto;
  dict: EpisodeEntriesDict;
  onDeleted: (entryId: string) => void;
};

export const WatchEntryItem = ({ entry, dict, onDeleted }: WatchEntryItemProps) => {
  const [isPendingDelete, startDeleteTransition] = useTransition();

  const [rateState, rateFormAction, isPendingRate] = useActionState(rateEpisodeAction, null);
  
  // Keep the rating completely local since we don't refetch the list
  const initialStr = entry.rating?.toString() ?? '';
  const [localRating, setLocalRating] = useState<string>(initialStr);
  const [savedRating, setSavedRating] = useState<string>(initialStr);

  useEffect(() => {
    if (rateState?.success) {
      toast.success(dict.rateSuccess);
    } else if (rateState?.error) {
      toast.error(rateState.error);
      // If error, revert to the initially saved rating
      setLocalRating(savedRating);
    }
  }, [rateState, dict.rateSuccess, savedRating]);

  const commitRating = (val: string) => {
    if (isPendingRate) return;
    
    let parsed = parseInt(val, 10);
    if (isNaN(parsed)) parsed = 0;
    if (parsed < 0) parsed = 0;
    if (parsed > 10) parsed = 10;
    
    const newRatingStr = parsed === 0 ? '' : parsed.toString();
    
    if (newRatingStr === savedRating) return;

    // Optimistically set it in local state
    setLocalRating(newRatingStr);
    setSavedRating(newRatingStr);

    const formData = new FormData();
    formData.append('tmdbShowId', entry.tmdbShowId.toString());
    formData.append('seasonNumber', entry.seasonNumber.toString());
    formData.append('episodeNumber', entry.episodeNumber.toString());
    formData.append('rating', parsed.toString());
    
    startTransition(() => {
      rateFormAction(formData);
    });
  };

  const handleDelete = () => {
    toast.warning(dict.deleteConfirmTitle, {
      description: dict.deleteConfirmDesc,
      action: {
        label: dict.confirmDelete,
        onClick: () => {
          onDeleted(entry.id);
          
          startDeleteTransition(async () => {
            const formData = new FormData();
            formData.append('entryId', entry.id);
            formData.append('tmdbShowId', entry.tmdbShowId.toString());

            const res = await deleteEpisodeEntryAction(null, formData);
            if (res?.success) {
              toast.success(dict.deleteEntrySuccess);
            } else {
              toast.error(res?.error || 'Erro ao excluir');
            }
          });
        }
      },
      cancel: {
        label: dict.cancel,
        onClick: () => {}
      }
    });
  };

  const formattedDate = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(entry.watchedAt));

  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-muted/50 transition-colors hover:bg-muted gap-4">
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-medium truncate">{formattedDate}</span>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Star className="w-3.5 h-3.5 text-muted-foreground" />
          <div className="w-[4.5rem]">
            <HarmonicNumberInput
              min={0}
              max={10}
              value={localRating}
              onChange={(e) => setLocalRating(e.target.value)}
              onBlur={() => commitRating(localRating)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  commitRating(localRating);
                }
              }}
              disabled={isPendingRate}
              className="h-8"
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive h-8 w-8"
          onClick={handleDelete}
          disabled={isPendingDelete}
          aria-label={dict.confirmDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
