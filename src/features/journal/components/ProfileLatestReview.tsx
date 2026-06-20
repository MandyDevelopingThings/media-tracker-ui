'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LastReviewDto } from '@/features/journal/types/profile';
import { SpoilerOverlay } from './SpoilerOverlay';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w185';

type ProfileLatestReviewProps = {
  lastReview: LastReviewDto;
  dict: {
    title: string;
    spoilerBadge: string;
    readMore: string;
    revealSpoiler: string;
  };
};

const TRUNCATE_LENGTH = 500;

export const ProfileLatestReview = ({ lastReview, dict }: ProfileLatestReviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const href =
    lastReview.type === 0
      ? `/movie/${lastReview.tmdbId}`
      : `/tv/${lastReview.tmdbId}`;

  const formattedDate = new Date(lastReview.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const shouldTruncate = lastReview.content.length > TRUNCATE_LENGTH && !isExpanded;
  const displayContent = shouldTruncate ? lastReview.content.slice(0, TRUNCATE_LENGTH) + '...' : lastReview.content;

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
    <section aria-label={dict.title}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
        {dict.title}
      </h2>
      <div className="group relative w-full bg-card hover:bg-muted/30 transition-all duration-300 border border-border/40 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 rounded-xl overflow-hidden">
        <div className="flex gap-4 p-4 md:p-6">
          <Link href={href} className="shrink-0 self-start">
            <div className="relative flex h-28 w-20 md:h-36 md:w-24 items-center justify-center overflow-hidden rounded-lg border border-border/40 bg-muted shadow-sm transition-transform duration-300 group-hover:scale-105">
              {lastReview.posterPath ? (
                <Image
                  src={`${TMDB_IMAGE_BASE}${lastReview.posterPath}`}
                  alt={lastReview.mediaTitle}
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
                  {lastReview.mediaTitle}
                </Link>
                <span className="text-xs text-muted-foreground mt-0.5">{formattedDate}</span>
              </div>
              
              <div className="flex shrink-0 items-center gap-2">
                {lastReview.rating !== undefined && lastReview.rating !== null && (
                  <div className="flex items-center justify-center bg-muted/50 px-2.5 py-1 rounded-lg border border-border/40">
                    <span className="font-bold text-primary text-base leading-none">{lastReview.rating}</span>
                    <span className="text-muted-foreground text-xs ml-1 leading-none">/10</span>
                  </div>
                )}
              </div>
            </div>

            {lastReview.reviewTitle && (
              <h3 className="text-base font-semibold text-foreground tracking-tight">
                {lastReview.reviewTitle}
              </h3>
            )}

            <div className={cn("mt-1", !lastReview.reviewTitle && "mt-0")}>
              {lastReview.containsSpoilers ? (
                <SpoilerOverlay revealText={dict.revealSpoiler}>
                  {contentNode}
                </SpoilerOverlay>
              ) : (
                contentNode
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
