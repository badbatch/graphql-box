import Cacheability from "cacheability";
import { CacheabilityObjectMap, CacheMetadata } from "../../types";

export default function parseCacheabilityObjectMap(cacheabilityObjectMap: CacheabilityObjectMap): CacheMetadata {
  const cacheMetadata: CacheMetadata = new Map();

  Object.keys(cacheabilityObjectMap).forEach((key) => {
    const cacheability = new Cacheability();
    cacheability.metadata = cacheabilityObjectMap[key];
    cacheMetadata.set(key, cacheability);
  });

  return cacheMetadata;
}
