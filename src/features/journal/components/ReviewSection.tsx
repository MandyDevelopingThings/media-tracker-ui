import React, { Suspense } from 'react';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n-config';
import { getReviews } from '@/features/journal/api/get-reviews';
import { getCurrentUser } from '@/features/accounts/api/user-api';
import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';

type ReviewSectionProps = {
  tmdbId: number;
  type: number; // 0 for Movie, 1 for TvShow
  searchParams?: {
    page?: string;
    minRating?: string;
    maxRating?: string;
    hasSpoilers?: string;
    orderBy?: string;
    isAscending?: string;
  };
};

export const ReviewSection = async ({ tmdbId, type, searchParams }: ReviewSectionProps) => {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || 'en-US') as Locale;
  const fullDict = await getDictionary('journal', locale);
  const dict = fullDict.reviews;

  // Fetch current user id to determine ownership of reviews
  const userRes = await getCurrentUser();
  const currentUserId = userRes.success ? userRes.data.id : null;

  // Fetch reviews based on searchParams
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const minRating = searchParams?.minRating ? parseInt(searchParams.minRating, 10) : undefined;
  const maxRating = searchParams?.maxRating ? parseInt(searchParams.maxRating, 10) : undefined;
  const hasSpoilers = searchParams?.hasSpoilers === 'true' ? true : undefined;
  const orderBy = searchParams?.orderBy || 'Date';
  const isAscending = searchParams?.isAscending ? searchParams.isAscending === 'true' : false;

  const reviewsRes = await getReviews({
    tmdbId,
    type,
    page,
    pageSize: 10,
    minRating,
    maxRating,
    hasSpoilers,
    orderBy,
    isAscendingOrder: isAscending
  });

  const pagedReviews = reviewsRes.success ? reviewsRes.data : null;

  return (
    <section className="mt-12 w-full flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{dict.title}</h2>
        <Suspense fallback={<div className="h-48 w-full bg-muted animate-pulse rounded-xl" />}>
          <ReviewForm 
            tmdbId={tmdbId} 
            type={type} 
            dict={dict.form}
          />
        </Suspense>
      </div>

      <Suspense fallback={<div className="h-64 w-full bg-white/5 animate-pulse rounded-xl" />}>
        {pagedReviews && (
          <ReviewList 
            reviews={pagedReviews.items} 
            totalPages={pagedReviews.totalPages}
            currentPage={page}
            dict={dict}
            currentUserId={currentUserId}
          />
        )}
        {!pagedReviews && (
          <div className="text-center py-10 text-zinc-500">
            {dict.emptyState}
          </div>
        )}
      </Suspense>
    </section>
  );
};
