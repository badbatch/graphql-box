import { type RawResponseDataWithMaybeCacheMetadata } from '@graphql-box/core';
import { type CacheManagerContext } from '../types.ts';

export const isNotLastResponseChunk = (
  rawResponseData: RawResponseDataWithMaybeCacheMetadata,
  context: CacheManagerContext,
) => context.hasDeferOrStream && rawResponseData.hasNext;
