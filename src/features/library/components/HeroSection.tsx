import Image from "next/image";
import Link from "next/link";
import { Info } from "lucide-react";
import type { FeaturedMediaDto } from "../types/home-data.dto";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  media: FeaturedMediaDto;
  dict: any;
};

export const HeroSection = ({ media, dict }: HeroSectionProps) => {
  const isMovie = media.type === "Movie";
  const href = isMovie ? `/movie/${media.tmdbId}` : `/tv/${media.tmdbId}`;

  const backgroundUrl = media.backdropPath
    ? `https://image.tmdb.org/t/p/original${media.backdropPath}`
    : media.posterPath
      ? `https://image.tmdb.org/t/p/original${media.posterPath}`
      : null;

  return (
    <section className="relative flex h-[85vh] min-h-[600px] w-full items-end justify-start overflow-hidden bg-background pt-24 pb-12 sm:pb-24">
      {backgroundUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundUrl}
            alt={media.title}
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/20 to-zinc-950" />
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold tracking-wider text-primary-foreground uppercase shadow-md">
              {dict.featuredBadge}
            </span>
            <span className="text-sm font-medium text-white drop-shadow-md">
              {isMovie ? dict.movie : dict.tvShow}
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            {media.title}
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link 
              href={href}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 px-8 rounded-full font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1 group"
              )}
            >
              <Info className="mr-2 h-6 w-6 transition-transform group-hover:scale-110" />
              {dict.viewDetails}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
