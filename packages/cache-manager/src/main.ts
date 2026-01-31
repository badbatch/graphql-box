import { type Core } from '@cachemap/core';
import {
  type CacheMetadata,
  type Entity,
  type FieldPaths,
  type OperationContext,
  type OperationData,
  type PlainObject,
  type ResponseData,
} from '@graphql-box/core';
import {
  ArgsError,
  GroupedError,
  buildOperationPathCacheKey,
  buildResponseDataKey,
  hashOperation,
  sortFieldPathEntries,
} from '@graphql-box/helpers';
import { type Metadata as CacheabilityMetadata } from 'cacheability';
import { print } from 'graphql';
import { set } from 'lodash-es';
import { type SetRequired } from 'type-fest';
import { buildCacheKeyToOperationPathLookup } from '#helpers/buildCacheKeyToOperationPathLookup.ts';
import { getRequiredFieldNames } from '#helpers/getRequiredFieldNames.ts';
import { mergeRefTargets } from '#helpers/mergeRefTargets.ts';
import { normaliseResponseData } from '#helpers/normaliseResponseData.ts';
import { filterQuery } from './helpers/filterQuery.ts';
import {
  type AnalyzeQueryResult,
  type CacheManagerDef,
  type CacheOptions,
  type EntityCacheEntry,
  type OperationCacheEntry,
  type OperationPathCacheEntry,
  type RetrieveCacheEntryResult,
  type UserOptions,
} from './types.ts';

export class CacheManager implements CacheManagerDef {
  // @ts-expect-error cache is initialised in constructor
  private readonly _cache: Core;
  private readonly _debug: boolean;
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

    this._debug = options.debug ?? false;

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

    const filteredAst = filterQuery(ast, resolvedPaths, context.fieldPaths);
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

  private _log(message: string): void {
    if (this._debug) {
      console.debug(message);
    }
  }

  private async _readEntity(key: string): Promise<EntityCacheEntry | undefined> {
    const cacheKey = `Entity:${key}`;

    return this._cache.get<EntityCacheEntry>(cacheKey, {
      hashKey: this._hashCacheKeys,
    });
  }

  private async _readOperation(operation: string): Promise<OperationCacheEntry | undefined> {
    const cacheKey = `Operation:${operation.replaceAll('\n', '')}`;

    return this._cache.get<OperationCacheEntry>(cacheKey, {
      hashKey: this._hashCacheKeys,
    });
  }

  private async _readOperationPath(key: string): Promise<OperationPathCacheEntry | undefined> {
    const cacheKey = `OperationPath:${key}`;

    return this._cache.get<OperationPathCacheEntry>(cacheKey, {
      hashKey: this._hashCacheKeys,
    });
  }

