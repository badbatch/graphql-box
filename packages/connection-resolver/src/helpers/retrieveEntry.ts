import { type Core } from '@cachemap/core';
import {
  type ConnectionInputOptions,
  type CursorCacheEntry,
  type CursorGroupMetadata,
  type PartialCursorCacheEntry,
} from '../types.ts';
import { getCursor } from './getCursor.ts';
import { makeEntry } from './makeEntry.ts';

export type Context = {
  cursorCache: Core;
  resultsPerPage: number;
};

export const retrieveEntry = async (
  args: ConnectionInputOptions,
  metadata: CursorGroupMetadata,
  { cursorCache, resultsPerPage }: Context,
): Promise<PartialCursorCacheEntry> => {
  const cursor = getCursor(args);

  if (cursor) {
    const cursorCacheEntry = await cursorCache.get<CursorCacheEntry>(cursor);

    if (cursorCacheEntry) {
      return cursorCacheEntry;
    }
  }

  return makeEntry(args, { metadata, resultsPerPage });
};
