import Cacheability from "cacheability";
import { CacheabilityObjectMap } from "../../types";

export default function mapToObject(map: Map<any, Cacheability>): CacheabilityObjectMap {
  const obj: CacheabilityObjectMap = {};

  map.forEach((cacheability, key) => {
    obj[key] = cacheability.metadata;
  });

  return obj;
}
