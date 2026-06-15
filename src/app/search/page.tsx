import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import { isValidLocale, DEFAULT_LOCALE } from '@/lib/i18n-config';
import { MediaSearchParamsSchema, SEARCH_LAYOUT_COOKIE, DEFAULT_SEARCH_LAYOUT } from '@/features/library/types';
import type { SearchLayout } from '@/features/library/types';
import { searchMedia } from '@/features/library/api/media-api';
import { SearchFilters } from '@/features/library/components/search-filters';
import { SearchResultsArea } from '@/features/library/components/search-results-area';
import { SearchPagination } from '@/features/library/components/search-pagination';
import { SearchEmptyState } from '@/features/library/components/search-empty-state';
import { SearchErrorState } from '@/features/library/components/search-error-state';

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}): Promise<Metadata> => {
  const params = await searchParams;
  const query = params.q ?? '';
  return {
    title: query ? `"${query}" — Busca | MediaTracker` : 'Busca | MediaTracker',
    description: `Resultados de busca para "${query}" no MediaTracker.`,
  };
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const rawParams = await searchParams;

  const parsed = MediaSearchParamsSchema.safeParse(rawParams);
  if (!parsed.success || !rawParams.q?.trim()) {
    redirect('/');
  }

  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const rawLayout = cookieStore.get(SEARCH_LAYOUT_COOKIE)?.value;
  const layout: SearchLayout =
    rawLayout === 'grid' || rawLayout === 'table' ? rawLayout : DEFAULT_SEARCH_LAYOUT;

  const [result, dict] = await Promise.all([
    searchMedia(parsed.data),
    getDictionary('library', locale),
  ]);

  const search = dict.search;

  return (
    <div className="flex flex-1 gap-0">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border/50 p-6">
        <SearchFilters
          currentParams={parsed.data}
          dict={search.filters}
        />
      </aside>

      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 md:p-8 min-w-0">
        {!result.success ? (
          <SearchErrorState dict={{ errorTitle: search.errorTitle, errorHint: search.errorHint }} />
        ) : result.data.items.length === 0 ? (
          <SearchEmptyState
            query={parsed.data.q}
            dict={{ noResults: search.noResults, noResultsHint: search.noResultsHint }}
          />
        ) : (
          <>
            <SearchResultsArea
              items={result.data.items}
              initialLayout={layout}
              totalItems={result.data.totalItems}
              query={parsed.data.q}
              dict={{
                movie: search.card.movie,
                tvShow: search.card.tvShow,
                unknown: search.card.unknown,
                noPoster: search.card.noPoster,
                grid: search.layout.grid,
                table: search.layout.table,
                resultsCount: search.resultsCount,
                resultsCountPlural: search.resultsCountPlural,
                title: search.title,
              }}
            />
            <SearchPagination
              currentPage={result.data.pageNumber}
              totalPages={result.data.totalPages}
              dict={search.pagination}
            />
          </>
        )}
      </div>
    </div>
  );
}
