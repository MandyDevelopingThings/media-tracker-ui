import { MediaCard } from './media-card';
import type { MediaSearchItem } from '../types';

type SearchResultsGridProps = {
  items: readonly MediaSearchItem[];
  dict: { movie: string; tvShow: string; unknown: string; noPoster: string };
};

export const SearchResultsGrid = ({ items, dict }: SearchResultsGridProps) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
    {items.map((item, index) => (
      <MediaCard
        key={item.tmdbId}
        item={item}
        dict={dict}
        priority={index < 6}
      />
    ))}
  </div>
);
