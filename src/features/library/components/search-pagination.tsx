'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type SearchPaginationProps = {
  currentPage: number;
  totalPages: number;
  dict: { previous: string; next: string; pageOf: string };
};

export const SearchPagination = ({
  currentPage,
  totalPages,
  dict,
}: SearchPaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/search?${params.toString()}`);
  };

  const buttonBase = cn(
    'flex h-9 items-center justify-center rounded-lg px-3',
    'border border-border/50 text-sm font-medium',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'active:scale-95',
  );

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | 'ellipsis')[] = [1];

    if (currentPage > 3) pages.push('ellipsis');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);

    return pages;
  };

  return (
    <nav
      className="flex items-center justify-center gap-1.5"
      aria-label="Paginação"
    >
      <button
        type="button"
        id="pagination-prev"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={dict.previous}
        className={cn(
          buttonBase,
          'disabled:pointer-events-none disabled:opacity-40',
          'enabled:hover:border-primary/30 enabled:hover:bg-primary/5 enabled:hover:text-primary',
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPageNumbers().map((page, idx) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            id={`pagination-page-${page}`}
            onClick={() => goToPage(page)}
            aria-label={`Página ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={cn(
              buttonBase,
              'w-9',
              page === currentPage
                ? 'border-primary/50 bg-primary/15 text-primary pointer-events-none'
                : 'hover:border-primary/30 hover:bg-primary/5 hover:text-primary text-muted-foreground',
            )}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        id="pagination-next"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={dict.next}
        className={cn(
          buttonBase,
          'disabled:pointer-events-none disabled:opacity-40',
          'enabled:hover:border-primary/30 enabled:hover:bg-primary/5 enabled:hover:text-primary',
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};
