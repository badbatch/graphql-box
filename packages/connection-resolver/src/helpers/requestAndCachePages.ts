import { type Core } from '@cachemap/core';
import { type PlainObject, type SetCacheMetadata } from '@graphql-box/core';
import { type GraphQLResolveInfo } from 'graphql';
import {
  type CachedEdges,
  type CursorGroupMetadata,
  type Getters,
  type Node,
  type ResourceResolver,
} from '../types.ts';
import { cacheCursors } from './cacheCursors.ts';
import { makeEdges } from './makeEdges.ts';

export type Context<Resource extends PlainObject, ResourceNode extends Node> = {
  cursorCache: Core;
  getters: Getters<Resource, ResourceNode>;
  groupCursor: string;
  makeIDCursor: (id: string | number) => string;
  resolverInfo: GraphQLResolveInfo;
  resourceResolver: ResourceResolver<Resource>;
  setCacheMetadata: SetCacheMetadata | undefined;
};

const filterOutCachedNodes = (nodes: Node[], cachedNodeIds: (string | number)[]): Node[] => {
  return nodes.filter(node => !cachedNodeIds.includes(node.id));
};

export const requestAndCachePages = async <Resource extends PlainObject, ResourceNode extends Node>(
  pages: number[],
  {
    cursorCache,
    getters,
    groupCursor,
    makeIDCursor,
    resolverInfo,
    resourceResolver,
    setCacheMetadata,
  }: Context<Resource, ResourceNode>,
) => {
  const errors: Error[] = [];
  const metadata = cursorCache.get<CursorGroupMetadata>(`${groupCursor}-metadata`);
  let cachedNodeIds = metadata?.cachedNodeIds ?? [];
  const cachedEdges: CachedEdges[] = [];

  for (const page of pages) {
    const {
      data: pageResultData,
      errors: pageResultErrors,
      headers: pageResultHeaders,
    } = await resourceResolver({
      page,
    });

    if (pageResultData) {
      setCacheMetadata?.(pageResultData, resolverInfo, pageResultHeaders);
    }

    if (pageResultData && !pageResultErrors?.length) {
      const nodes = filterOutCachedNodes(getters.nodes(pageResultData), cachedNodeIds);
      const edges = makeEdges(nodes, node => makeIDCursor(node.id));
      cachedNodeIds = [...cachedNodeIds, ...edges.map(edge => edge.node.id)];

      cacheCursors(cursorCache, {
        cachedNodeIds,
        edges,
        group: groupCursor,
        headers: pageResultHeaders,
        page,
        totalPages: getters.totalPages(pageResultData),
        totalResults: getters.totalResults(pageResultData),
      });

      cachedEdges.push({ edges, pageNumber: page });
    } else {
      cachedEdges.push({ edges: [], pageNumber: page });
    }

    if (pageResultErrors?.length) {
      errors.push(...pageResultErrors);
    }
  }

  return { cachedEdges, errors };
};
