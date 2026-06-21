import { cookies } from "next/headers";
import { getDictionary } from "@/lib/i18n";
import { isValidLocale, DEFAULT_LOCALE } from "@/lib/i18n-config";
import { getHomeData } from "@/features/library/api/get-home-data";
import { HeroSection } from "@/features/library/components/HeroSection";
import { TopRatedSection } from "@/features/library/components/TopRatedSection";

export default async function HomePage() {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [result, dict] = await Promise.all([
    getHomeData(),
    getDictionary("library", locale)
  ]);

  const homeDict = dict.home;

  if (!result.success) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 text-foreground">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-red-500">
            {homeDict.errorTitle}
          </h2>
          <p className="text-sm text-muted-foreground">
            {result.error?.title || homeDict.errorHint}
          </p>
        </div>
      </div>
    );
  }

  const { featuredMedia, topRatedMedia } = result.data;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {featuredMedia ? (
        <HeroSection media={featuredMedia} dict={homeDict} />
      ) : (
        <div className="flex h-[50vh] items-center justify-center border-b border-border bg-muted/20">
          <p className="text-muted-foreground">{homeDict.noFeatured}</p>
        </div>
      )}

      {topRatedMedia && topRatedMedia.length > 0 && (
        <TopRatedSection items={topRatedMedia} dict={homeDict} />
      )}
    </main>
  );
}
