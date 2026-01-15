import { type Core } from '@cachemap/core';
import {
  type CacheMetadata,
  type FieldPaths,
  type OperationContext,
  type OperationData,
  type ResponseData,
} from '@graphql-box/core';
import { ArgsError, GroupedError, hashOperation } from '@graphql-box/helpers';
import { type Metadata as CacheabilityMetadata } from 'cacheability';
import { print } from 'graphql';
import { has, set } from 'lodash-es';
import { type SetRequired } from 'type-fest';
import { buildOperationPathCacheKey } from '#helpers/buildOperationPathCacheKey.ts';
import { filterQuery } from './helpers/filterQuery.ts';
import { type AnalyzeQueryResult, type CacheManagerDef, type UserOptions } from './types.ts';

export class CacheManager implements CacheManagerDef {
  // @ts-expect-error cache is initialised in constructor
  private readonly _cache: Core;
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
          // @ts-expect-error cache is initialised in constructor
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
      return { kind: 'cache-miss', operationData };
    }

    if (rejectedPaths.length === 0) {
      return { kind: 'cache-hit', responseData: { __cacheMetadata: cacheMetadata, data } };
    }

    const filteredAst = filterQuery(ast, resolvedPaths);
    const filteredOperation = print(filteredAst);

    return {
      kind: 'partial',
      operationData: {
        ast: filteredAst,
        hash: hashOperation(filteredOperation),
        operation: filteredOperation,
      },
      resolvedFieldPaths: resolvedPaths,
    };
  }

  get cache(): Core | undefined {
    return this._cache;
  }

  public async cacheQuery(
    operationData: OperationData,
    responseData: ResponseData,
    context: SetRequired<OperationContext, 'fieldPaths'>,
  ): Promise<void> {
    await this._storeResponseData(operationData, responseData, context);
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

  // fieldAlias?: string;
  // fieldArgs?: PlainObject<unknown>;
  // hasArgs?: true;
  // isAbstract?: true;
  // isEntity?: true;
  // isLeaf?: true;
  // isList?: true;
  // leafEntity?: string;
  // typeConditions?: Set<string>;
  // typeName: string;

  private async _storeResponseData(
    operationData: OperationData,
    { __cacheMetadata, data }: ResponseData,
    { fieldPaths }: SetRequired<OperationContext, 'fieldPaths'>,
  ): Promise<void> {
    const fieldPathEntries = Object.entries(fieldPaths);
    const cacheWritePromises: Promise<void>[] = [this._writeOperation(operationData, fieldPaths)];

    for (const [operationPath, fieldPathMetadata] of fieldPathEntries) {
      const { hasArgs, isEntity, isList } = fieldPathMetadata;

      if (hasArgs || isList) {
        cacheWritePromises.push(this._writeOperationPath(/* args */));
      }

      if (isEntity) {
        cacheWritePromises.push(this._writeEntity(/* args */));
      }
    }

    await Promise.all(cacheWritePromises);
  }

  private async _writeEntity(): Promise<void> {
    // TODO
  }

  private async _writeOperation({ hash, operation }: OperationData, fieldPaths: FieldPaths): Promise<void> {
    const key = this._hashCacheKeys ? hash : operation.replaceAll('\n', ' ');
    const refs = new Set<string>();

    for (const [operationPath, { hasArgs, isList, isRootEntity }] of Object.entries(fieldPaths)) {
      if (hasArgs || isList || isRootEntity) {
        const operationPathCacheKey = buildOperationPathCacheKey(operationPath, fieldPaths);
        refs.add(operationPathCacheKey);
      }
    }

    return this._cache.set(`Operation:${key}`, {
      kind: 'operation',
      refs: [...refs],
    });
  }

  private async _writeOperationPath(): Promise<void> {
    // TODO
  }
}
