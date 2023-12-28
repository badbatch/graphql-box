import { type Core } from '@cachemap/core';
import type { PlainObject } from '@graphql-box/core';
import { type Getters, type Node, type ResourceResolver } from '../types.ts';
import { cacheCursors } from './cacheCursors.ts';
import { makeEdges } from './makeEdges.ts';

export type Context<Resource extends PlainObject, ResourceNode extends Node> = {
  cursorCache: Core;
  getters: Getters<Resource, ResourceNode>;
  groupCursor: string;
  makeIDCursor: (id: string | number) => string;
  resourceResolver: ResourceResolver<Resource>;
};

export const requestAndCachePages = async <Resource extends PlainObject, ResourceNode extends Node>(
  pages: number[],
  { cursorCache, getters, groupCursor, makeIDCursor, resourceResolver }: Context<Resource, ResourceNode>
) => {
  const errors: Error[] = [];

  const cachedEdges = await Promise.all(
    pages.map(async page => {
      const {
        data: pageResultData,
        errors: pageResultErrors,
        headers: pageResultHeaders,
      } = await resourceResolver({
        page,
      });

      if (pageResultData && !pageResultErrors?.length) {
        const edges = makeEdges(getters.nodes(pageResultData), node => makeIDCursor(node.id));

        await cacheCursors(cursorCache, {
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
    })
  );

  return { cachedEdges, errors };
};
