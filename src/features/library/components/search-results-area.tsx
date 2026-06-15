'use client';

import { useState } from 'react';
import { SearchLayoutToggle } from './search-layout-toggle';
import { SearchResultsGrid } from './search-results-grid';
import { SearchResultsTable } from './search-results-table';
import type { MediaSearchItem, SearchLayout } from '../types';

type SearchResultsAreaProps = {
  items: readonly MediaSearchItem[];
  initialLayout: SearchLayout;
  totalItems: number;
  dict: {
    movie: string;
    tvShow: string;
    unknown: string;
    noPoster: string;
    grid: string;
    table: string;
    resultsCount: string;
    resultsCountPlural: string;
    title: string;
  };
  query: string;
};

export const SearchResultsArea = ({
  items,
  initialLayout,
  totalItems,
  dict,
  query,
}: SearchResultsAreaProps) => {
  const [layout, setLayout] = useState<SearchLayout>(initialLayout);

  const cardDict = { movie: dict.movie, tvShow: dict.tvShow, unknown: dict.unknown, noPoster: dict.noPoster };
  const count = totalItems === 1 ? dict.resultsCount : dict.resultsCountPlural;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2 min-w-0">
          <h1 className="text-lg font-semibold text-foreground truncate">
            {dict.title}{' '}
            <span className="text-primary">&ldquo;{query}&rdquo;</span>
          </h1>
          <span className="shrink-0 text-sm text-muted-foreground">
            ({totalItems} {count})
          </span>
        </div>
        <SearchLayoutToggle
          currentLayout={layout}
          dict={{ grid: dict.grid, table: dict.table }}
          onLayoutChange={setLayout}
        />
      </div>

      {layout === 'grid' ? (
        <SearchResultsGrid items={items} dict={cardDict} />
      ) : (
        <SearchResultsTable items={items} dict={cardDict} />
      )}
    </div>
  );
};
