import Cachemap from "@cachemap/core";
import { Edge } from "../defs";

export type Params = {
  edges: Edge[];
  group: string;
  headers: Headers;
  page: number;
  totalPages: number;
  totalResults: number;
};

export default (cursorCache: Cachemap, { edges, group, headers, page, totalPages, totalResults }: Params) => {
  const cacheControl = headers.get("cache-control");
  const opts = cacheControl ? { cacheHeaders: { cacheControl } } : undefined;

  edges.forEach(({ cursor, node }, index) => {
    cursorCache.set(cursor, { node, index, group, page }, opts);
  });

  cursorCache.set(`${group}-metadata`, { totalPages, totalResults }, opts);
};
