import { Cacheability } from "cacheability";
import rehydrateCacheMetadata from "../rehydrate-cache-metadata";
import { CacheMetadata, CreateCacheMetadataArgs } from "../../types";

export default function createCacheMetadata(args?: CreateCacheMetadataArgs): CacheMetadata {
  const _args = args || {};
  if (_args.cacheMetadata) return rehydrateCacheMetadata(_args.cacheMetadata);
  const cacheControl = _args.headers && _args.headers.get("cache-control");
  if (!cacheControl) return new Map();
  const cacheability = new Cacheability();
  cacheability.parseCacheControl(cacheControl);
  const cacheMetadata = new Map();
  cacheMetadata.set("query", cacheability);
  return cacheMetadata;
}
