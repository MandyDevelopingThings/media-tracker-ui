import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { TopRatedMediaDto } from "../types/home-data.dto";
import { cn } from "@/lib/utils";

type MediaCardProps = {
  media: TopRatedMediaDto;
  dict: any;
};

export const MediaCard = ({ media, dict }: MediaCardProps) => {
  const isMovie = media.type === "Movie";
  const href = isMovie ? `/movie/${media.tmdbId}` : `/tv/${media.tmdbId}`;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex w-full items-center gap-4 rounded-xl border border-border/50 bg-card p-3 shadow-sm transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/50 hover:shadow-md hover:shadow-primary/20",
      )}
    >
      <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {media.posterPath ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${media.posterPath}`}
            alt={media.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground text-center p-1">
            {dict.noPoster}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center py-2 flex-1 min-w-0">
        <h3 className="truncate text-base font-semibold text-foreground group-hover:text-primary transition-colors">
          {media.title}
        </h3>
        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
            {isMovie ? dict.movie : dict.tvShow}
          </span>
          {media.averageRating !== null && (
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="font-medium text-foreground">{media.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
