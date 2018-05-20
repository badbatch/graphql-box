import { Cacheability } from "cacheability";
import rehydrateCacheMetadata from "../rehydrate-cache-metadata";
import { CacheMetadata, CreateCacheMetadataArgs } from "../../types";

export default function createCacheMetadata(args: CreateCacheMetadataArgs = {}): CacheMetadata {
  if (args.cacheMetadata) return rehydrateCacheMetadata(args.cacheMetadata);
  const cacheControl = args.headers && args.headers.get("cache-control");
  if (!cacheControl) return new Map();
  const cacheability = new Cacheability();
  cacheability.parseCacheControl(cacheControl);
  const cacheMetadata = new Map();
  const operation = args.operation || "query";
  cacheMetadata.set(operation, cacheability);
  return cacheMetadata;
}
