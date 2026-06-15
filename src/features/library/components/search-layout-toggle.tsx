'use client';

import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SEARCH_LAYOUT_COOKIE } from '../types';
import type { SearchLayout } from '../types';

type SearchLayoutToggleProps = {
  currentLayout: SearchLayout;
  dict: { grid: string; table: string };
  onLayoutChange: (layout: SearchLayout) => void;
};

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const SearchLayoutToggle = ({
  currentLayout,
  dict,
  onLayoutChange,
}: SearchLayoutToggleProps) => {
  const handleChange = (layout: SearchLayout) => {
    document.cookie = `${SEARCH_LAYOUT_COOKIE}=${layout}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    onLayoutChange(layout);
  };

  const buttonClass = (layout: SearchLayout) =>
    cn(
      'flex h-8 w-8 items-center justify-center rounded-lg',
      'border transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'active:scale-95',
      currentLayout === layout
        ? 'border-primary/50 bg-primary/15 text-primary'
        : 'border-border/50 bg-transparent text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary',
    );

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Modo de visualização">
      <button
        type="button"
        id="layout-toggle-grid"
        onClick={() => handleChange('grid')}
        className={buttonClass('grid')}
        aria-label={dict.grid}
        aria-pressed={currentLayout === 'grid'}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        type="button"
        id="layout-toggle-table"
        onClick={() => handleChange('table')}
        className={buttonClass('table')}
        aria-label={dict.table}
        aria-pressed={currentLayout === 'table'}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
};
