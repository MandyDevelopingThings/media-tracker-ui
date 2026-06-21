'use server';

import { getEpisodeEntries } from '../api/get-episode-entries';

export const getEpisodeEntriesAction = async (tmdbShowId: number, seasonNumber: number, episodeNumber: number) => {
  return await getEpisodeEntries(tmdbShowId, seasonNumber, episodeNumber);
};
