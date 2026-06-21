'use client';

import { useState, useEffect } from 'react';
import { WatchEntryItem } from './WatchEntryItem';
import type { EpisodeWatchEntryDto } from '../../types/episode-watch-entry';
import type { EpisodeEntriesDict } from './EpisodeEntriesDialog';

type WatchEntryListProps = {
  initialEntries: EpisodeWatchEntryDto[];
  dict: EpisodeEntriesDict;
};

export const WatchEntryList = ({ initialEntries, dict }: WatchEntryListProps) => {
  const [entries, setEntries] = useState(initialEntries);

  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  const handleDeleted = (entryId: string) => {
    setEntries(prev => prev.filter(e => e.id !== entryId));
  };

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">{dict.noEntries}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2 max-h-[300px] overflow-y-auto pr-2">
      {entries.map((entry) => (
        <WatchEntryItem
          key={entry.id}
          entry={entry}
          dict={dict}
          onDeleted={handleDeleted}
        />
      ))}
    </div>
  );
};
