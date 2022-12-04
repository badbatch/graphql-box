import {
  CacheMetadata,
  DehydratedCacheMetadata,
  IncrementalRequestResult,
  RequestResult,
  SerializedIncrementalRequestResult,
  SerializedRequestResult,
} from "@graphql-box/core";
import { GraphQLError } from "graphql";
import { dehydrateCacheMetadata, rehydrateCacheMetadata } from "../cache-metadata";
import { deserializeError, serializeError } from "../serializeErrors";

const deserializeCacheMetadataWrapper = (
  result: SerializedRequestResult | SerializedIncrementalRequestResult,
):
  | (Omit<SerializedRequestResult, "_cacheMetadata"> & { _cacheMetadata?: CacheMetadata })
  | (Omit<SerializedIncrementalRequestResult, "_cacheMetadata"> & { _cacheMetadata?: CacheMetadata }) => {
  if ("_cacheMetadata" in result && result._cacheMetadata) {
    return {
      ...result,
      _cacheMetadata: rehydrateCacheMetadata(result._cacheMetadata),
    };
  }

  return result as
    | (Omit<SerializedRequestResult, "_cacheMetadata"> & { _cacheMetadata?: CacheMetadata })
    | (Omit<SerializedIncrementalRequestResult, "_cacheMetadata"> & { _cacheMetadata?: CacheMetadata });
};

const deserializeErrorWrapper = (
  result:
    | (Omit<SerializedRequestResult, "_cacheMetadata"> & { _cacheMetadata?: CacheMetadata })
    | (Omit<SerializedIncrementalRequestResult, "_cacheMetadata"> & { _cacheMetadata?: CacheMetadata }),
): RequestResult | IncrementalRequestResult => {
  if ("errors" in result) {
    return {
      ...result,
      errors: (result.errors?.map(e => deserializeError(e)) ?? []) as readonly GraphQLError[],
    };
  }

  return result as RequestResult | IncrementalRequestResult;
};

export const deserializeResult = (
  result: SerializedRequestResult | SerializedIncrementalRequestResult,
): RequestResult | IncrementalRequestResult => deserializeErrorWrapper(deserializeCacheMetadataWrapper(result));

const serializeCacheMetadataWrapper = (
  result: RequestResult | IncrementalRequestResult,
):
  | (Omit<RequestResult, "_cacheMetadata"> & { _cacheMetadata?: DehydratedCacheMetadata })
  | (Omit<IncrementalRequestResult, "_cacheMetadata"> & { _cacheMetadata?: DehydratedCacheMetadata }) => {
  if ("_cacheMetadata" in result && result._cacheMetadata) {
    return {
      ...result,
      _cacheMetadata: dehydrateCacheMetadata(result._cacheMetadata),
    };
  }

  return result as
    | (Omit<RequestResult, "_cacheMetadata"> & { _cacheMetadata?: DehydratedCacheMetadata })
    | (Omit<IncrementalRequestResult, "_cacheMetadata"> & { _cacheMetadata?: DehydratedCacheMetadata });
};

const serializeErrorWrapper = (
  result:
    | (Omit<RequestResult, "_cacheMetadata"> & { _cacheMetadata?: DehydratedCacheMetadata })
    | (Omit<IncrementalRequestResult, "_cacheMetadata"> & { _cacheMetadata?: DehydratedCacheMetadata }),
): SerializedRequestResult | SerializedIncrementalRequestResult => {
  if ("errors" in result) {
    return {
      ...result,
      errors: result.errors?.map(e => serializeError(e)) ?? [],
    };
  }

  return result as SerializedRequestResult | SerializedIncrementalRequestResult;
};

export const serializeResult = (
  result: RequestResult | IncrementalRequestResult,
): SerializedRequestResult | SerializedIncrementalRequestResult =>
  serializeErrorWrapper(serializeCacheMetadataWrapper(result));
