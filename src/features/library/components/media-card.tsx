import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MediaPoster } from './media-poster';
import { MediaTypeBadge } from './media-type-badge';
import type { MediaSearchItem } from '../types';

type MediaCardProps = {
  item: MediaSearchItem;
  dict: { movie: string; tvShow: string; unknown: string; noPoster: string };
  priority?: boolean;
};

const resolveHref = (item: MediaSearchItem): string => {
  if (item.type === 'Movie' || item.type === 'movie') return `/movie/${item.tmdbId}`;
  if (item.type === 'TVShow' || item.type === 'tv') return `/tv/${item.tmdbId}`;
  return `/movie/${item.tmdbId}`;
};

export const MediaCard = ({ item, dict, priority }: MediaCardProps) => (
  <Link
    href={resolveHref(item)}
    id={`media-card-${item.tmdbId}`}
    className={cn(
      'group flex flex-col rounded-xl overflow-hidden',
      'border border-border/50 bg-card',
      'transition-all duration-200',
      'hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10',
      'hover:-translate-y-0.5',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    )}
  >
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-xl bg-muted/40">
      <MediaPoster
        posterPath={item.posterPath}
        title={item.title}
        noPosterLabel={dict.noPoster}
        className="transition-transform duration-300 group-hover:scale-105"
        priority={priority}
      />
    </div>

    <div className="flex flex-col gap-2 p-3">
      <p
        className="text-sm font-medium leading-tight text-foreground line-clamp-2"
        title={item.title}
      >
        {item.title}
      </p>
      <div className="flex items-center justify-between gap-2">
        <MediaTypeBadge type={item.type} dict={dict} />
        {item.releaseYear && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {item.releaseYear}
          </span>
        )}
      </div>
    </div>
  </Link>
);
