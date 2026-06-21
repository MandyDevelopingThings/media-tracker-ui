'use client';

import {
  createContext,
  useContext,
  useOptimistic,
  startTransition,
  type ReactNode,
} from 'react';
import type { SeasonDto } from '../types';

type WatchedEpisodesMap = Record<number, number[]>;

type TvWatchContextValue = {
  optimisticWatchedEpisodes: WatchedEpisodesMap;
  addOptimisticEpisode: (seasonNumber: number, episodeNumber: number) => void;
  addOptimisticSeason: (seasonNumber: number, episodeNumbers: number[]) => void;
  addOptimisticSession: (params: {
    finishedAt?: string;
    stoppedAtSeasonNumber?: number;
    stoppedAtEpisodeNumber?: number;
  }) => void;
};

const TvWatchContext = createContext<TvWatchContextValue | null>(null);

export const useTvWatch = (): TvWatchContextValue => {
  const context = useContext(TvWatchContext);
  if (!context) throw new Error('useTvWatch must be used within a TvWatchProvider');
  return context;
};

export const useTvWatchOptional = (): TvWatchContextValue | null =>
  useContext(TvWatchContext);

type TvWatchAction =
  | { type: 'ADD_EPISODE'; seasonNumber: number; episodeNumber: number }
  | { type: 'ADD_SEASON'; seasonNumber: number; episodeNumbers: number[] }
  | { type: 'ADD_SESSION'; episodesMap: WatchedEpisodesMap };

const mergeNumbers = (existing: number[], incoming: number[]): number[] =>
  [...new Set([...existing, ...incoming])];

const reducer = (state: WatchedEpisodesMap, action: TvWatchAction): WatchedEpisodesMap => {
  if (action.type === 'ADD_EPISODE') {
    return {
      ...state,
      [action.seasonNumber]: mergeNumbers(
        state[action.seasonNumber] ?? [],
        [action.episodeNumber],
      ),
    };
  }

  if (action.type === 'ADD_SEASON') {
    return {
      ...state,
      [action.seasonNumber]: mergeNumbers(
        state[action.seasonNumber] ?? [],
        action.episodeNumbers,
      ),
    };
  }

  if (action.type === 'ADD_SESSION') {
    const next = { ...state };
    for (const [seasonKey, episodes] of Object.entries(action.episodesMap)) {
      const season = Number(seasonKey);
      next[season] = mergeNumbers(next[season] ?? [], episodes);
    }
    return next;
  }

  return state;
};

/**
 * Computes a WatchedEpisodesMap for a session based on its stop point or
 * completion. If `finishedAt` is set, all episodes of all seasons are marked.
 * If a stop point is set, all episodes up to and including that point are marked.
 */
const computeSessionEpisodesMap = (
  seasons: readonly SeasonDto[],
  params: {
    finishedAt?: string;
    stoppedAtSeasonNumber?: number;
    stoppedAtEpisodeNumber?: number;
  },
): WatchedEpisodesMap => {
  const map: WatchedEpisodesMap = {};

  const regularSeasons = seasons.filter((s) => s.seasonNumber > 0);

  if (params.finishedAt) {
    for (const season of regularSeasons) {
      map[season.seasonNumber] = season.episodes.map((e) => e.episodeNumber);
    }
    return map;
  }

  if (params.stoppedAtSeasonNumber != null && params.stoppedAtEpisodeNumber != null) {
    const stopSeason = params.stoppedAtSeasonNumber;
    const stopEpisode = params.stoppedAtEpisodeNumber;

    for (const season of regularSeasons) {
      if (season.seasonNumber < stopSeason) {
        map[season.seasonNumber] = season.episodes.map((e) => e.episodeNumber);
      } else if (season.seasonNumber === stopSeason) {
        map[season.seasonNumber] = season.episodes
          .filter((e) => e.episodeNumber <= stopEpisode)
          .map((e) => e.episodeNumber);
      }
    }
  }

  return map;
};

type TvWatchProviderProps = {
  children: ReactNode;
  initialWatchedEpisodes: WatchedEpisodesMap;
  seasons: readonly SeasonDto[];
};

export const TvWatchProvider = ({
  children,
  initialWatchedEpisodes,
  seasons,
}: TvWatchProviderProps) => {
  const [optimisticWatchedEpisodes, dispatch] = useOptimistic(
    initialWatchedEpisodes,
    reducer,
  );

  const addOptimisticEpisode = (seasonNumber: number, episodeNumber: number) => {
    startTransition(() => {
      dispatch({ type: 'ADD_EPISODE', seasonNumber, episodeNumber });
    });
  };

  const addOptimisticSeason = (seasonNumber: number, episodeNumbers: number[]) => {
    startTransition(() => {
      dispatch({ type: 'ADD_SEASON', seasonNumber, episodeNumbers });
    });
  };

  const addOptimisticSession = (params: {
    finishedAt?: string;
    stoppedAtSeasonNumber?: number;
    stoppedAtEpisodeNumber?: number;
  }) => {
    const episodesMap = computeSessionEpisodesMap(seasons, params);
    startTransition(() => {
      dispatch({ type: 'ADD_SESSION', episodesMap });
    });
  };

  return (
    <TvWatchContext.Provider
      value={{
        optimisticWatchedEpisodes,
        addOptimisticEpisode,
        addOptimisticSeason,
        addOptimisticSession,
      }}
    >
      {children}
    </TvWatchContext.Provider>
  );
};
