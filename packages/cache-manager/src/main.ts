import { type Core } from '@cachemap/core';
import {
  type CacheMetadata,
  type FieldPaths,
  type RequestContext,
  type RequestData,
  type ResponseData,
} from '@graphql-box/core';
import { ArgsError, GroupedError, hashRequest } from '@graphql-box/helpers';
import { Cacheability, type Metadata as CacheabilityMetadata } from 'cacheability';
import { print } from 'graphql';
import { get, has, set } from 'lodash-es';
import { filterQuery } from './helpers/filterQuery.ts';
import { type AnalyzeQueryResult, type CacheManagerDef, type UserOptions } from './types.ts';

export class CacheManager implements CacheManagerDef {
  private _cache: Core | undefined;

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    if (!('cache' in options)) {
      errors.push(new ArgsError('Expected "cache" to be in options.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('Argument validation errors', errors);
    }

    if (typeof options.cache === 'function') {
      void options
        .cache()
        .then(cache => {
          this._cache = cache;
        })
        .catch((error: unknown) => {
          throw error;
        });
    } else {
      this._cache = options.cache;
    }
  }

  public async analyzeQuery(requestData: RequestData, context: RequestContext): Promise<AnalyzeQueryResult> {
    const { ast } = requestData;

    const { allPathsResolved, cacheMetadata, data, resolvedPaths } = await this._retrieveResponseData(
      context.fieldPaths,
    );

    if (resolvedPaths.length === 0) {
      return { updated: requestData };
    }

    if (allPathsResolved) {
      return { response: { cacheMetadata, data } };
    }

    const filteredAst = filterQuery(ast, resolvedPaths);
    const filteredRequest = print(filteredAst);

    return {
      updated: {
        ast: filteredAst,
        hash: hashRequest(filteredRequest),
        request: filteredRequest,
      },
    };
  }

  get cache(): Core | undefined {
    return this._cache;
  }

  public cacheQuery(responseData: ResponseData, context: RequestContext): void {
    this._storeResponseData(responseData, context.fieldPaths);
  }

  private async _retrieveResponseData(fieldPaths: FieldPaths): Promise<{
    allPathsResolved: boolean;
    cacheMetadata: CacheMetadata;
    data: Record<string, unknown>;
    resolvedPaths: string[];
  }> {
    const cachedResponseData: Record<string, unknown> = {};
    const cacheMetadata: Record<string, CacheabilityMetadata> = {};
    const resolvedOperationPaths: string[] = [];
    const fieldPathEntries = Object.entries(fieldPaths);

    for (const [operationPath, { cachePaths, responsePaths }] of fieldPathEntries) {
      let hasCachedData = false;

      for (const [index, cachePath] of cachePaths.entries()) {
        const cacheability = await this._cache?.has(cachePath);
        const cacheEntryValid = !!cacheability && cacheability.checkTTL();

        if (!cacheEntryValid && !hasCachedData) {
          continue;
        }

        if (!cacheEntryValid && hasCachedData) {
          throw new Error(
            `Your cache has got corrupted. Cache path "${cachePath}" returned no data, but it is part of a cache path group for which data should exist.`,
          );
        }

        if (cacheEntryValid && !hasCachedData) {
          hasCachedData = true;
          resolvedOperationPaths.push(operationPath);
        }

        const cachedData = await this._cache?.get(cachePath);
        const matchingResponsePath = responsePaths[index];

        if (!matchingResponsePath) {
          throw new Error(
            `Your context has got corrupted. No matching response path was found for cache path "${cachePath}", but it is part of a response path group for which data should exist.`,
          );
        }

        set(cachedResponseData, matchingResponsePath, cachedData);

        if (!has(cacheMetadata, operationPath) && cacheability) {
          set(cacheMetadata, operationPath, cacheability.metadata);
        }
      }
    }

    return {
      allPathsResolved: fieldPathEntries.length === resolvedOperationPaths.length,
      cacheMetadata,
      data: cachedResponseData,
      resolvedPaths: resolvedOperationPaths,
    };
  }

  private _storeResponseData({ cacheMetadata, data }: ResponseData, fieldPaths: FieldPaths): void {
    const fieldPathEntries = Object.entries(fieldPaths);

    for (const [operationPath, { cachePaths, responsePaths }] of fieldPathEntries) {
      for (const [index, responsePath] of responsePaths.entries()) {
        const value = get(data, responsePath);

        if (value === undefined) {
          throw new Error(`Response data value undefined for response path "${responsePath}"`);
        }

        const matchingCachePath = cachePaths[index];

        if (!matchingCachePath) {
          throw new Error(
            `Your context has got corrupted. No matching cache path was found for response path "${responsePath}", but it is part of a cache path group for which data should exist.`,
          );
        }

        const matchingMetadata = cacheMetadata?.[operationPath];

        if (!matchingMetadata) {
          throw new Error(
            `Your response data has got corrupted. No matching cache metadata was found for operation path "${operationPath}".`,
          );
        }

        void this._cache?.set(matchingCachePath, value, {
          cacheHeaders: { cacheControl: new Cacheability({ metadata: matchingMetadata }).printCacheControl() },
        });
      }
    }
  }
}
