import { type Core } from '@cachemap/core';
import { type Edge } from '../types.ts';

export type Params = {
  edges: Edge[];
  group: string;
  headers: Headers;
  page: number;
  totalPages: number;
  totalResults: number;
};

export const cacheCursors = async (
  cursorCache: Core,
  { edges, group, headers, page, totalPages, totalResults }: Params
) => {
  const cacheControl = headers.get('cache-control');
  const options = cacheControl ? { cacheHeaders: { cacheControl } } : undefined;

  await Promise.all(
    edges.map(async ({ cursor, node }, index) => cursorCache.set(cursor, { group, index, node, page }, options))
  );

  await cursorCache.set(`${group}-metadata`, { totalPages, totalResults }, options);
};
