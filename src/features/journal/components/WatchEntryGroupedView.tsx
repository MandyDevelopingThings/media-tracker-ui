'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown, Clapperboard, Star, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WATCH_STATUS } from '@/features/journal/types/watch-entry';
import type { WatchEntryDto, WatchStatus } from '@/features/journal/types/watch-entry';
import { InlineRatingEditor } from './InlineRatingEditor';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w92';

type GroupedDict = {
  filters: {
    all: string;
    movie: string;
    tv: string;
    type: string;
    orderBy: string;
    clear: string;
  };
  orderBy: {
    title: string;
    rating: string;
    statusUpdatedAt: string;
    createdAt: string;
    updatedAt: string;
  };
  status: {
    watching: string;
    completed: string;
    dropped: string;
    planToWatch: string;
    unspecified: string;
  };
  emptyState: string;
  table: {
    name: string;
    type: string;
    episodes: string;
    date: string;
  };
  card: {
    noRating: string;
    episodes: string;
  };
};

type WatchEntryGroupedViewProps = {
  items: readonly WatchEntryDto[];
  dict: GroupedDict;
};

const STATUS_CONFIG: Record<
  WatchStatus,
  { label: (d: GroupedDict['status']) => string; borderColor: string; textColor: string }
> = {
  [WATCH_STATUS.Watching]:    { label: (d) => d.watching,    borderColor: 'border-l-blue-400',    textColor: 'text-blue-400' },
  [WATCH_STATUS.Completed]:   { label: (d) => d.completed,   borderColor: 'border-l-primary',     textColor: 'text-primary' },
  [WATCH_STATUS.Dropped]:     { label: (d) => d.dropped,     borderColor: 'border-l-destructive', textColor: 'text-destructive' },
  [WATCH_STATUS.PlanToWatch]: { label: (d) => d.planToWatch, borderColor: 'border-l-amber-400',   textColor: 'text-amber-400' },
  [WATCH_STATUS.Unspecified]: { label: (d) => d.unspecified, borderColor: 'border-l-border',      textColor: 'text-muted-foreground' },
};

const STATUS_ORDER: WatchStatus[] = [
  WATCH_STATUS.Watching,
  WATCH_STATUS.Completed,
  WATCH_STATUS.PlanToWatch,
  WATCH_STATUS.Dropped,
  WATCH_STATUS.Unspecified,
];

const ORDER_OPTIONS = [
  { value: 'StatusUpdatedAt', labelKey: 'statusUpdatedAt' as const },
  { value: 'Title',           labelKey: 'title' as const },
  { value: 'Rating',          labelKey: 'rating' as const },
  { value: 'CreatedAt',       labelKey: 'createdAt' as const },
  { value: 'UpdatedAt',       labelKey: 'updatedAt' as const },
];

const WatchEntryRowItem = ({
  item,
  dict,
}: {
  item: WatchEntryDto;
  dict: GroupedDict['card'];
}) => {
  const router = useRouter();
  const href = item.type === 0 ? `/movie/${item.tmdbId}` : `/tv/${item.tmdbId}`;
  const showEpisodes = item.type === 1 && item.watchedEpisodesCount > 0;
  const date = new Date(item.statusUpdatedAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div
      onClick={() => router.push(href)}
      className="grid grid-cols-[40px_1fr_80px_80px_80px_72px] items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative w-10 h-[54px] shrink-0 overflow-hidden rounded-sm bg-muted">
        {item.posterPath ? (
          <Image
            src={`${TMDB_IMAGE_BASE}${item.posterPath}`}
            alt={item.title}
            fill
            sizes="40px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Clapperboard className="h-4 w-4 opacity-30" />
          </div>
        )}
      </div>

      {/* Title */}
      <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
        {item.title}
      </span>

      {/* Type badge */}
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground border border-border/60 rounded-full px-2 py-0.5 w-fit">
        {item.type === 0 ? 'Movie' : 'TV'}
      </span>

      {/* Rating */}
      <InlineRatingEditor
        tmdbId={item.tmdbId}
        type={item.type}
        currentRating={item.rating}
        userId={item.userId}
        className="w-fit"
      >
        <span className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
          {item.rating !== null ? item.rating : dict.noRating}
        </span>
      </InlineRatingEditor>

      {/* Episodes */}
      <span className="text-xs text-muted-foreground tabular-nums">
        {showEpisodes ? `${item.watchedEpisodesCount} ${dict.episodes}` : '—'}
      </span>

      {/* Date */}
      <span className="text-xs text-muted-foreground text-right">{date}</span>
    </div>
  );
};

