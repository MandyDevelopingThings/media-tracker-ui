import { MediaTableRow } from './media-table-row';
import type { MediaSearchItem } from '../types';

type SearchResultsTableProps = {
  items: readonly MediaSearchItem[];
  dict: { movie: string; tvShow: string; unknown: string; noPoster: string };
};

export const SearchResultsTable = ({ items, dict }: SearchResultsTableProps) => (
  <div className="flex flex-col gap-2">
    {items.map((item) => (
      <MediaTableRow key={item.tmdbId} item={item} dict={dict} />
    ))}
  </div>
);
