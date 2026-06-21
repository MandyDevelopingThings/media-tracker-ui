import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import { isValidLocale, DEFAULT_LOCALE } from '@/lib/i18n-config';
import { getProfile } from '@/features/accounts/api/get-profile';
import { getUserWatchEntries } from '@/features/journal/api/get-user-watch-entries';
import { WatchEntryListShell } from '@/features/journal/components/WatchEntryListShell';
import { LIST_LAYOUT_COOKIE } from '@/features/journal/types/watch-entry';
import type { ListLayout } from '@/features/journal/types/watch-entry';

type ProfileListPageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProfileListPage({ params, searchParams }: ProfileListPageProps) {
  const { username } = await params;
  const resolvedSearchParams = await searchParams;

  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const rawLayout = cookieStore.get(LIST_LAYOUT_COOKIE)?.value;
  const initialLayout: ListLayout = rawLayout === 'grouped' ? 'grouped' : 'grid';

  const profileRes = await getProfile(username);
  if (!profileRes.success) notFound();

  const userId = profileRes.data.userId;

  const typeParam = resolvedSearchParams.type as string | undefined;
  const type = typeParam !== undefined ? parseInt(typeParam, 10) : undefined;

  const orderBy = resolvedSearchParams.orderBy as string | undefined;
  const isAscendingOrderParam = resolvedSearchParams.isAscendingOrder as string | undefined;
  const isAscendingOrder =
    isAscendingOrderParam === 'true'
      ? true
      : isAscendingOrderParam === 'false'
        ? false
        : undefined;

  const [entriesRes, dict] = await Promise.all([
    getUserWatchEntries(userId, {
      pageSize: 300,
      type,
      orderBy,
      isAscendingOrder,
    }),
    getDictionary('journal', locale),
  ]);

  if (!entriesRes.success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-border/40 bg-card rounded-xl shadow-sm">
        <p className="text-muted-foreground">
          {entriesRes.error?.detail ?? entriesRes.error?.title ?? 'Erro ao carregar a lista.'}
        </p>
      </div>
    );
  }

  const { items, totalItems } = entriesRes.data;
  const listDict = dict.list;

  const shellDict: Parameters<typeof WatchEntryListShell>[0]['dict'] = {
    title: listDict.title,
    totalItems: listDict.totalItems,
    search: listDict.search,
    switchToGrid: listDict.switchToGrid,
    switchToGrouped: listDict.switchToGrouped,
    emptyState: listDict.emptyState,
    grid: {
      filters: listDict.filters,
      orderBy: listDict.orderBy,
      emptyStateFiltered: listDict.emptyState,
      card: listDict.card,
    },
    grouped: {
      filters: listDict.filters,
      orderBy: listDict.orderBy,
      status: listDict.status,
      emptyState: listDict.emptyState,
      card: listDict.card,
    },
  };

  return (
    <WatchEntryListShell
      items={items}
      totalItems={totalItems}
      initialLayout={initialLayout}
      dict={shellDict}
    />
  );
}
