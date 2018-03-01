import { Cacheability } from "cacheability";
import { DehydratedCacheMetadata } from "../../types";

export default function dehydrateCacheMetadata(map?: Map<string, Cacheability>): DehydratedCacheMetadata {
  const obj: DehydratedCacheMetadata = {};
  if (!map) return obj;

  map.forEach((cacheability, key) => {
    obj[key] = cacheability.metadata;
  });

  return obj;
}
