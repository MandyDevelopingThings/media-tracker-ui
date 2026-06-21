'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProfileReviewDto } from '@/features/journal/types/profile';
import { SpoilerOverlay } from './SpoilerOverlay';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w185';

type ProfileReviewCardProps = {
  review: ProfileReviewDto;
  dict: {
    spoilerBadge: string;
    readMore: string;
    revealSpoiler: string;
  };
};

const TRUNCATE_LENGTH = 500;

export const ProfileReviewCard = ({ review, dict }: ProfileReviewCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const href =
    review.type === 0
      ? `/movie/${review.tmdbId}`
      : `/tv/${review.tmdbId}`;

  const formattedDate = new Date(review.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const shouldTruncate = review.content.length > TRUNCATE_LENGTH && !isExpanded;
  const displayContent = shouldTruncate ? review.content.slice(0, TRUNCATE_LENGTH) + '...' : review.content;

  const contentNode = (
    <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap font-light text-sm">
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
    <article className="group relative w-full bg-card hover:bg-muted/30 transition-all duration-300 border border-border/40 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 rounded-xl overflow-hidden">
      <div className="flex gap-4 p-4 md:p-6">
        <Link href={href} className="shrink-0 self-start">
          <div className="relative flex h-28 w-20 md:h-36 md:w-24 items-center justify-center overflow-hidden rounded-lg border border-border/40 bg-muted shadow-sm transition-transform duration-300 group-hover:scale-105">
            {review.posterPath ? (
              <Image
                src={`${TMDB_IMAGE_BASE}${review.posterPath}`}
                alt={review.mediaTitle}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <Clapperboard className="h-8 w-8 text-muted-foreground/40" />
            )}
          </div>
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex flex-col">
              <Link
                href={href}
                className="font-bold text-foreground hover:text-primary transition-colors duration-200 text-lg"
              >
                {review.mediaTitle}
              </Link>
              <span className="text-xs text-muted-foreground mt-0.5">{formattedDate}</span>
            </div>
            
            <div className="flex shrink-0 items-center gap-2">
              {review.rating !== undefined && review.rating !== null && (
                <div className="flex items-center justify-center bg-muted/50 px-2.5 py-1 rounded-lg border border-border/40">
                  <span className="font-bold text-primary text-base leading-none">{review.rating}</span>
                  <span className="text-muted-foreground text-xs ml-1 leading-none">/10</span>
                </div>
              )}
            </div>
          </div>

          {review.reviewTitle && (
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              {review.reviewTitle}
            </h3>
          )}

          <div className={cn("mt-1", !review.reviewTitle && "mt-0")}>
            {review.containsSpoilers ? (
              <SpoilerOverlay revealText={dict.revealSpoiler}>
                {contentNode}
              </SpoilerOverlay>
            ) : (
              contentNode
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
