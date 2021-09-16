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

export default async (cursorCache: Cachemap, { edges, group, headers, page, totalPages, totalResults }: Params) => {
  const cacheControl = headers.get("cache-control");
  const opts = cacheControl ? { cacheHeaders: { cacheControl } } : undefined;

  await Promise.all(
    edges.map(async ({ cursor, node }, index) => {
      await cursorCache.set(cursor, { node, index, group, page }, opts);
    }),
  );

  await cursorCache.set(`${group}-metadata`, { totalPages, totalResults }, opts);
};
