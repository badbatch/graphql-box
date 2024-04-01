import { type LogEntry } from '../../types.ts';

export const sortEntries = (payload: Record<string, LogEntry>) => (idA: string, idB: string) => {
  const logEntryA = payload[idA]!;
  const logEntryB = payload[idB]!;
  const timestampA = new Date(logEntryA['@timestamp']).valueOf();
  const timestampB = new Date(logEntryB['@timestamp']).valueOf();

  if (timestampA < timestampB) {
    return -1;
  }

  if (timestampA > timestampB) {
    return 1;
  }

  return 0;
};
