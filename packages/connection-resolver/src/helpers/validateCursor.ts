import Cachemap from "@cachemap/core";
import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { ConnectionInputOptions, CursorCacheEntry, CursorGroupMetadata } from "../defs";
import getCursor from "./getCursor";
import getDirection from "./getDirection";
import isCursorFirst from "./isCursorFirst";
import isCursorLast from "./isCursorLast";

export type Context = {
  cursorCache: Cachemap;
  groupCursor: string;
  resultsPerPage: number;
};

export default async (
  { after, before, first, last }: ConnectionInputOptions,
  { fieldNodes }: GraphQLResolveInfo,
  { cursorCache, groupCursor, resultsPerPage }: Context,
) => {
  if (after && !first && !last) {
    return new GraphQLError(
      "Invalid connection argument combination. `after` must be used in combination with `first`.",
      fieldNodes,
    );
  }

  if (after && last) {
    return new GraphQLError(
      "Invalid connection argument combination. `after` cannot be used in combination with `last`.",
      fieldNodes,
    );
  }

  if (before && !last && !first) {
    return new GraphQLError(
      "Invalid connection argument combination. `before` must be used in combination with `last`.",
      fieldNodes,
    );
  }

  if (before && first) {
    return new GraphQLError(
      "Invalid connection argument combination. `before` cannot be used in combination with `first`.",
      fieldNodes,
    );
  }

  const metadata = (await cursorCache.get(`${groupCursor}-metadata`)) as CursorGroupMetadata | undefined;

  if (!metadata) {
    return new GraphQLError("Curser cannot be supplied without previously being provided.", fieldNodes);
  }

  const cursor = getCursor({ after, before });
  const entry = (await cursorCache.get(cursor)) as CursorCacheEntry | undefined;

  if (!entry) {
    return new GraphQLError(`The cursor ${cursor} could not be found.`, fieldNodes);
  }

  const direction = getDirection(before);

  if (isCursorLast({ direction, entry, resultsPerPage, ...metadata })) {
    return new GraphQLError(`The cursor ${cursor} is the last, you cannot go forward any further.`, fieldNodes);
  }

  if (isCursorFirst({ direction, entry })) {
    return new GraphQLError(`The cursor ${cursor} is the first, you cannot go backward any further.`, fieldNodes);
  }

  return undefined;
};
