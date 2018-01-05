import { Cacheability } from "cacheability";
import parseCacheabilityObjectMap from "../parse-cacheability-object-map";
import { CacheMetadata, CreateCacheMetadataArgs } from "../../types";

export default function createCacheMetadata(args?: CreateCacheMetadataArgs): CacheMetadata {
  const _args = args || {};
  if (_args.cacheMetadata) return parseCacheabilityObjectMap(_args.cacheMetadata);
  const cacheControl = _args.headers && _args.headers.get("cache-control");
  if (!cacheControl) return new Map();
  const cacheability = new Cacheability();
  cacheability.parseCacheControl(cacheControl);
  const _cacheMetadata = new Map();
  _cacheMetadata.set("query", cacheability);
  return _cacheMetadata;
}
