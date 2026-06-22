import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { z } from 'zod';
import { getDictionary } from '@/lib/i18n';
import { isValidLocale, DEFAULT_LOCALE } from '@/lib/i18n-config';
import { isAuthenticated } from '@/lib/auth';
import { getMovieDetails } from '@/features/library/api/media-api';
import { MediaDetailsHeader } from '@/features/library/components/media-details-header';
import { ReviewSection } from '@/features/journal/components/ReviewSection';

const TmdbIdSchema = z.coerce.number().int().positive();

type MoviePageProps = {
  params: Promise<{ tmdbId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const generateMetadata = async ({
  params,
}: MoviePageProps): Promise<Metadata> => {
  const { tmdbId: raw } = await params;
  const parsed = TmdbIdSchema.safeParse(raw);

  if (!parsed.success) return { title: 'MediaTracker' };

  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [result, dict] = await Promise.all([
    getMovieDetails(parsed.data),
    getDictionary('library', locale),
  ]);

  if (!result.success) return { title: 'MediaTracker' };

  return {
    title: dict.details.pageTitle.replace('{title}', result.data.title),
    description: result.data.overview,
  };
};

export default async function MoviePage({ params, searchParams }: MoviePageProps) {
  const { tmdbId: raw } = await params;
  const parsed = TmdbIdSchema.safeParse(raw);

  if (!parsed.success) notFound();

  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [result, dict, authenticated] = await Promise.all([
    getMovieDetails(parsed.data),
    getDictionary('library', locale),
    isAuthenticated(),
  ]);

  if (!result.success) notFound();

  let isFavorite = false;
  if (authenticated) {
    const { getWatchEntry } = await import('@/features/journal/api/get-watch-entry');
    const watchEntryRes = await getWatchEntry(parsed.data, 0); 
    if (watchEntryRes.success && watchEntryRes.data) {
      isFavorite = watchEntryRes.data.isFavorite ?? false;
    }
  }

  const sp = searchParams ? await searchParams : undefined;
  const reviewSearchParams = sp ? {
    page: typeof sp.page === 'string' ? sp.page : undefined,
    minRating: typeof sp.minRating === 'string' ? sp.minRating : undefined,
    maxRating: typeof sp.maxRating === 'string' ? sp.maxRating : undefined,
    hasSpoilers: typeof sp.hasSpoilers === 'string' ? sp.hasSpoilers : undefined,
    orderBy: typeof sp.orderBy === 'string' ? sp.orderBy : undefined,
    isAscending: typeof sp.isAscending === 'string' ? sp.isAscending : undefined,
  } : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <MediaDetailsHeader
          media={result.data}
          isAuthenticated={authenticated}
          dict={dict.details as any}
          isFavorite={isFavorite}
        />
        <ReviewSection tmdbId={parsed.data} type={0} searchParams={reviewSearchParams} />
      </div>
    </div>
  );
}
