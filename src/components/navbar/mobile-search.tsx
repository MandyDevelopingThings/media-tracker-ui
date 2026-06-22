'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type MobileSearchProps = {
  placeholder: string;
  searchLabel: string;
};

export const MobileSearch = ({ placeholder, searchLabel }: MobileSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = inputRef.current?.value.trim() ?? '';
    if (!q) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const iconButtonClass = cn(
    'flex h-9 w-9 items-center justify-center rounded-lg',
    'border border-primary/20 bg-primary/5',
    'text-primary/70 transition-all duration-200',
    'hover:border-primary/40 hover:bg-primary/10 hover:text-primary',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'active:scale-95',
  );

  if (isOpen) {
    return (
      <form
        onSubmit={handleSubmit}
        role="search"
        className="fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur-md shadow-lg"
      >
        <input
          ref={inputRef}
          id="navbar-mobile-search-input"
          type="search"
          name="q"
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            'h-10 flex-1 rounded-xl border border-primary/20 bg-primary/5',
            'px-4 text-sm text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20',
          )}
        />
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Fechar busca"
          className={iconButtonClass}
        >
          <X className="h-4 w-4" />
        </button>
      </form>
    );
  }

  return (
    <button
      id="navbar-mobile-search-btn"
      type="button"
      onClick={() => setIsOpen(true)}
      aria-label={searchLabel}
      className={iconButtonClass}
    >
      <Search className="h-4 w-4" />
    </button>
  );
};