export const WatchEntryGroupedView = ({ items, dict }: WatchEntryGroupedViewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeType  = searchParams.get('type') ?? '';
  const activeOrder = searchParams.get('orderBy') ?? 'StatusUpdatedAt';
  const isAscending = searchParams.get('isAscendingOrder') === 'true';

  const [collapsed, setCollapsed] = useState<Partial<Record<WatchStatus, boolean>>>({
    [WATCH_STATUS.PlanToWatch]: true,
    [WATCH_STATUS.Dropped]:     true,
    [WATCH_STATUS.Unspecified]: true,
  });

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(updates)) {
      if (val) params.set(key, val);
      else params.delete(key);
    }
    startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }));
  };

  const handleClear = () => {
    startTransition(() => router.push(pathname, { scroll: false }));
  };

  const typeFiltered = items.filter((item) => {
    if (activeType !== '' && item.type !== Number(activeType)) return false;
    return true;
  });

  const grouped = STATUS_ORDER.reduce<Record<WatchStatus, WatchEntryDto[]>>(
    (acc, status) => {
      acc[status] = typeFiltered.filter((i) => i.status === status);
      return acc;
    },
    {} as Record<WatchStatus, WatchEntryDto[]>,
  );

  const selectClass =
    'bg-black/20 border border-border rounded-md px-2 py-1.5 text-xs text-foreground/80 focus:outline-none focus:ring-1 focus:ring-ring';

  return (
    <div className={cn('flex flex-col gap-3 transition-opacity duration-200', isPending && 'opacity-50')}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
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
                'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                activeType === value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/30',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">{dict.filters.orderBy}</span>
          <select
            value={activeOrder}
            onChange={(e) => updateParams({ orderBy: e.target.value })}
            className={selectClass}
          >
            {ORDER_OPTIONS.map(({ value, labelKey }) => (
              <option key={value} value={value}>{dict.orderBy[labelKey]}</option>
            ))}
          </select>
          <div className="flex gap-1">
            {[
              { value: false, label: '↓' },
              { value: true,  label: '↑' },
            ].map(({ value, label }) => (
              <button
                key={String(value)}
                onClick={() => updateParams({ isAscendingOrder: String(value) })}
                className={cn(
                  'px-2 py-1.5 rounded-md text-xs font-medium border transition-colors',
                  isAscending === value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent text-muted-foreground border-border hover:text-foreground',
                )}
                title={value ? 'Ascendente' : 'Descendente'}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {(activeType || activeOrder !== 'StatusUpdatedAt') && (
          <button
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {dict.filters.clear}
          </button>
        )}
      </div>

      {/* Table column headers */}
      <div className="grid grid-cols-[40px_1fr_80px_80px_80px_72px] gap-3 px-3 pb-1 border-b border-border/30">
        {[
          { label: '' },
          { label: dict.table.name },
          { label: dict.table.type },
          { label: dict.orderBy.rating },
          { label: dict.table.episodes },
          { label: dict.table.date, title: dict.orderBy.statusUpdatedAt },
        ].map(({ label, title }, i) => (
          <div
            key={i}
            title={title}
            className={cn(
              "flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold",
              title && "cursor-help"
            )}
          >
            <span>{label}</span>
            {title && <HelpCircle className="h-3 w-3 opacity-60 shrink-0" />}
          </div>
        ))}
      </div>

      {typeFiltered.length === 0 && (
        <div className="flex items-center justify-center py-16 border border-dashed border-border/40 rounded-xl">
          <p className="text-sm text-muted-foreground">{dict.emptyState}</p>
        </div>
      )}

      {/* Status sections */}
      {STATUS_ORDER.map((status) => {
        const group = grouped[status];
        if (group.length === 0) return null;

        const config  = STATUS_CONFIG[status];
        const isCollapsed = collapsed[status] ?? false;

        return (
          <div key={status} className={cn('border-l-4 rounded-r-xl overflow-hidden bg-card/50', config.borderColor)}>
            <button
              onClick={() =>
                setCollapsed((prev) => ({ ...prev, [status]: !isCollapsed }))
              }
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-accent/30 transition-colors"
              aria-expanded={!isCollapsed}
            >
              <span className={cn('text-xs font-bold uppercase tracking-widest', config.textColor)}>
                {config.label(dict.status)}
                <span className="ml-2 text-muted-foreground font-normal normal-case tracking-normal">
                  — {group.length}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform duration-200',
                  isCollapsed && '-rotate-90',
                )}
              />
            </button>

            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                isCollapsed ? 'max-h-0' : 'max-h-[9999px]',
              )}
            >
              <div className="flex flex-col pb-2">
                {group.map((item) => (
                  <WatchEntryRowItem key={item.id} item={item} dict={dict.card} />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
