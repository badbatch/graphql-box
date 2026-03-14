import { Core } from '@cachemap/core';
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

export const generateCursorCache = ({
  group,
  pageRanges = [],
  resultsPerPage,
  totalPages,
  totalResults,
}: Params): Core => {
  const cursorCache = new Core({
    name: 'cursorCache',
    type: 'someType',
  });

  const headers = new Headers({ 'Cache-Control': 'max-age=60' });

  if (pageRanges.length > 0 && resultsPerPage) {
    const pages = generatePages(pageRanges);
    let cachedNodeIds: (string | number)[] = [];

    for (const page of pages) {
      const isLastPage = page === pages.at(-1);
      let resultsOnCurrentPage: number;

      if (isLastPage) {
        const remainder = totalResults % resultsPerPage;
        resultsOnCurrentPage = remainder === 0 ? resultsPerPage : remainder;
      } else {
        resultsOnCurrentPage = resultsPerPage;
      }

      const edges = Array.from({ length: resultsOnCurrentPage }, (_v, index) => index).map(index => {
        const id = encode(`${String(index)}::${String(page)}`);
        return { cursor: `${id}::${group}`, node: { id } };
      });

      cachedNodeIds = [...cachedNodeIds, ...edges.map(edge => edge.node.id)];

      cacheCursors(cursorCache, { cachedNodeIds, edges, group, headers, page, totalPages, totalResults });
    }
  } else {
    cursorCache.set(
      `${group}-metadata`,
      { cachedNodeIds: [], totalPages, totalResults },
      { cacheOptions: { cacheControl: headers.get('cache-control') ?? undefined } },
    );
  }

  return cursorCache;
};
