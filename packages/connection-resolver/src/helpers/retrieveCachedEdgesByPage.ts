import Cachemap, { ExportResult } from "@cachemap/core";
import { Edge } from "../defs";

export type Context = {
  groupCursor: string;
  pageNumber: number;
};

export default async (cursorCache: Cachemap, { groupCursor, pageNumber }: Context) => {
  const { entries, metadata } = (await cursorCache.export({
    filterByValue: [
      { keyChain: "page", comparator: pageNumber },
      { keyChain: "group", comparator: groupCursor },
    ],
  })) as ExportResult;

  return {
    edges: entries.reduce((cached, [key, { index, node }]) => {
      if (metadata[index].cacheability.checkTTL()) {
        cached[index] = { cursor: key, node };
      }

      return cached;
    }, [] as Edge[]),
    pageNumber,
  };
};
