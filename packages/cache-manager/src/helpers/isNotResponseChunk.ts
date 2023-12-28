import { type RawResponseDataWithMaybeCacheMetadata } from '@graphql-box/core';
import { type CacheManagerContext } from '../types.ts';

export const isNotResponseChunk = (
  rawResponseData: RawResponseDataWithMaybeCacheMetadata,
  context: CacheManagerContext
) => !context.hasDeferOrStream && !rawResponseData.hasNext && !rawResponseData.paths;
