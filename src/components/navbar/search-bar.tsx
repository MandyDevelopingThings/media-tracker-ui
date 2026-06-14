'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type SearchBarProps = {
  placeholder: string;
  className?: string;
};

export const SearchBar = ({ placeholder, className }: SearchBarProps) => (
  <form
    action="/search"
    method="GET"
    role="search"
    className={cn('relative w-full', className)}
  >
    <input
      id="navbar-search-input"
      type="search"
      name="q"
      placeholder={placeholder}
      autoComplete="off"
      className={cn(
        'h-10 w-full rounded-xl border border-primary/20 bg-primary/5',
        'pl-4 pr-11 text-sm text-foreground placeholder:text-muted-foreground',
        'transition-all duration-200',
        'hover:border-primary/30 hover:bg-primary/[0.08]',
        'focus:outline-none focus:border-primary/50 focus:bg-primary/[0.08] focus:ring-2 focus:ring-primary/20',
      )}
    />
    <button
      type="submit"
      aria-label="Pesquisar"
      className={cn(
        'absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-lg',
        'text-muted-foreground transition-all duration-200',
        'hover:bg-primary/10 hover:text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'active:scale-95',
      )}
    >
      <Search className="h-4 w-4" />
    </button>
  </form>
);
