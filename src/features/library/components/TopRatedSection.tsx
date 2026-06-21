import type { TopRatedMediaDto } from "../types/home-data.dto";
import { MediaCard } from "./MediaCard";
import { Trophy } from "lucide-react";

type TopRatedSectionProps = {
  items: ReadonlyArray<TopRatedMediaDto>;
  dict: any;
};

export const TopRatedSection = ({ items, dict }: TopRatedSectionProps) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center justify-center gap-3 text-center">
        <Trophy className="h-6 w-6 text-amber-500" />
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {dict.topRated}
        </h2>
      </div>
      
      <div className="flex flex-col gap-4">
        {items.map((media) => (
          <MediaCard key={media.tmdbId} media={media} dict={dict} />
        ))}
      </div>
    </section>
  );
};
