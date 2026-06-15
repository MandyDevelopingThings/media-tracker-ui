'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SlidersHorizontal, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MediaSearchParams } from '../types';

type FilterDict = {
  label: string;
  name: string;
  namePlaceholder: string;
  nameRequired: string;
  type: string;
  typeAll: string;
  typeMovie: string;
  typeTvShow: string;
  year: string;
  yearPlaceholder: string;
  yearMin: string;
  apply: string;
};

type SearchFiltersProps = {
  currentParams: MediaSearchParams;
  dict: FilterDict;
};

const inputClass = cn(
  'w-full rounded-xl border border-primary/20 bg-primary/5',
  'px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
  'transition-all duration-200',
  'hover:border-primary/30 hover:bg-primary/[0.08]',
  'focus:outline-none focus:border-primary/50 focus:bg-primary/[0.08] focus:ring-2 focus:ring-primary/20',
);

export const SearchFilters = ({ currentParams, dict }: SearchFiltersProps) => {
  const router = useRouter();

  const [name, setName] = useState(currentParams.q);
  const [mediaType, setMediaType] = useState<'Movie' | 'TVShow' | ''>( 
    currentParams.type ?? '',
  );
  const [year, setYear] = useState(currentParams.year ? String(currentParams.year) : '');
  const [nameError, setNameError] = useState('');
  const [yearError, setYearError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setYearError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError(dict.nameRequired);
      return;
    }

    const yearNum = year ? Number(year) : undefined;
    if (year && (isNaN(yearNum!) || yearNum! < 1880)) {
      setYearError(dict.yearMin);
      return;
    }

    const params = new URLSearchParams();
    params.set('q', trimmedName);
    if (mediaType) params.set('type', mediaType);
    if (yearNum) params.set('year', String(yearNum));

    router.push(`/search?${params.toString()}`);
  };

  const typeButtonClass = (value: 'Movie' | 'TVShow' | '') =>
    cn(
      'flex-1 rounded-lg border py-1.5 text-xs font-medium transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'active:scale-95',
      mediaType === value
        ? 'border-primary/50 bg-primary/15 text-primary'
        : 'border-border/50 bg-transparent text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary',
    );

  return (
    <aside className="flex flex-col gap-1">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">{dict.label}</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="filter-name"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            {dict.name}
          </label>
          <input
            id="filter-name"
            type="search"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={dict.namePlaceholder}
            autoComplete="off"
            aria-describedby={nameError ? 'filter-name-error' : undefined}
            className={cn(inputClass, nameError && 'border-destructive/50 focus:border-destructive/70 focus:ring-destructive/20')}
          />
          {nameError && (
            <p id="filter-name-error" className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              {nameError}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {dict.type}
          </span>
          <div className="flex gap-1.5">
            {(
              [
                { value: '' as const, label: dict.typeAll },
                { value: 'Movie' as const, label: dict.typeMovie },
                { value: 'TVShow' as const, label: dict.typeTvShow },
              ] satisfies { value: 'Movie' | 'TVShow' | ''; label: string }[]
            ).map(({ value, label }) => (
              <button
                key={value || 'all'}
                type="button"
                id={`filter-type-${value || 'all'}`}
                onClick={() => setMediaType(value)}
                aria-pressed={mediaType === value}
                className={typeButtonClass(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="filter-year"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            {dict.year}
          </label>
          <input
            id="filter-year"
            type="number"
            min={1880}
            max={new Date().getFullYear() + 5}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder={dict.yearPlaceholder}
            aria-describedby={yearError ? 'filter-year-error' : undefined}
            className={cn(inputClass, yearError && 'border-destructive/50 focus:border-destructive/70 focus:ring-destructive/20')}
          />
          {yearError && (
            <p id="filter-year-error" className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              {yearError}
            </p>
          )}
        </div>

        <button
          type="submit"
          id="filter-apply-btn"
          className={cn(
            'w-full rounded-xl border border-primary/30 bg-primary/10 py-2.5',
            'text-sm font-semibold text-primary',
            'transition-all duration-200',
            'hover:border-primary/50 hover:bg-primary/20',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'active:scale-[0.98]',
          )}
        >
          {dict.apply}
        </button>
      </form>
    </aside>
  );
};
