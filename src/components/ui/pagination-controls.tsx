'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from './button';

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  dict: {
    prev: string;
    next: string;
  };
};

export const PaginationControls = ({
  currentPage,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  dict,
}: PaginationControlsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 mt-8 bg-card border border-border/40 p-3 rounded-xl shadow-sm">
      <Button
        variant="outline"
        disabled={!hasPreviousPage}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        {dict.prev}
      </Button>
      
      <span className="text-sm font-medium text-muted-foreground">
        {currentPage} / {totalPages}
      </span>
      
      <Button
        variant="outline"
        disabled={!hasNextPage}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        {dict.next}
      </Button>
    </div>
  );
};
