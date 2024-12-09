import { Core } from '@cachemap/core';
import { init as map } from '@cachemap/map';
import { encode } from 'js-base64';
import { cacheCursors } from '../helpers/cacheCursors.ts';
import { generatePages } from './generatePages.ts';

export type Params = {
  group: string;
  pageRanges?: string[];
  resultsPerPage?: number;
  totalPages: number;
  totalResults: number;
};

export const generateCursorCache = async ({
  group,
  pageRanges = [],
  resultsPerPage,
  totalPages,
  totalResults,
}: Params) => {
  const cursorCache = new Core({
    name: 'cursorCache',
    store: map(),
    type: 'someType',
  });

  const headers = new Headers({ 'Cache-Control': 'max-age=60' });

  if (pageRanges.length > 0 && resultsPerPage) {
    const pages = generatePages(pageRanges);

    await Promise.all(
      pages.map(async page => {
        const isLastPage = page === pages.at(-1);
        let resultsOnCurrentPage: number;

        if (isLastPage) {
          const remainder = totalResults % resultsPerPage;
          resultsOnCurrentPage = remainder === 0 ? resultsPerPage : remainder;
        } else {
          resultsOnCurrentPage = resultsPerPage;
        }

        const edges = Array.from({ length: resultsOnCurrentPage }, (_v, index) => index).map(index => {
          const id = encode(`${index}::${page}`);
          return { cursor: `${id}::${group}`, node: { id } };
        });

        await cacheCursors(cursorCache, { edges, group, headers, page, totalPages, totalResults });
      }),
    );
  } else {
    await cursorCache.set(
      `${group}-metadata`,
      { totalPages, totalResults },
      { cacheHeaders: { cacheControl: headers.get('cache-control') ?? undefined } },
    );
  }

  return cursorCache;
};
