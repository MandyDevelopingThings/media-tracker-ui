export type WatchSessionCreatedDto = Readonly<{
  sessionId: string;
  episodesSynced: number;
  newStatus: string;
  startedAt: string;
}>;
