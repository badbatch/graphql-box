import { type Core } from '@cachemap/core';
import { type PlainObject } from '@graphql-box/core';
import { type Logger } from 'winston';
import {
  type ConnectionInputOptions,
  type Getters,
  type Node,
  type ResourceResolver,
  type SetCacheMetadata,
} from '../types.ts';
import { extractEdges } from './extractEdges.ts';
import { extractNodes } from './extractNodes.ts';
import { getInRangeCachedEdges } from './getInRangeCachedEdges.ts';
import { getEndCursor, getStartCursor } from './getStartAndEndCursors.ts';
import { mergeCachedEdges } from './mergeCachedEdges.ts';
import { requestAndCachePages } from './requestAndCachePages.ts';
import { retrieveCachedConnection } from './retrieveCachedConnection.ts';

export type Context<Resource extends PlainObject, ResourceNode extends Node> = {
  cursorCache: Core;
  fieldName: string;
  getters: Getters<Resource, ResourceNode>;
  groupCursor: string;
  logger: Logger | undefined;
  makeIDCursor: (id: string | number) => string;
  resourceResolver: ResourceResolver<Resource>;
  resultsPerPage: number;
  setCacheMetadata: SetCacheMetadata | undefined;
};

export const resolveConnection = async <Resource extends PlainObject, ResourceNode extends Node>(
  args: PlainObject & ConnectionInputOptions,
  {
    cursorCache,
    fieldName,
    getters,
    groupCursor,
    logger,
    makeIDCursor,
    resourceResolver,
    resultsPerPage,
    setCacheMetadata,
  }: Context<Resource, ResourceNode>,
) => {
  const { cachedEdges, hasNextPage, hasPreviousPage, indexes, missingPages, totalResults } =
    await retrieveCachedConnection(args, {
      cursorCache,
      groupCursor,
      resultsPerPage,
    });

  if (missingPages.length === 0) {
    const edges = extractEdges(cachedEdges);
    logger?.info(`Successfully resolved ${fieldName} from cache`);

    return {
      edges,
      errors: [],
      nodes: extractNodes(edges),
      pageInfo: {
        endCursor: getEndCursor(edges),
        hasNextPage,
        hasPreviousPage,
        startCursor: getStartCursor(edges),
      },
      totalCount: totalResults,
    };
  }

  const { cachedEdges: missingCachedEdges, errors } = await requestAndCachePages<Resource, ResourceNode>(missingPages, {
    cursorCache,
    fieldName,
    getters,
    groupCursor,
    makeIDCursor,
    resourceResolver,
    setCacheMetadata,
  });

  const mergedCachedEdges = getInRangeCachedEdges(mergeCachedEdges(cachedEdges, missingCachedEdges), {
    endIndex: indexes.end,
    resultsPerPage,
    startIndex: indexes.start,
  });

  const edges = extractEdges(mergedCachedEdges);
  logger?.info(`Successfully resolved ${fieldName} from api`);

  return {
    edges,
    errors,
    nodes: extractNodes(edges),
    pageInfo: {
      endCursor: getEndCursor(edges),
      hasNextPage,
      hasPreviousPage,
      startCursor: getStartCursor(edges),
    },
    totalCount: totalResults,
  };
};
