import Cachemap from "@cachemap/core";
import { Getters, ResourceResolver } from "../defs";
import cacheCursors from "./cacheCursors";
import makeEdges from "./makeEdges";

export type Context = {
  cursorCache: Cachemap;
  getters: Getters;
  groupCursor: string;
  makeIDCursor: (id: string | number) => string;
  resourceResolver: ResourceResolver;
};

export default async (
  pages: number[],
  { cursorCache, getters, groupCursor, makeIDCursor, resourceResolver }: Context,
) => {
  const errors: Error[] = [];

  const cachedEdges = await Promise.all(
    pages.map(async page => {
      const { data: pageResultData, errors: pageResultErrors, headers: pageResultHeaders } = await resourceResolver({
        page,
      });

      if (pageResultData && !pageResultErrors?.length) {
        const edges = makeEdges(getters.nodes(pageResultData), node => makeIDCursor(node.id));

        cacheCursors(cursorCache, {
          edges,
          group: groupCursor,
          headers: pageResultHeaders,
          page,
          totalPages: getters.totalPages(pageResultData),
          totalResults: getters.totalResults(pageResultData),
        });

        return { edges, pageNumber: page };
      }

      if (pageResultErrors?.length) {
        errors.push(...pageResultErrors);
      }

      return { edges: [], pageNumber: page };
    }),
  );

  return { cachedEdges, errors };
};
