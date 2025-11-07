import { type Core } from '@cachemap/core';
import {
  type CacheMetadata,
  type FieldPaths,
  type OperationContext,
  type OperationData,
  type ResponseData,
} from '@graphql-box/core';
import { ArgsError, GroupedError, hashRequest } from '@graphql-box/helpers';
import { Cacheability, type Metadata as CacheabilityMetadata } from 'cacheability';
import { print } from 'graphql';
import { get, has, set } from 'lodash-es';
import { type SetRequired } from 'type-fest';
import { filterQuery } from './helpers/filterQuery.ts';
import { type AnalyzeQueryResult, type CacheManagerDef, type UserOptions } from './types.ts';

export class CacheManager implements CacheManagerDef {
  private _cache: Core | undefined;
  private readonly _hashCacheKeys: boolean;

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

    this._hashCacheKeys = options.hashCacheKeys ?? false;
  }

  public async analyzeQuery(
    operationData: OperationData,
    context: SetRequired<OperationContext, 'fieldPaths'>,
  ): Promise<AnalyzeQueryResult> {
    const { ast } = operationData;

    const { allPathsResolved, cacheMetadata, data, resolvedPaths } = await this._retrieveResponseData(
      context.fieldPaths,
    );

    if (resolvedPaths.length === 0) {
      return { operationData };
    }

    if (allPathsResolved) {
      return { responseData: { __cacheMetadata: cacheMetadata, data } };
    }

    const filteredAst = filterQuery(ast, resolvedPaths);
    const filteredOperation = print(filteredAst);

    return {
      operationData: {
        ast: filteredAst,
        hash: hashRequest(filteredOperation),
        operation: filteredOperation,
      },
    };
  }

  get cache(): Core | undefined {
    return this._cache;
  }

  public async cacheQuery(
    responseData: ResponseData,
    context: SetRequired<OperationContext, 'fieldPaths'>,
  ): Promise<void> {
    await this._storeResponseData(responseData, context.fieldPaths);
  }

  get hashCacheKeys(): boolean {
    return this._hashCacheKeys;
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
      for (const [index, cachePath] of cachePaths.entries()) {
        const cacheability = await this._cache?.has(cachePath, { hashKey: this._hashCacheKeys });
        const cacheEntryValid = !!cacheability && cacheability.checkTTL();

        if (!cacheEntryValid) {
          continue;
        }

        const cachedData = await this._cache?.get(cachePath, { hashKey: this._hashCacheKeys });
        const matchingResponsePath = responsePaths[index];

        if (!matchingResponsePath) {
          throw new Error(
            `Your context has got corrupted. No matching response path was found for cache path "${cachePath}", but it is part of a response path group for which data should exist.`,
          );
        }

        set(cachedResponseData, matchingResponsePath, cachedData);

        if (!has(cacheMetadata, operationPath)) {
          cacheMetadata[operationPath] = cacheability.metadata;
        }

        resolvedOperationPaths.push(operationPath);
      }
    }

    return {
      allPathsResolved: fieldPathEntries.length === resolvedOperationPaths.length,
      cacheMetadata,
      data: cachedResponseData,
      resolvedPaths: resolvedOperationPaths,
    };
  }

  private async _storeResponseData({ __cacheMetadata, data }: ResponseData, fieldPaths: FieldPaths): Promise<void> {
    const fieldPathEntries = Object.entries(fieldPaths);
    const cacheSetPromises: Promise<void>[] = [];

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

        const matchingMetadata = __cacheMetadata?.[operationPath];

        if (!matchingMetadata) {
          throw new Error(
            `Your response data has got corrupted. No matching cache metadata was found for operation path "${operationPath}".`,
          );
        }

        if (this._cache) {
          cacheSetPromises.push(
            this._cache.set(matchingCachePath, value, {
              cacheHeaders: { cacheControl: new Cacheability({ metadata: matchingMetadata }).printCacheControl() },
              hashKey: this._hashCacheKeys,
            }),
          );
        }
      }
    }

    await Promise.all(cacheSetPromises);
  }
}
