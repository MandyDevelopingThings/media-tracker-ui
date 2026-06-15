import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { z } from 'zod';
import { getDictionary } from '@/lib/i18n';
import { isValidLocale, DEFAULT_LOCALE } from '@/lib/i18n-config';
import { isAuthenticated } from '@/lib/auth';
import { getTvDetails } from '@/features/library/api/media-api';
import { MediaDetailsHeader } from '@/features/library/components/media-details-header';

const TmdbIdSchema = z.coerce.number().int().positive();

type TvPageProps = {
  params: Promise<{ tmdbId: string }>;
};

export const generateMetadata = async ({
  params,
}: TvPageProps): Promise<Metadata> => {
  const { tmdbId: raw } = await params;
  const parsed = TmdbIdSchema.safeParse(raw);

  if (!parsed.success) return { title: 'MediaTracker' };

  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [result, dict] = await Promise.all([
    getTvDetails(parsed.data),
    getDictionary('library', locale),
  ]);

  if (!result.success) return { title: 'MediaTracker' };

  return {
    title: dict.details.pageTitle.replace('{title}', result.data.title),
    description: result.data.overview,
  };
};

export default async function TvPage({ params }: TvPageProps) {
  const { tmdbId: raw } = await params;
  const parsed = TmdbIdSchema.safeParse(raw);

  if (!parsed.success) notFound();

  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [result, dict, authenticated] = await Promise.all([
    getTvDetails(parsed.data),
    getDictionary('library', locale),
    isAuthenticated(),
  ]);

  if (!result.success) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <MediaDetailsHeader
          media={result.data}
          isAuthenticated={authenticated}
          dict={dict.details}
        />
      </div>
    </div>
  );
}
