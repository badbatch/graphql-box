import { type Core } from '@cachemap/core';
import {
  type CacheMetadata,
  type FieldPaths,
  type OperationContext,
  type OperationData,
  type ResponseData,
} from '@graphql-box/core';
import { ArgsError, GroupedError, hashOperation } from '@graphql-box/helpers';
import { Cacheability, type Metadata as CacheabilityMetadata } from 'cacheability';
import { print } from 'graphql';
import { get, has, set } from 'lodash-es';
import { type SetRequired } from 'type-fest';
import { filterQuery } from './helpers/filterQuery.ts';
import { type AnalyzeQueryResult, type CacheManagerDef, type UserOptions } from './types.ts';

export class CacheManager implements CacheManagerDef {
  private _cache: Core | undefined;
  private readonly _fallbackCacheControlDirectives: string;
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

    this._fallbackCacheControlDirectives =
      options.fallbackCacheControlDirectives ?? 'no-cache, max-age=0, must-revalidate';

    this._hashCacheKeys = options.hashCacheKeys ?? false;
  }

  public async analyzeQuery(
    operationData: OperationData,
    context: SetRequired<OperationContext, 'fieldPaths'>,
  ): Promise<AnalyzeQueryResult> {
    const { ast } = operationData;
    const { cacheMetadata, data, rejectedPaths, resolvedPaths } = await this._retrieveResponseData(context.fieldPaths);

    if (resolvedPaths.length === 0) {
      return { operationData };
    }

    if (rejectedPaths.length === 0) {
      return { responseData: { __cacheMetadata: cacheMetadata, data } };
    }

    const filteredAst = filterQuery(ast, resolvedPaths);
    const filteredOperation = print(filteredAst);

    return {
      operationData: {
        ast: filteredAst,
        hash: hashOperation(filteredOperation),
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
    cacheMetadata: CacheMetadata;
    data: Record<string, unknown>;
    rejectedPaths: string[];
    resolvedPaths: string[];
  }> {
    const cachedResponseData: Record<string, unknown> = {};
    const cacheMetadata: Record<string, CacheabilityMetadata> = {};
    const resolvedOperationPaths: string[] = [];
    const rejectedOperationPaths: string[] = [];
    const fieldPathEntries = Object.entries(fieldPaths);

    for (const [operationPath, { cachePaths, responsePaths }] of fieldPathEntries) {
      for (const [index, cachePath] of cachePaths.entries()) {
        const cacheability = await this._cache?.has(cachePath, { hashKey: this._hashCacheKeys });
        const cacheEntryValid = !!cacheability && cacheability.checkTTL();

        if (!cacheEntryValid) {
          rejectedOperationPaths.push(operationPath);
          continue;
        }

        const cachedData = await this._cache?.get(cachePath, { hashKey: this._hashCacheKeys });
        const matchingResponsePath = responsePaths[index];

        if (!matchingResponsePath) {
          console.error(
            `Your context has got corrupted. No matching response path was found for cache path "${cachePath}", but it is part of a response path group for which data should exist.`,
          );

          rejectedOperationPaths.push(operationPath);
          continue;
        }

        if (matchingResponsePath) {
          set(cachedResponseData, matchingResponsePath, cachedData);

          if (!has(cacheMetadata, operationPath)) {
            cacheMetadata[operationPath] = cacheability.metadata;
          }
        }

        resolvedOperationPaths.push(operationPath);
      }
    }

    return {
      cacheMetadata,
      data: cachedResponseData,
      rejectedPaths: rejectedOperationPaths,
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
          console.error(`Response data value undefined for response path "${responsePath}"`);
          continue;
        }

        const matchingCachePath = cachePaths[index];

        if (!matchingCachePath) {
          console.error(
            `Your context has got corrupted. No matching cache path was found for response path "${responsePath}", but it is part of a cache path group for which data should exist.`,
          );

          continue;
        }

        const matchingMetadata = __cacheMetadata?.[operationPath];

        if (!matchingMetadata) {
          console.error(
            `Your response data has got corrupted. No matching cache metadata was found for operation path "${operationPath}".`,
          );
        }

        if (this._cache) {
          cacheSetPromises.push(
            this._cache.set(matchingCachePath, value, {
              cacheHeaders: {
                cacheControl: matchingMetadata
                  ? new Cacheability({ metadata: matchingMetadata }).printCacheControl()
                  : this._fallbackCacheControlDirectives,
              },
              hashKey: this._hashCacheKeys,
            }),
          );
        }
      }
    }

    await Promise.all(cacheSetPromises);
  }
}
