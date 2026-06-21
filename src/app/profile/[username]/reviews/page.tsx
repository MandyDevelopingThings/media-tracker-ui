import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import { isValidLocale, DEFAULT_LOCALE } from '@/lib/i18n-config';
import { getProfile } from '@/features/accounts/api/get-profile';
import { getProfileReviews } from '@/features/journal/api/get-profile-reviews';
import { ProfileReviewCard } from '@/features/journal/components/ProfileReviewCard';
import { ProfileReviewsFilter } from '@/features/journal/components/ProfileReviewsFilter';
import { PaginationControls } from '@/components/ui/pagination-controls';

type ProfileReviewsPageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProfileReviewsPage({ params, searchParams }: ProfileReviewsPageProps) {
  const { username } = await params;
  const resolvedSearchParams = await searchParams;

  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const profileRes = await getProfile(username);
  if (!profileRes.success) {
    notFound();
  }

  const userId = profileRes.data.userId;

  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string, 10) : 1;
  const pageSize = 10;
  
  const minRatingParam = resolvedSearchParams.minRating as string | undefined;
  const minRating = minRatingParam ? parseInt(minRatingParam, 10) : undefined;
  
  const maxRatingParam = resolvedSearchParams.maxRating as string | undefined;
  const maxRating = maxRatingParam ? parseInt(maxRatingParam, 10) : undefined;
  
  const typeParam = resolvedSearchParams.type as string | undefined;
  const type = typeParam ? parseInt(typeParam, 10) : undefined;

  const hasSpoilersParam = resolvedSearchParams.hasSpoilers as string | undefined;
  const hasSpoilers = hasSpoilersParam === 'true' ? true : (hasSpoilersParam === 'false' ? false : undefined);

  const orderBy = resolvedSearchParams.orderBy as string | undefined;
  const isAscendingOrderParam = resolvedSearchParams.isAscendingOrder as string | undefined;
  const isAscendingOrder = isAscendingOrderParam === 'true' ? true : (isAscendingOrderParam === 'false' ? false : undefined);

  const [reviewsRes, dict] = await Promise.all([
    getProfileReviews(userId, {
      page,
      pageSize,
      minRating,
      maxRating,
      type,
      hasSpoilers,
      orderBy,
      isAscendingOrder,
    }),
    getDictionary('journal', locale),
  ]);

  if (!reviewsRes.success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-border/40 bg-card rounded-xl shadow-sm">
        <p className="text-muted-foreground">{reviewsRes.error?.detail || reviewsRes.error?.title || "Failed to load reviews"}</p>
      </div>
    );
  }

  const { items, totalPages, hasNextPage, hasPreviousPage } = reviewsRes.data;
  const profileDict = dict.profile;
  const reviewsDict = dict.reviews;

  const filterDict = {
    title: profileDict.reviews.filters.title,
    type: profileDict.reviews.filters.type,
    movie: profileDict.reviews.filters.movie,
    tv: profileDict.reviews.filters.tv,
    all: profileDict.reviews.filters.all,
    minRating: profileDict.reviews.filters.minRating,
    maxRating: profileDict.reviews.filters.maxRating,
    hasSpoilers: profileDict.reviews.filters.hasSpoilers,
    orderBy: profileDict.reviews.filters.orderBy,
    date: profileDict.reviews.filters.date,
    rating: profileDict.reviews.filters.rating,
    asc: profileDict.reviews.filters.asc,
    desc: profileDict.reviews.filters.desc,
    clear: profileDict.reviews.filters.clear,
    apply: profileDict.reviews.filters.apply,
    dateDesc: reviewsDict.sort.dateDesc,
    dateAsc: reviewsDict.sort.dateAsc,
    ratingDesc: reviewsDict.sort.ratingDesc,
    ratingAsc: reviewsDict.sort.ratingAsc,
    yes: profileDict.reviews.filters.yes,
    no: profileDict.reviews.filters.no,
  };

  const cardDict = {
    spoilerBadge: profileDict.lastReview.spoilerBadge,
    readMore: reviewsDict.readMore,
    revealSpoiler: reviewsDict.revealSpoiler,
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-72 lg:shrink-0 lg:sticky lg:top-20 h-fit">
        <ProfileReviewsFilter dict={filterDict} />
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-border/40 bg-card rounded-xl shadow-sm">
            <p className="text-muted-foreground">{profileDict.reviews.emptyState}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-6">
              {items.map((review, index) => (
                <ProfileReviewCard 
                  key={`${review.tmdbId}-${review.type}-${index}`}
                  review={review}
                  dict={cardDict}
                />
              ))}
            </div>

            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              hasPreviousPage={hasPreviousPage}
              hasNextPage={hasNextPage}
              dict={{
                prev: reviewsDict.pagination.prev,
                next: reviewsDict.pagination.next,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
