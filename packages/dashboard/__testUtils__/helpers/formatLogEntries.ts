import { type EntityState } from '@reduxjs/toolkit';
import { encode } from 'js-base64';
import { type Except } from 'type-fest';
import { type LogEntry } from '../../src/types.ts';

export const formatLogEntries = (entries: Except<LogEntry, 'id'>[]): EntityState<LogEntry, string> => ({
  entities: entries.reduce((acc, entry) => {
    const id = encode(JSON.stringify(entry));

    return {
      ...acc,
      [id]: {
        ...entry,
        id,
      },
    };
  }, {}),
  ids: entries.map(entry => encode(JSON.stringify(entry))),
});
