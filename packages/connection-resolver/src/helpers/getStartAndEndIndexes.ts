import { ConnectionInputOptions, CursorCacheEntry, CursorGroupMetadata } from "../defs";
import getCount from "./getCount";
import getDirection from "./getDirection";
import getIndexesOnLastPage from "./getIndexesOnLastPage";
import isFirstPage from "./isFirstPage";
import isLastPage from "./isLastPage";

export type Context = {
  entry: CursorCacheEntry;
  metadata: CursorGroupMetadata;
  resultsPerPage: number;
};

export const getStartIndex = (args: ConnectionInputOptions, { entry }: Context): number => {
  const count = getCount(args);

  return getDirection(args.before) === "forward"
    ? entry.index + 1
    : isFirstPage(entry.page) && entry.index - count < 0
    ? 0
    : entry.index - count;
};

export const getEndIndex = (args: ConnectionInputOptions, { entry, metadata, resultsPerPage }: Context): number => {
  const count = getCount(args);
  const indexesOnLastPage = getIndexesOnLastPage({ resultsPerPage, totalResults: metadata.totalResults });

  return getDirection(args.before) === "backward"
    ? entry.index - 1
    : isLastPage({ page: entry.page, totalPages: metadata.totalPages }) && entry.index + count > indexesOnLastPage
    ? indexesOnLastPage
    : entry.index + count;
};
