import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WATCH_STATUS } from '@/features/journal/types/watch-entry';
import type { WatchEntryDto, WatchStatus } from '@/features/journal/types/watch-entry';
import { InlineRatingEditor } from './InlineRatingEditor';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';

const STATUS_DOT_COLOR: Record<WatchStatus, string> = {
  [WATCH_STATUS.Watching]:    'bg-blue-400',
  [WATCH_STATUS.Completed]:   'bg-primary',
  [WATCH_STATUS.Dropped]:     'bg-destructive',
  [WATCH_STATUS.PlanToWatch]: 'bg-amber-400',
  [WATCH_STATUS.Unspecified]: 'bg-muted-foreground',
};

type WatchEntryPosterCardProps = {
  item: WatchEntryDto;
  dict: {
    noRating: string;
    episodes: string;
  };
};

export const WatchEntryPosterCard = ({ item, dict }: WatchEntryPosterCardProps) => {
  const href = item.type === 0 ? `/movie/${item.tmdbId}` : `/tv/${item.tmdbId}`;
  const showEpisodes = item.type === 1 && item.watchedEpisodesCount > 0;

  return (
    <div
      className="group relative block overflow-hidden rounded-lg border border-border bg-muted aspect-[2/3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Link href={href} className="absolute inset-0 z-0" aria-label={item.title} />
      {item.posterPath ? (
        <Image
          src={`${TMDB_IMAGE_BASE}${item.posterPath}`}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 16vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <Clapperboard className="h-8 w-8 opacity-30" />
        </div>
      )}

      <span
        className={cn(
          'absolute top-2 left-2 w-2.5 h-2.5 rounded-full ring-2 ring-background shadow-sm',
          STATUS_DOT_COLOR[item.status],
        )}
        aria-hidden
      />

      {item.isFavorite && (
        <span className="absolute top-2 right-2">
          <Heart
            className="h-3.5 w-3.5 fill-primary text-primary drop-shadow-sm"
            aria-label="Favorito"
          />
        </span>
      )}

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1.5 backdrop-blur-sm bg-black/65 z-10">
        <InlineRatingEditor
          tmdbId={item.tmdbId}
          type={item.type}
          currentRating={item.rating}
          userId={item.userId}
        >
          <span className="flex items-center gap-1 text-[10px] font-medium text-white/90 tabular-nums">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400 shrink-0" />
            {item.rating !== null ? item.rating : dict.noRating}
          </span>
        </InlineRatingEditor>
        {showEpisodes && (
          <span className="text-[10px] font-medium text-white/70 tabular-nums">
            {item.watchedEpisodesCount} {dict.episodes}
          </span>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute bottom-8 left-0 right-0 px-2 pb-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="line-clamp-2 text-xs font-semibold text-foreground leading-tight drop-shadow-sm">
          {item.title}
        </p>
      </div>
    </div>
  );
};
