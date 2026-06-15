import Image from 'next/image';
import { Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';

type MediaPosterProps = {
  posterPath: string;
  title: string;
  noPosterLabel: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export const MediaPoster = ({
  posterPath,
  title,
  noPosterLabel,
  className,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw',
  priority = false,
}: MediaPosterProps) => {
  if (!posterPath) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2',
          'bg-muted/50 text-muted-foreground',
          className,
        )}
        aria-label={noPosterLabel}
      >
        <Clapperboard className="h-8 w-8 opacity-40" />
        <span className="text-xs opacity-40 text-center px-2">{noPosterLabel}</span>
      </div>
    );
  }

  return (
    <Image
      src={`${TMDB_IMAGE_BASE}${posterPath}`}
      alt={title}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized
      className={cn('object-cover', className)}
    />
  );
};
