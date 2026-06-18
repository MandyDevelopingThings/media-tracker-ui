'use client';

import React, { useState } from 'react';
import { SpoilerOverlay } from './SpoilerOverlay';
import type { ReviewDto } from '@/features/journal/types/review.schema';
import type { Dictionary } from '@/lib/i18n';
import { UserCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ReviewItemProps = {
  review: ReviewDto;
  dict: Dictionary<'journal'>['reviews'];
};

const TRUNCATE_LENGTH = 1000; // Approx 30 lines

export const ReviewItem = ({ review, dict }: ReviewItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
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
          {review.rating !== undefined && review.rating !== null && (
            <div className="flex items-center justify-center bg-muted/50 px-3 py-1.5 rounded-lg border border-border/40">
              <span className="font-bold text-primary text-lg leading-none">{review.rating}</span>
              <span className="text-muted-foreground text-xs ml-1 leading-none">/10</span>
            </div>
          )}
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
    </div>
  );
};
