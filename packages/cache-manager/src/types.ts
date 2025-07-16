import { type Core } from '@cachemap/core';
import { type RequestContext, type RequestData, type ResponseData } from '@graphql-box/core';

export interface UserOptions {
  /**
   * The cache instance.
   */
  cache: Core | (() => Promise<Core>);
}

export interface AnalyzeQueryResult {
  response?: ResponseData;
  updated?: RequestData;
}

export interface CacheManagerDef {
  analyzeQuery(requestData: RequestData, context: RequestContext): Promise<AnalyzeQueryResult>;
  cache: Core | undefined;
  cacheQuery(responseData: ResponseData, context: RequestContext): void;
}
