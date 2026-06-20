import Image from 'next/image';
import Link from 'next/link';
import { Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FavoriteMediaDto } from '@/features/journal/types/profile';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';

type ProfileFavoritesSectionProps = {
  favorites: ReadonlyArray<FavoriteMediaDto>;
  dict: {
    title: string;
    noFavorites: string;
  };
};

const FavoritePosterCard = ({ item }: { item: FavoriteMediaDto }) => {
  const href = item.type === 0 ? `/movie/${item.tmdbId}` : `/tv/${item.tmdbId}`;

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-lg border border-border aspect-[2/3] bg-muted"
    >
      {item.posterPath ? (
        <Image
          src={`${TMDB_IMAGE_BASE}${item.posterPath}`}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 10vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
          <Clapperboard className="h-6 w-6 opacity-40" />
        </div>
      )}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent',
          'opacity-0 transition-opacity duration-300 group-hover:opacity-100',
        )}
      />
      <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="line-clamp-2 text-xs font-medium text-foreground leading-tight">
          {item.title}
        </p>
      </div>
    </Link>
  );
};

export const ProfileFavoritesSection = ({
  favorites,
  dict,
}: ProfileFavoritesSectionProps) => (
  <section aria-label={dict.title}>
    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
      {dict.title}
    </h2>
    {favorites.length === 0 ? (
      <p className="text-sm text-muted-foreground py-4">{dict.noFavorites}</p>
    ) : (
      <div className="grid grid-cols-4 gap-3">
        {favorites.map((item) => (
          <FavoritePosterCard key={`${item.tmdbId}-${item.type}`} item={item} />
        ))}
      </div>
    )}
  </section>
);
