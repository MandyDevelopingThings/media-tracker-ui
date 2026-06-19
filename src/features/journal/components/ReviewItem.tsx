'use client';

import React, { useState, useTransition } from 'react';
import { SpoilerOverlay } from './SpoilerOverlay';
import type { ReviewDto } from '@/features/journal/types/review.schema';
import type { Dictionary } from '@/lib/i18n';
import { UserCircle2, Pencil, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EditReviewForm } from './EditReviewForm';
import { deleteReviewAction } from '@/features/journal/actions/delete-review.action';

type ReviewItemProps = {
  review: ReviewDto;
  dict: Dictionary<'journal'>['reviews'];
  currentUserId?: string | null;
};

const TRUNCATE_LENGTH = 1000; // Approx 30 lines

export const ReviewItem = ({ review, dict, currentUserId }: ReviewItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isOwner = currentUserId === review.userId;

  const handleDelete = () => {
    startTransition(async () => {
      await deleteReviewAction(review.id, review.tmdbId, review.type);
      setIsDeleteDialogOpen(false);
    });
  };
  
  const shouldTruncate = review.content.length > TRUNCATE_LENGTH && !isExpanded;
  const displayContent = shouldTruncate ? review.content.slice(0, TRUNCATE_LENGTH) + '...' : review.content;

  const contentNode = (
    <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap font-light text-sm md:text-base">
      {displayContent}
      {shouldTruncate && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="ml-2 text-[#39FF14] hover:underline font-medium"
        >
          {dict.readMore}
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="group relative w-full bg-card hover:bg-muted/30 transition-all duration-300 border border-border/40 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 p-4 md:p-6 mb-4 rounded-xl">
        <div className="flex flex-col space-y-3">
          {/* Header Stream */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-muted border border-border/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                <UserCircle2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-sm">{review.userName}</span>
                <span suppressHydrationWarning className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()} - {new Date(review.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {review.rating !== undefined && review.rating !== null && (
                <div className="flex items-center justify-center bg-muted/50 px-3 py-1.5 rounded-lg border border-border/40">
                  <span className="font-bold text-primary text-lg leading-none">{review.rating}</span>
                  <span className="text-muted-foreground text-xs ml-1 leading-none">/10</span>
                </div>
              )}
            </div>
          </div>

          {/* Subject Line / Title */}
          {review.title && (
            <h3 className="text-lg font-semibold text-foreground tracking-tight mt-1">
              {review.title}
            </h3>
          )}

          {/* Content */}
          <div className={cn("mt-2", !review.title && "mt-1")}>
            {review.containsSpoilers ? (
              <SpoilerOverlay revealText={dict.revealSpoiler}>{contentNode}</SpoilerOverlay>
            ) : (
              contentNode
            )}
          </div>
        </div>

        {isOwner && (
          <div className="flex items-center justify-end space-x-2 mt-2">
            <button 
              onClick={() => setIsEditDialogOpen(true)}
              className="p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              title={(dict as any).actions?.edit || 'Edit'}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              title={(dict as any).actions?.delete || 'Delete'}
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl w-full bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">{(dict as any).actions?.edit || 'Edit Review'}</DialogTitle>
          </DialogHeader>
          <EditReviewForm
            review={review}
            dict={dict.form}
            onSuccess={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>{(dict as any).actions?.deleteConfirmTitle || 'Are you sure?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {(dict as any).actions?.deleteConfirmDesc || 'This action cannot be undone. This will permanently delete your review.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>{(dict as any).actions?.cancel || 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleDelete(); }}
              disabled={isPending}
              className="bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
            >
              {isPending ? '...' : ((dict as any).actions?.confirmDelete || 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
