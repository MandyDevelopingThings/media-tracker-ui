'use client';

import React, { useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { ReviewDto } from '@/features/journal/types/review.schema';
import type { Dictionary } from '@/lib/i18n';
import { ReviewItem } from './ReviewItem';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type ReviewListProps = {
  reviews: readonly ReviewDto[];
  totalPages: number;
  currentPage: number;
  dict: Dictionary<'journal'>['reviews'];
  currentUserId?: string | null;
};

export const ReviewList = ({ reviews, totalPages, currentPage, dict, currentUserId }: ReviewListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const val = e.target.value;
    if (val === 'dateDesc') {
      params.set('orderBy', 'Date');
      params.set('isAscending', 'false');
    } else if (val === 'dateAsc') {
      params.set('orderBy', 'Date');
      params.set('isAscending', 'true');
    } else if (val === 'ratingDesc') {
      params.set('orderBy', 'Rating');
      params.set('isAscending', 'false');
    } else if (val === 'ratingAsc') {
      params.set('orderBy', 'Rating');
      params.set('isAscending', 'true');
    }
    params.delete('page');
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const orderByParam = searchParams.get('orderBy') || 'Date';
  const isAscendingParam = searchParams.get('isAscending') || 'false';

  const currentSort = orderByParam === 'Rating' 
    ? (isAscendingParam === 'true' ? 'ratingAsc' : 'ratingDesc')
    : (isAscendingParam === 'true' ? 'dateAsc' : 'dateDesc');

  if (reviews.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-black/20">
        <p className="text-white/40 text-sm">{dict.emptyState}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col space-y-4 transition-opacity duration-300", isPending && "opacity-50 pointer-events-none")}>
      <div className="flex justify-end mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-white/50">{dict.sort.label}</span>
          <select 
            value={currentSort}
            onChange={handleSortChange}
            className="bg-black/20 border border-white/10 rounded-md px-2 py-1 text-xs text-white/80 focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value="dateDesc">{dict.sort.dateDesc}</option>
            <option value="dateAsc">{dict.sort.dateAsc}</option>
            <option value="ratingDesc">{dict.sort.ratingDesc}</option>
            <option value="ratingAsc">{dict.sort.ratingAsc}</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col space-y-2 relative before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:bg-white/5 ml-2 md:ml-0">
        {reviews.map(review => (
          <ReviewItem key={review.id} review={review} dict={dict} currentUserId={currentUserId} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center pt-8 space-x-4">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center space-x-1 text-sm text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{dict.pagination.prev}</span>
          </button>

          <span className="text-xs text-white/30 bg-white/5 px-4 py-2 rounded-full">
            {currentPage} / {totalPages}
          </span>

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center space-x-1 text-sm text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span>{dict.pagination.next}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
