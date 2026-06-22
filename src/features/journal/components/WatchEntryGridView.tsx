'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';
import { WATCH_STATUS } from '@/features/journal/types/watch-entry';
import type { WatchEntryDto } from '@/features/journal/types/watch-entry';
import { WatchEntryPosterCard } from './WatchEntryPosterCard';

type GridDict = {
  filters: {
    title: string;
    status: string;
    type: string;
    orderBy: string;
    all: string;
    watching: string;
    completed: string;
    dropped: string;
    planToWatch: string;
    unspecified: string;
    movie: string;
    tv: string;
    clear: string;
  };
  orderBy: {
    title: string;
    rating: string;
    statusUpdatedAt: string;
    createdAt: string;
    updatedAt: string;
  };
  emptyStateFiltered: string;
  card: {
    noRating: string;
    episodes: string;
  };
};

type WatchEntryGridViewProps = {
  items: readonly WatchEntryDto[];
  dict: GridDict;
};

const STATUS_FILTERS = [
  { key: 'all',        label: (d: GridDict['filters']) => d.all,         value: '' },
  { key: 'watching',   label: (d: GridDict['filters']) => d.watching,    value: String(WATCH_STATUS.Watching) },
  { key: 'completed',  label: (d: GridDict['filters']) => d.completed,   value: String(WATCH_STATUS.Completed) },
  { key: 'planToWatch',label: (d: GridDict['filters']) => d.planToWatch, value: String(WATCH_STATUS.PlanToWatch) },
  { key: 'dropped',    label: (d: GridDict['filters']) => d.dropped,     value: String(WATCH_STATUS.Dropped) },
  { key: 'unspecified',label: (d: GridDict['filters']) => d.unspecified, value: String(WATCH_STATUS.Unspecified) },
] as const;

const ORDER_OPTIONS = [
  { value: 'Title',           label: (d: GridDict['orderBy']) => d.title },
  { value: 'Rating',          label: (d: GridDict['orderBy']) => d.rating },
  { value: 'StatusUpdatedAt', label: (d: GridDict['orderBy']) => d.statusUpdatedAt },
  { value: 'CreatedAt',       label: (d: GridDict['orderBy']) => d.createdAt },
  { value: 'UpdatedAt',       label: (d: GridDict['orderBy']) => d.updatedAt },
] as const;

export const WatchEntryGridView = ({ items, dict }: WatchEntryGridViewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeStatus = searchParams.get('status') ?? '';
  const activeType   = searchParams.get('type') ?? '';
  const activeOrder  = searchParams.get('orderBy') ?? 'StatusUpdatedAt';
  const isAscending  = searchParams.get('isAscendingOrder') === 'true';

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(updates)) {
      if (val) params.set(key, val);
      else params.delete(key);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleClear = () => {
    startTransition(() => router.push(pathname, { scroll: false }));
  };

  const filtered = items.filter((item) => {
    if (activeStatus !== '' && item.status !== Number(activeStatus)) return false;
    if (activeType   !== '' && item.type   !== Number(activeType))   return false;
    return true;
  });

  const selectClass =
    'bg-black/20 border border-border rounded-md px-2 py-1.5 text-xs text-foreground/80 focus:outline-none focus:ring-1 focus:ring-ring w-full mt-1';

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <aside className="w-full lg:w-60 lg:shrink-0 lg:sticky lg:top-20 h-fit">
        <div className="bg-card border border-border/40 rounded-xl p-4 shadow-sm flex flex-col gap-5">
          <h3 className="font-semibold text-sm tracking-tight">{dict.filters.title}</h3>

          <div>
            <p className="text-[11px] text-muted-foreground mb-2">{dict.filters.status}</p>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map(({ key, label, value }) => (
                <button
                  key={key}
                  onClick={() => updateParams({ status: value })}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors',
                    activeStatus === value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/30',
                  )}
                >
                  {label(dict.filters)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] text-muted-foreground mb-2">{dict.filters.type}</p>
            <div className="flex gap-1.5">
              {[
                { value: '',  label: dict.filters.all },
                { value: '0', label: dict.filters.movie },
                { value: '1', label: dict.filters.tv },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => updateParams({ type: value })}
                  className={cn(
                    'flex-1 py-1 rounded-md text-[11px] font-medium border transition-colors',
                    activeType === value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/30',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-muted-foreground block">{dict.filters.orderBy}</label>
            <select
              value={activeOrder}
              onChange={(e) => updateParams({ orderBy: e.target.value })}
              className={selectClass}
            >
              {ORDER_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label(dict.orderBy)}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-1.5">
            {[
              { value: false, label: '↓ Desc' },
              { value: true,  label: '↑ Asc' },
            ].map(({ value, label }) => (
              <button
                key={String(value)}
                onClick={() => updateParams({ isAscendingOrder: String(value) })}
                className={cn(
                  'flex-1 py-1 rounded-md text-[11px] font-medium border transition-colors',
                  isAscending === value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent text-muted-foreground border-border hover:text-foreground',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={handleClear}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors text-center py-1"
          >
            {dict.filters.clear}
          </button>
        </div>
      </aside>

      <div className={cn('flex-1 min-w-0 transition-opacity duration-200', isPending && 'opacity-50')}>
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center py-20 border border-dashed border-border/40 rounded-xl">
            <p className="text-sm text-muted-foreground">{dict.emptyStateFiltered}</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
            {filtered.map((item) => (
              <WatchEntryPosterCard key={item.id} item={item} dict={dict.card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
