import { type Core } from '@cachemap/core';
import {
  type CacheMetadata,
  type FieldPaths,
  type OperationContext,
  type OperationData,
  type PlainObject,
  type ResponseData,
} from '@graphql-box/core';
import { ArgsError, GroupedError, hashOperation, sortFieldPathEntries } from '@graphql-box/helpers';
import { type Metadata as CacheabilityMetadata } from 'cacheability';
import { print } from 'graphql';
import { set } from 'lodash-es';
import { type SetRequired } from 'type-fest';
import { buildOperationPathCacheKey } from '#helpers/buildOperationPathCacheKey.ts';
import { buildResponseDataKey } from '#helpers/buildResponseDataPath.ts';
import { normaliseResponseData } from '#helpers/normaliseResponseData.ts';
import { filterQuery } from './helpers/filterQuery.ts';
import {
  type AnalyzeQueryResult,
  type CacheManagerDef,
  type EntityCacheEntry,
  type OperationCacheEntry,
  type OperationPathCacheEntry,
  type RetrieveCacheEntryResult,
  type UserOptions,
} from './types.ts';

export class CacheManager implements CacheManagerDef {
  // @ts-expect-error cache is initialised in constructor
  private readonly _cache: Core;
  private readonly _fallbackCacheControlDirectives: string;
  private readonly _hashCacheKeys: boolean;
  private _idKey = 'id';

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

    const {
      data,
      extensions,
      kind,
      resolvedPaths = [],
    } = await this._retrieveResponseData(operationData, context.fieldPaths);

    if (kind === 'miss') {
      return { kind: 'cache-miss', operationData };
    }

