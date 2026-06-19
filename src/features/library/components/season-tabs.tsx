'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { getSeasonDetailsAction } from '../actions/get-season-details';
import { EpisodeRow } from './episode-row';
import type { SeasonDto, EpisodeDto } from '../types';

type SeasonTabsProps = {
  tmdbId: number;
  seasons: readonly SeasonDto[];
  isAuthenticated: boolean;
  dict: {
    specials: string;
    seasons: string;
    episodes: string;
    loadingEpisodes: string;
    addWatched: string;
    episode: string;
    errorHint: string;
  };
  watchedEpisodes?: Record<number, number[]>;
};

const buildInitialEpisodesMap = (
  seasons: readonly SeasonDto[],
): Record<number, readonly EpisodeDto[]> =>
  Object.fromEntries(
    seasons.map((s) => [s.seasonNumber, s.episodes]),
  );

export const SeasonTabs = ({
  tmdbId,
  seasons,
  isAuthenticated,
  dict,
  watchedEpisodes,
}: SeasonTabsProps) => {
  const regularSeasons = seasons.filter((s) => s.seasonNumber !== 0);
  const specialsSeason = seasons.find((s) => s.seasonNumber === 0);
  const orderedSeasons = specialsSeason
    ? [...regularSeasons, specialsSeason]
    : regularSeasons;

  const firstWithEpisodes = orderedSeasons.find((s) => s.episodes.length > 0);
  const defaultSeason = firstWithEpisodes ?? orderedSeasons[0];

  const [activeSeason, setActiveSeason] = useState<number>(
    defaultSeason?.seasonNumber ?? 1,
  );
  const [episodesMap, setEpisodesMap] = useState<
    Record<number, readonly EpisodeDto[]>
  >(buildInitialEpisodesMap(seasons));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSeasonSelect = (seasonNumber: number) => {
    setError(null);
    setActiveSeason(seasonNumber);

    if (episodesMap[seasonNumber]?.length) return;

    startTransition(async () => {
      const result = await getSeasonDetailsAction(tmdbId, seasonNumber);

      if (!result.success) {
        setError(dict.errorHint);
        return;
      }

      setEpisodesMap((prev) => ({
        ...prev,
        [seasonNumber]: result.data,
      }));
    });
  };

  const currentEpisodes = episodesMap[activeSeason] ?? [];
  const activeSeasonMeta = orderedSeasons.find(
    (s) => s.seasonNumber === activeSeason,
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Season pills */}
      <div
        role="tablist"
        aria-label={dict.seasons}
        className="flex flex-wrap gap-2"
      >
        {orderedSeasons.map((season) => {
          const isActive = season.seasonNumber === activeSeason;
          const label =
            season.seasonNumber === 0 ? dict.specials : season.name;

          return (
            <button
              key={season.seasonNumber}
              role="tab"
              id={`season-tab-${season.seasonNumber}`}
              aria-selected={isActive}
              aria-controls={`season-panel-${season.seasonNumber}`}
              type="button"
              onClick={() => handleSeasonSelect(season.seasonNumber)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold',
                'border transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20'
                  : 'bg-transparent text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground',
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Episode list panel */}
      <div
        role="tabpanel"
        id={`season-panel-${activeSeason}`}
        aria-labelledby={`season-tab-${activeSeason}`}
      >
        {isPending ? (
          <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">{dict.loadingEpisodes}</span>
          </div>
        ) : error ? (
          <p className="py-6 text-center text-sm text-destructive">{error}</p>
        ) : currentEpisodes.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {activeSeasonMeta?.name ?? ''} — {dict.episodes}: 0
          </p>
        ) : (
          <div className="flex flex-col gap-0.5 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
            {currentEpisodes.map((episode) => {
              const isWatched = watchedEpisodes?.[activeSeason]?.includes(episode.episodeNumber) ?? false;
              return (
                <EpisodeRow
                  key={episode.episodeNumber}
                  tmdbId={tmdbId}
                  seasonNumber={activeSeason}
                  episode={episode}
                  isAuthenticated={isAuthenticated}
                  addWatchedLabel={dict.addWatched}
                  episodeLabel={dict.episode}
                  isWatched={isWatched}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