  private async _retrieveEntityData(
    cacheKey: string,
    operationPath: string,
    fieldPaths: FieldPaths,
  ): Promise<RetrieveCacheEntryResult<Entity>> {
    const entityCacheEntry = await this._readEntity(cacheKey);

    if (!entityCacheEntry) {
      this._log(`Unable to retrieve entity for cache key "${cacheKey}"`);
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

    for (const [ref, target] of refTargetEntries) {
      const result = await this._retrieveEntityData(ref, operationPath, fieldPaths);

      if (result.kind === 'miss') {
        this._log(`Unable to retrieve entity, no data for entity cache key "${ref}"`);
        return { kind: 'miss' };
      }

      cacheMetadata = {
        ...cacheMetadata,
        ...result.extensions.cacheMetadata,
      };

      for (const responseKey of target) {
        if (!this._validateEntityRequiredFields(result.value, operationPath, fieldPaths)) {
          return { kind: 'miss' };
        }

        set(entity, responseKey, result.value);
      }
    }

    return {
      extensions: { cacheMetadata, ...restExtensions },
      kind: 'hit',
      value: entity,
    };
  }

  private async _retrieveOperationData(
    cacheKey: string,
    fieldPaths: FieldPaths,
  ): Promise<RetrieveCacheEntryResult<PlainObject>> {
    const operationCacheEntry = await this._readOperation(cacheKey);

    if (!operationCacheEntry) {
      this._log(`Unable to retrieve operation data for cache key "${cacheKey}"`);
      return { kind: 'miss' };
    }

    const cacheKeyToOperationPathLookup = buildCacheKeyToOperationPathLookup(fieldPaths);
    const { extensions, refTargets } = operationCacheEntry;
    const { cacheability, ...restExtensions } = extensions;
    const data: PlainObject = {};

    let cacheMetadata: CacheMetadata = {
      [cacheKey]: cacheability,
    };

    for (const [ref, responseKeys] of Object.entries(refTargets)) {
      // As we are building the list above, it is safe to assume
      // operationPath is defined.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const operationPath = cacheKeyToOperationPathLookup[ref]!;
      const result = await this._retrieveOperationPathData(ref, operationPath, fieldPaths);

      if (result.kind === 'miss') {
        this._log(`Unable to retrieve operation data, no data for operation path cache key "${ref}"`);
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

  private async _retrieveOperationPathData(
    cacheKey: string,
    operationPath: string,
    fieldPaths: FieldPaths,
  ): Promise<RetrieveCacheEntryResult> {
    const operationPathCacheEntry = await this._readOperationPath(cacheKey);

    if (!operationPathCacheEntry) {
      this._log(`Unable to retrieve operation data, no data for operation path cache key "${cacheKey}"`);
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
    let newValue = structuredClone<PlainObject<unknown>>(value);

    for (const [ref, target] of refTargetEntries) {
      const result = await this._retrieveEntityData(ref, operationPath, fieldPaths);

      if (result.kind === 'miss') {
        this._log(`Unable to retrieve operation path data, no data for entity cache key "${ref}"`);
        return { kind: 'miss' };
      }

      cacheMetadata = {
        ...cacheMetadata,
        ...result.extensions.cacheMetadata,
      };

      for (const responseKey of target) {
        if (!this._validateEntityRequiredFields(result.value, operationPath, fieldPaths)) {
          return { kind: 'miss' };
        }

        if (responseKey) {
          set(newValue, responseKey, result.value);
        } else {
          newValue = result.value;
        }
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
    const result = await this._retrieveOperationData(hash, fieldPaths);

    if (result.kind === 'hit') {
      return {
        data: result.value,
        extensions: result.extensions,
        kind: 'hit',
      };
    }

    const sortedFieldPathEntries = Object.entries(fieldPaths).sort(sortFieldPathEntries('asc'));
    let cacheMetadata: CacheMetadata = {};

    for (const [operationPath, fieldPathMetadata] of sortedFieldPathEntries) {
      const { hasArgs, isCacheBoundary, isRootPath } = fieldPathMetadata;

      if (!isCacheBoundary || (!hasArgs && !isRootPath)) {
        continue;
      }

      const operationPathCacheKey = buildOperationPathCacheKey(operationPath, fieldPaths);
      const responseKey = buildResponseDataKey(operationPath, fieldPaths);

      const operationPathResult = await this._retrieveOperationPathData(
        operationPathCacheKey,
        operationPath,
        fieldPaths,
      );

      if (operationPathResult.kind === 'hit') {
        cacheMetadata = {
          ...cacheMetadata,
          ...operationPathResult.extensions.cacheMetadata,
        };

        set(cachedResponseData, responseKey, operationPathResult.value);
        resolvedOperationPaths.add(operationPathCacheKey);
      } else {
        rejectedOperationPaths.add(operationPathCacheKey);
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
    { data: ctxData, fieldPaths, idKey }: SetRequired<OperationContext, 'fieldPaths'>,
  ): Promise<void> {
    const { entities, operationPaths } = normaliseResponseData(data, extensions, fieldPaths, {
      fallbackCacheControlDirectives: this._fallbackCacheControlDirectives,
      idKey,
    });

    const cacheWritePromises: Promise<void>[] = [this._writeOperation(operation, operationPaths, { tag: ctxData.tag })];

    for (const [entityCacheKey, entityCacheEntry] of Object.entries(entities)) {
      cacheWritePromises.push(this._writeEntity(entityCacheKey, entityCacheEntry, { tag: ctxData.tag }));
    }

    for (const [operationPathCacheKey, operationPathCacheEntry] of Object.entries(operationPaths)) {
      cacheWritePromises.push(
        this._writeOperationPath(operationPathCacheKey, operationPathCacheEntry, { tag: ctxData.tag }),
      );
    }

    await Promise.all(cacheWritePromises);
  }

  private _validateEntityRequiredFields(data: Entity, operationPath: string, fieldPaths: FieldPaths): boolean {
    const fieldPathMetadata = fieldPaths[operationPath];

    if (!fieldPathMetadata) {
      this._log(`Unable to resolve fieldPathMetadata for operationPath "${operationPath}"`);
      return false;
    }

    if (!fieldPathMetadata.requiredFields || fieldPathMetadata.requiredFields.__typename.length === 0) {
      this._log(`No required fields for operationPath "${operationPath}"`);
      return true;
    }

    const requiredFieldNames = getRequiredFieldNames(fieldPathMetadata.requiredFields, data.__typename);
    const missingFieldNames = requiredFieldNames.filter(name => data[name] === undefined);

    if (missingFieldNames.length > 0) {
      this._log(`Unable to retrieve data for fields: ${missingFieldNames.join(', ')}`);
      return false;
    }

    return true;
  }

  private async _writeEntity(
    cacheKey: string,
    cacheEntry: EntityCacheEntry,
    { tag }: CacheOptions = {},
  ): Promise<void> {
    const { extensions, kind, refTargets, value } = cacheEntry;
    const result = await this._readEntity(cacheKey);
    const finalValue = result ? { ...result.value, ...value } : value;
    const finalRefTargets = result ? mergeRefTargets(finalValue, result.refTargets, refTargets) : cacheEntry.refTargets;

    return this._cache.set(
      `Entity:${cacheKey}`,
      { extensions, kind, refTargets: finalRefTargets, value: finalValue },
      {
        cacheOptions: { metadata: extensions.cacheability },
        hashKey: this._hashCacheKeys,
        tag,
      },
    );
  }

  private async _writeOperation(
    operation: string,
    cacheEntries: Record<string, OperationPathCacheEntry>,
    { tag }: CacheOptions = {},
  ): Promise<void> {
    const refs = new Set<string>();
    let metadata: CacheabilityMetadata | undefined;

    for (const [operationPathCacheKey, cacheEntry] of Object.entries(cacheEntries)) {
      refs.add(operationPathCacheKey);
      const { cacheability } = cacheEntry.extensions;

      if (!metadata || cacheEntry.extensions.cacheability.ttl > metadata.ttl) {
        metadata = cacheability;
      }
    }

    const cacheKey = `Operation:${operation.replaceAll('\n', '')}`;

    if (!metadata) {
      this._log(
        `Unable to write operation cache entry for "${cacheKey}". Cache metadata was not returned for this entry.`,
      );

      return;
    }

    return this._cache.set(
      cacheKey,
      {
        extensions: {
          cacheability: metadata,
        },
        kind: 'operation',
        refs: [...refs],
      },
      {
        cacheOptions: {
          metadata,
        },
        hashKey: this._hashCacheKeys,
        tag,
      },
    );
  }

  private async _writeOperationPath(
    cacheKey: string,
    cacheEntry: OperationPathCacheEntry,
    { tag }: CacheOptions = {},
  ): Promise<void> {
    return this._cache.set(`OperationPath:${cacheKey}`, cacheEntry, {
      cacheOptions: {
        metadata: cacheEntry.extensions.cacheability,
      },
      hashKey: this._hashCacheKeys,
      tag,
    });
  }
}