    if (kind === 'hit') {
      return { kind: 'cache-hit', responseData: { data, extensions } };
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

  set idKeys(idKey: string) {
    this._idKey = idKey;
  }

  private async _readEntity(key: string): Promise<EntityCacheEntry | undefined> {
    const cacheKey = `Entity:${key}`;

    const cacheEntry = await this._cache.get<EntityCacheEntry>(cacheKey, {
      hashKey: this._hashCacheKeys,
    });

    const entryMetadata = this._cache.getMetadataEntry(cacheKey, { hashKey: this._hashCacheKeys });

    if (!(cacheEntry && entryMetadata)) {
      return;
    }

    cacheEntry.extensions.cacheability = entryMetadata.cacheability.metadata;
    return cacheEntry;
  }

  private async _readOperation(operation: string): Promise<OperationCacheEntry | undefined> {
    const cacheKey = `Operation:${operation.replaceAll('\n', ' ')}`;

    const cacheEntry = await this._cache.get<OperationCacheEntry>(cacheKey, {
      hashKey: this._hashCacheKeys,
    });

    const entryMetadata = this._cache.getMetadataEntry(cacheKey, { hashKey: this._hashCacheKeys });

    if (!(cacheEntry && entryMetadata)) {
      return;
    }

    cacheEntry.extensions.cacheability = entryMetadata.cacheability.metadata;
    return cacheEntry;
  }

  private async _readOperationPath(key: string): Promise<OperationPathCacheEntry | undefined> {
    const cacheKey = `OperationPath:${key}`;

    const cacheEntry = await this._cache.get<OperationPathCacheEntry>(cacheKey, {
      hashKey: this._hashCacheKeys,
    });

    const entryMetadata = this._cache.getMetadataEntry(cacheKey, { hashKey: this._hashCacheKeys });

    if (!(cacheEntry && entryMetadata)) {
      return;
    }

    cacheEntry.extensions.cacheability = entryMetadata.cacheability.metadata;
    return cacheEntry;
  }

  private async _retrieveEntityData(cacheKey: string): Promise<RetrieveCacheEntryResult> {
    const entityCacheEntry = await this._readEntity(cacheKey);

    if (!entityCacheEntry) {
      console.debug(`Unable to retrieve entity for cache key "${cacheKey}"`);
      return { kind: 'miss' };
    }

    const { extensions, refTargets, value } = entityCacheEntry;
    const { cacheability, ...restExtensions } = extensions;
    const refTargetEntries = Object.entries(refTargets);

    let cacheMetadata: CacheMetadata = {
      [cacheKey]: cacheability,
    };

    const entity = structuredClone(value);

    if (refTargetEntries.length === 0) {
      return { extensions: { ...restExtensions, cacheMetadata }, kind: 'hit', value: entity };
    }

    for (const [ref, responseKeys] of refTargetEntries) {
      const result = await this._retrieveEntityData(ref);

      if (result.kind === 'miss') {
        console.debug(`Unable to retrieve entity, no data for entity cache key "${ref}"`);
        return { kind: 'miss' };
      }

      cacheMetadata = {
        ...cacheMetadata,
        ...result.extensions.cacheMetadata,
      };

      for (const responseKey of responseKeys) {
        set(entity, responseKey, result.value);
      }
    }

    return {
      extensions: { cacheMetadata, ...restExtensions },
      kind: 'hit',
      value: entity,
    };
  }

  private async _retrieveOperationData(cacheKey: string): Promise<RetrieveCacheEntryResult<PlainObject>> {
    const operationCacheEntry = await this._readOperation(cacheKey);

    if (!operationCacheEntry) {
      console.debug(`Unable to retrieve operation data for cache key "${cacheKey}"`);
      return { kind: 'miss' };
    }

    const { extensions, refTargets } = operationCacheEntry;
    const { cacheability, ...restExtensions } = extensions;
    const data: PlainObject = {};

    let cacheMetadata: CacheMetadata = {
      [cacheKey]: cacheability,
    };

    for (const [ref, responseKeys] of Object.entries(refTargets)) {
      const result = await this._retrieveOperationPathData(ref);

      if (result.kind === 'miss') {
        console.debug(`Unable to retrieve operation data, no data for operation path cache key "${ref}"`);
        return { kind: 'miss' };
      }

      cacheMetadata = {
        ...cacheMetadata,
        ...result.extensions.cacheMetadata,
      };

      for (const responseKey of responseKeys) {
        set(data, responseKey, result.value);
      }
    }

    return {
      extensions: { cacheMetadata, ...restExtensions },
      kind: 'hit',
      value: data,
    };
  }

  private async _retrieveOperationPathData(cacheKey: string): Promise<RetrieveCacheEntryResult> {
    const operationPathCacheEntry = await this._readOperationPath(cacheKey);

    if (!operationPathCacheEntry) {
      console.debug(`Unable to retrieve operation data, no data for operation path cache key "${cacheKey}"`);
      return { kind: 'miss' };
    }

    const { extensions, refTargets, value } = operationPathCacheEntry;
    const { cacheability, ...restExtensions } = extensions;
    const refTargetEntries = Object.entries(refTargets);

    let cacheMetadata: CacheMetadata = {
      [cacheKey]: cacheability,
    };

    if (refTargetEntries.length === 0) {
      return {
        extensions: { cacheMetadata, ...restExtensions },
        kind: 'hit',
        value: structuredClone(value),
      };
    }

    // @ts-expect-error if refTargetEntries.length is greater than 0, it means
    // the value will definitely be an object.
    const newValue = structuredClone<PlainObject<unknown>>(value);

    for (const [ref, responseKeys] of refTargetEntries) {
      const result = await this._retrieveEntityData(ref);

      if (result.kind === 'miss') {
        console.debug(`Unable to retrieve operation path data, no data for entity cache key "${ref}"`);
        return { kind: 'miss' };
      }

      cacheMetadata = {
        ...cacheMetadata,
        ...result.extensions.cacheMetadata,
      };

      for (const responseKey of responseKeys) {
        set(newValue, responseKey, result.value);
      }
    }

    return {
      extensions: { cacheMetadata, ...restExtensions },
      kind: 'hit',
      value: newValue,
    };
  }

  private async _retrieveResponseData(
    { hash }: OperationData,
    fieldPaths: FieldPaths,
  ): Promise<{
    data: Record<string, unknown>;
    extensions: { cacheMetadata: CacheMetadata };
    kind: 'hit' | 'miss' | 'partial';
    rejectedPaths?: string[];
    resolvedPaths?: string[];
  }> {
    const resolvedOperationPaths = new Set<string>();
    const rejectedOperationPaths = new Set<string>();
    const cachedResponseData: Record<string, unknown> = {};
    const sortedFieldPathEntries = Object.entries(fieldPaths).sort(sortFieldPathEntries('asc'));
    const result = await this._retrieveOperationData(hash);

    if (result.kind === 'hit') {
      return {
        data: result.value,
        extensions: result.extensions,
        kind: 'hit',
      };
    }

    let cacheMetadata: CacheMetadata = {};

    for (const [operationPath, { hasArgs, isList, isRootEntity }] of sortedFieldPathEntries) {
      if (!(hasArgs || isList || isRootEntity)) {
        continue;
      }

      const operationPathCacheKey = buildOperationPathCacheKey(operationPath, fieldPaths);
      const responseKey = buildResponseDataKey(operationPath, fieldPaths);
      const operationPathResult = await this._retrieveOperationPathData(operationPathCacheKey);

      if (operationPathResult.kind === 'hit') {
        cacheMetadata = {
          ...cacheMetadata,
          ...operationPathResult.extensions.cacheMetadata,
        };

        set(cachedResponseData, responseKey, operationPathResult.value);
        resolvedOperationPaths.add(operationPath);
      } else {
        rejectedOperationPaths.add(operationPath);
      }
    }

    return {
      data: cachedResponseData,
      extensions: { cacheMetadata },
      kind: rejectedOperationPaths.size === 0 ? 'hit' : resolvedOperationPaths.size === 0 ? 'miss' : 'partial',
      rejectedPaths: [...rejectedOperationPaths],
      resolvedPaths: [...resolvedOperationPaths],
    };
  }

  private async _storeResponseData(
    { operation }: OperationData,
    { data, extensions }: ResponseData,
    { data: contextData, fieldPaths }: SetRequired<OperationContext, 'fieldPaths'>,
  ): Promise<void> {
    const { entities, operationPaths } = normaliseResponseData(data, fieldPaths, {
      idKey: this._idKey,
    });

    const { cacheMetadata } = extensions;

    const cacheWritePromises: Promise<void>[] = [
      this._writeOperation(operation, Object.keys(operationPaths), cacheMetadata[contextData.operationType]),
    ];

    for (const [entityCacheKey, entityCacheEntry] of Object.entries(entities)) {
      cacheWritePromises.push(this._writeEntity(entityCacheKey, entityCacheEntry, cacheMetadata[entityCacheKey]));
    }

    for (const [operationPathCacheKey, operationPathCacheEntry] of Object.entries(operationPaths)) {
      cacheWritePromises.push(
        this._writeOperationPath(operationPathCacheKey, operationPathCacheEntry, cacheMetadata[operationPathCacheKey]),
      );
    }

    await Promise.all(cacheWritePromises);
  }

  private async _writeEntity(
    cacheKey: string,
    cacheEntry: EntityCacheEntry,
    cacheMetadata?: CacheabilityMetadata,
  ): Promise<void> {
    return this._cache.set(`Entity:${cacheKey}`, cacheEntry, {
      cacheOptions: cacheMetadata
        ? {
            metadata: cacheMetadata,
          }
        : {
            cacheControl: this._fallbackCacheControlDirectives,
          },
      hashKey: this._hashCacheKeys,
    });
  }

  private async _writeOperation(
    operation: string,
    refs: string[],
    cacheMetadata?: CacheabilityMetadata,
  ): Promise<void> {
    return this._cache.set(
      `Operation:${operation.replaceAll('\n', ' ')}`,
      {
        kind: 'operation',
        refs: [...refs],
      },
      {
        cacheOptions: cacheMetadata
          ? {
              metadata: cacheMetadata,
            }
          : {
              cacheControl: this._fallbackCacheControlDirectives,
            },
        hashKey: this._hashCacheKeys,
      },
    );
  }

  private async _writeOperationPath(
    cacheKey: string,
    cacheEntry: OperationPathCacheEntry,
    cacheMetadata?: CacheabilityMetadata,
  ): Promise<void> {
    return this._cache.set(`OperationPath:${cacheKey}`, cacheEntry, {
      cacheOptions: cacheMetadata
        ? {
            metadata: cacheMetadata,
          }
        : {
            cacheControl: this._fallbackCacheControlDirectives,
          },
      hashKey: this._hashCacheKeys,
    });
  }
}
