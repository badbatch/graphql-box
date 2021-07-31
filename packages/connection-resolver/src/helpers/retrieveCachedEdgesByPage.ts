import Cachemap, { ExportResult } from "@cachemap/core";
import { Edge } from "../defs";

export type Options = {
  group: string;
  page: number;
};

export default async (cursorCache: Cachemap, options: Options) => {
  const { group, page } = options;

  const { entries, metadata } = (await cursorCache.export({
    filterByValue: [
      { keyChain: "page", comparator: page },
      { keyChain: "group", comparator: group },
    ],
  })) as ExportResult;

  return entries.reduce((cached, [key, { index, node }]) => {
    if (metadata[index].cacheability.checkTTL()) {
      cached[index] = { cursor: key, node };
    }

    return cached;
  }, [] as Edge[]);
};
