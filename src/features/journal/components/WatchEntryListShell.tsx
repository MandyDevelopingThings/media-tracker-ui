'use client';

import { useState } from 'react';
import { LayoutGrid, List, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LIST_LAYOUT_COOKIE } from '@/features/journal/types/watch-entry';
import type { WatchEntryDto, ListLayout } from '@/features/journal/types/watch-entry';
import { WatchEntryGridView } from './WatchEntryGridView';
import { WatchEntryGroupedView } from './WatchEntryGroupedView';

type ShellDict = {
  title: string;
  totalItems: string;
  search: string;
  switchToGrid: string;
  switchToGrouped: string;
  emptyState: string;
  grid: Parameters<typeof WatchEntryGridView>[0]['dict'];
  grouped: Parameters<typeof WatchEntryGroupedView>[0]['dict'];
};

type WatchEntryListShellProps = {
  items: readonly WatchEntryDto[];
  totalItems: number;
  initialLayout: ListLayout;
  dict: ShellDict;
};

export const WatchEntryListShell = ({
  items,
  totalItems,
  initialLayout,
  dict,
}: WatchEntryListShellProps) => {
  const [layout, setLayout] = useState<ListLayout>(initialLayout);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLayoutChange = (next: ListLayout) => {
    setLayout(next);
    document.cookie = `${LIST_LAYOUT_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const filtered = searchQuery.trim()
    ? items.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : items;

  const totalLabel = dict.totalItems.replace('{count}', String(totalItems));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-baseline gap-2 mr-auto">
          <h2 className="text-xl font-bold tracking-tight">{dict.title}</h2>
          <span className="text-sm text-muted-foreground">{totalLabel}</span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={dict.search}
            className="h-8 w-full sm:w-52 rounded-md border border-border bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
          />
        </div>

        <div
          className="flex items-center gap-1 rounded-md border border-border p-0.5 bg-card"
          role="group"
          aria-label="Selecionar layout"
        >
          <button
            onClick={() => handleLayoutChange('grid')}
            title={dict.switchToGrid}
            aria-pressed={layout === 'grid'}
            className={cn(
              'rounded p-1.5 transition-colors',
              layout === 'grid'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleLayoutChange('grouped')}
            title={dict.switchToGrouped}
            aria-pressed={layout === 'grouped'}
            className={cn(
              'rounded p-1.5 transition-colors',
              layout === 'grouped'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {filtered.length === 0 && searchQuery.trim() && (
        <div className="flex items-center justify-center py-16 border border-dashed border-border/40 rounded-xl">
          <p className="text-sm text-muted-foreground">{dict.emptyState}</p>
        </div>
      )}

      {layout === 'grid' ? (
        <WatchEntryGridView items={filtered} dict={dict.grid} />
      ) : (
        <WatchEntryGroupedView items={filtered} dict={dict.grouped} />
      )}
    </div>
  );
};
