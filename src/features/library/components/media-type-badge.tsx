import { cn } from '@/lib/utils';
import type { MediaType } from '../types';

type MediaTypeBadgeProps = {
  type: MediaType;
  dict: { movie: string; tvShow: string; unknown: string };
};

const badgeStyles: Record<MediaType, string> = {
  Movie: 'bg-primary/15 text-primary border-primary/25',
  TVShow: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  Unknown: 'bg-muted text-muted-foreground border-border',
};

export const MediaTypeBadge = ({ type, dict }: MediaTypeBadgeProps) => {
  const label = type === 'Movie' ? dict.movie : type === 'TVShow' ? dict.tvShow : dict.unknown;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5',
        'text-xs font-medium tracking-wide',
        badgeStyles[type],
      )}
    >
      {label}
    </span>
  );
};
