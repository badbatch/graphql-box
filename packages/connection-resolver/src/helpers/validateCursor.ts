import { type Core } from '@cachemap/core';
import { GraphQLError, type GraphQLResolveInfo } from 'graphql';
import { type ConnectionInputOptions, type CursorCacheEntry, type CursorGroupMetadata } from '../types.ts';
import { getCursor } from './getCursor.ts';
import { getDirection } from './getDirection.ts';
import { isCursorFirst } from './isCursorFirst.ts';
import { isCursorLast } from './isCursorLast.ts';

export type Context = {
  cursorCache: Core;
  groupCursor: string;
  resultsPerPage: number;
};

export const validateCursor = async (
  { after, before, first, last }: ConnectionInputOptions,
  { fieldNodes }: GraphQLResolveInfo,
  { cursorCache, groupCursor, resultsPerPage }: Context
) => {
  if (after && !first && !last) {
    return new GraphQLError(
      'Invalid connection argument combination. `after` must be used in combination with `first`.',
      { nodes: fieldNodes }
    );
  }

  if (after && last) {
    return new GraphQLError(
      'Invalid connection argument combination. `after` cannot be used in combination with `last`.',
      { nodes: fieldNodes }
    );
  }

  if (before && !last && !first) {
    return new GraphQLError(
      'Invalid connection argument combination. `before` must be used in combination with `last`.',
      { nodes: fieldNodes }
    );
  }

  if (before && first) {
    return new GraphQLError(
      'Invalid connection argument combination. `before` cannot be used in combination with `first`.',
      { nodes: fieldNodes }
    );
  }

  const metadata = await cursorCache.get<CursorGroupMetadata>(`${groupCursor}-metadata`);

  if (!metadata) {
    return new GraphQLError('Curser cannot be supplied without previously being provided.', { nodes: fieldNodes });
  }

  const cursor = getCursor({ after, before })!;
  const entry = await cursorCache.get<CursorCacheEntry>(cursor);

  if (!entry) {
    return new GraphQLError(`The cursor ${cursor} could not be found.`, { nodes: fieldNodes });
  }

  const direction = getDirection(last);

  if (isCursorLast({ direction, entry, resultsPerPage, ...metadata })) {
    return new GraphQLError(`The cursor ${cursor} is the last, you cannot go forward any further.`, {
      nodes: fieldNodes,
    });
  }

  if (isCursorFirst({ direction, entry })) {
    return new GraphQLError(`The cursor ${cursor} is the first, you cannot go backward any further.`, {
      nodes: fieldNodes,
    });
  }

  return;
};
