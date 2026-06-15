'use server';

import { getSeasonDetails } from '../api/media-api';

export const getSeasonDetailsAction = async (
  tmdbId: number,
  seasonNumber: number,
) => getSeasonDetails(tmdbId, seasonNumber);
