'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Star } from 'lucide-react';
import { rateMediaAction } from '../actions/rate-media';
import { cn } from '@/lib/utils';
import { HarmonicNumberInput } from '@/components/ui/harmonic-number-input';

type InlineRatingEditorProps = {
  tmdbId: number;
  type: number;
  currentRating: number | null;
  userId: string;
  children: React.ReactNode;
  className?: string;
};

export function InlineRatingEditor({
  tmdbId,
  type,
  currentRating,
  userId,
  children,
  className,
}: InlineRatingEditorProps) {
  const [rating, setRating] = useState<number | ''>(currentRating ?? '');
  const [isPending, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRating(currentRating ?? '');
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append('tmdbId', String(tmdbId));
    formData.append('type', String(type));
    formData.append('rating', String(rating === '' ? 0 : rating));
    formData.append('userId', userId);

    startTransition(async () => {
      const res = await rateMediaAction(null, formData);
      if (res.success) {
        closeDialog();
      } else {
        alert(res.error || 'Erro ao salvar nota');
      }
    });
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      closeDialog();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, []);

  return (
    <>
      <button
        onClick={openDialog}
        className={cn('hover:bg-white/20 hover:text-white rounded px-1 -mx-1 transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-ring', className)}
      >
        {children}
      </button>

      <dialog
        ref={dialogRef}
        className="backdrop:bg-black/50 bg-transparent p-0 outline-none fixed inset-0 m-auto"
        onClick={(e) => {
          if (e.target === dialogRef.current) closeDialog();
        }}
      >
        <div className="bg-card text-card-foreground border border-border shadow-lg rounded-xl p-4 w-64 m-auto" onClick={(e) => e.stopPropagation()}>
          <p className="text-sm font-semibold mb-4">Editar Nota</p>

          <div className="flex items-center gap-3 mb-4">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <HarmonicNumberInput
              min={0}
              max={10}
              step={1}
              value={rating === '' ? '' : String(rating)}
              onChange={(e) => setRating(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
              className="flex-1"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={closeDialog}
              disabled={isPending}
              className="h-8 px-3 rounded-md text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors disabled:opacity-50"
            >
              {isPending ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
