import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MediaPoster } from './media-poster';
import { MediaTypeBadge } from './media-type-badge';
import type { MediaSearchItem } from '../types';

type MediaTableRowProps = {
  item: MediaSearchItem;
  dict: { movie: string; tvShow: string; unknown: string; noPoster: string };
};

export const MediaTableRow = ({ item, dict }: MediaTableRowProps) => (
  <Link
    href={`/media/${item.tmdbId}`}
    id={`media-row-${item.tmdbId}`}
    className={cn(
      'group flex items-center gap-5 p-4 rounded-xl',
      'border border-border/40 bg-card/60',
      'transition-all duration-200',
      'hover:border-primary/40 hover:bg-card hover:shadow-md hover:shadow-primary/5',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    )}
  >
    <div className="relative shrink-0 w-16 h-24 rounded-lg overflow-hidden bg-muted/40">
      <MediaPoster
        posterPath={item.posterPath}
        title={item.title}
        noPosterLabel={dict.noPoster}
        sizes="64px"
        className="transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <div className="flex flex-1 items-center gap-4 min-w-0">
      <p
        className="flex-1 text-sm font-medium text-foreground truncate"
        title={item.title}
      >
        {item.title}
      </p>
      <div className="shrink-0">
        <MediaTypeBadge type={item.type} dict={dict} />
      </div>
      {item.releaseYear ? (
        <span className="shrink-0 w-12 text-sm text-muted-foreground tabular-nums text-right">
          {item.releaseYear}
        </span>
      ) : (
        <span className="shrink-0 w-12" />
      )}
    </div>
  </Link>
);
