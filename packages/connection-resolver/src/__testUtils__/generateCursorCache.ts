import Cachemap from "@cachemap/core";
import map from "@cachemap/map";
import { encode } from "js-base64";
import cacheCursors from "../helpers/cacheCursors";
import generatePages from "./generatePages";

export type Params = {
  group: string;
  pageRanges?: string[];
  resultsPerPage?: number;
  totalPages: number;
  totalResults: number;
};

export default async ({ group, pageRanges = [], resultsPerPage, totalPages, totalResults }: Params) => {
  const cursorCache = new Cachemap({
    name: "cursorCache",
    store: map(),
  });

  const headers = new Headers({ "Cache-Control": "max-age=60" });

  if (pageRanges.length && resultsPerPage) {
    const pages = generatePages(pageRanges);

    await Promise.all(
      pages.map(async page => {
        const isLastPage = page === pages[pages.length - 1];
        let resultsOnCurrentPage: number;

        if (isLastPage) {
          const remainder = totalResults % resultsPerPage;
          resultsOnCurrentPage = remainder === 0 ? resultsPerPage : remainder;
        } else {
          resultsOnCurrentPage = resultsPerPage;
        }

        const edges = Array.from({ length: resultsOnCurrentPage }, (_v, i) => i).map(index => {
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
      { cacheHeaders: { cacheControl: headers.get("cache-control") ?? undefined } },
    );
  }

  return cursorCache;
};
