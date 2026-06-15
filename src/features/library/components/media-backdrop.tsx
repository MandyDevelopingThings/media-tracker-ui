import Image from 'next/image';
import { cn } from '@/lib/utils';

const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

type MediaBackdropProps = {
  backdropPath: string;
  title: string;
  className?: string;
};

export const MediaBackdrop = ({ backdropPath, title, className }: MediaBackdropProps) => {
  if (!backdropPath) {
    return (
      <div
        className={cn(
          'w-full h-full bg-gradient-to-br from-muted/60 to-muted/20',
          className,
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <Image
      src={`${TMDB_BACKDROP_BASE}${backdropPath}`}
      alt={title}
      fill
      sizes="100vw"
      priority
      unoptimized
      className={cn('object-cover', className)}
    />
  );
};
