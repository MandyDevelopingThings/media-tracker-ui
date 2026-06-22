'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleFavoriteAction } from '../actions/toggle-favorite';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type ToggleFavoriteButtonProps = {
  tmdbId: number;
  type: number; 
  initialIsFavorite: boolean;
  dict: {
    add: string;
    remove: string;
  };
};

export const ToggleFavoriteButton = ({
  tmdbId,
  type,
  initialIsFavorite,
  dict,
}: ToggleFavoriteButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleToggle = () => {
    
    const previousState = isFavorite;
    setIsFavorite(!previousState);

    startTransition(async () => {
      const result = await toggleFavoriteAction(tmdbId, type);
      
      if (!result.success) {
        
        setIsFavorite(previousState);

        let msg = "Não foi possível atualizar os favoritos.";
        if (typeof result.error === 'string') {
          msg = result.error;
        } else if (result.error && typeof result.error === 'object') {
          const errObj = result.error as { detail?: string; title?: string };
          if (errObj.detail) {
            msg = errObj.detail;
          } else if (errObj.title) {
            msg = errObj.title;
          }
        }
        setErrorMsg(msg);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        aria-label={isFavorite ? dict.remove : dict.add}
        className={cn(
          'flex items-center gap-1.5',
          'px-3 py-1.5 rounded-full',
          'text-xs font-semibold',
          'border transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isFavorite
            ? 'border-primary/40 text-primary/80 bg-primary/5 hover:bg-primary/15 hover:border-primary/70 hover:text-primary'
            : 'border-border/60 text-muted-foreground bg-background hover:bg-muted/50 hover:text-foreground hover:border-border'
        )}
      >
        <Heart
          className={cn('w-3.5 h-3.5', isFavorite && 'fill-current')}
        />
        <span>{isFavorite ? dict.remove : dict.add}</span>
      </button>

      <AlertDialog open={!!errorMsg} onOpenChange={(isOpen) => !isOpen && setErrorMsg(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Oops!</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMsg}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorMsg(null)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
