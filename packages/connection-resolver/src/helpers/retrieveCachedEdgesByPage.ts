import { type Core } from '@cachemap/core';
import { type CursorCacheEntry, type Edge } from '../types.ts';

export type Context = {
  groupCursor: string;
  pageNumber: number;
};

export const retrieveCachedEdgesByPage = async (cursorCache: Core, { groupCursor, pageNumber }: Context) => {
  const { entries, metadata } = await cursorCache.export<CursorCacheEntry>({
    filterByValue: [
      { comparator: pageNumber, keyChain: 'page' },
      { comparator: groupCursor, keyChain: 'group' },
    ],
  });

  return {
    edges: entries.reduce<Edge[]>((cached, [key, { index, node }]) => {
      if (metadata[index]?.cacheability.checkTTL()) {
        cached[index] = { cursor: key, node };
      }

      return cached;
    }, []),
    pageNumber,
  };
};
