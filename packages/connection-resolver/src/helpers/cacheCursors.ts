import { type Core } from '@cachemap/core';
import { type Edge } from '../types.ts';

export type Params = {
  cachedNodeIds: (string | number)[];
  edges: Edge[];
  group: string;
  headers: Headers;
  page: number;
  totalPages: number;
  totalResults: number;
};

export const cacheCursors = (
  cursorCache: Core,
  { cachedNodeIds, edges, group, headers, page, totalPages, totalResults }: Params,
) => {
  const cacheControl = headers.get('cache-control');
  const options = cacheControl ? { cacheOptions: { cacheControl } } : undefined;

  for (const [index, { cursor, node }] of edges.entries()) {
    cursorCache.set(cursor, { group, index, node, page }, options);
  }

  cursorCache.set(`${group}-metadata`, { cachedNodeIds, totalPages, totalResults }, options);
};
