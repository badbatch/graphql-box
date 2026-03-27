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
  buildOperationPathCacheKey,
  buildResponseDataKey,
  hashOperation,
  isPlainObject,
  sortFieldPathEntries,
} from '@graphql-box/helpers';
import { type Metadata as CacheabilityMetadata } from 'cacheability';
import { print } from 'graphql';
import { get, set } from 'lodash-es';
import { type SetRequired } from 'type-fest';
import { buildCacheKeyToOperationPathLookup } from '#helpers/buildCacheKeyToOperationPathLookup.ts';
import { buildOperationPathFromResponseKey } from '#helpers/buildOperationPathFromResponseKey.ts';
import { getRequiredFieldNames } from '#helpers/getRequiredFieldNames.ts';
import { isRef } from '#helpers/isRef.ts';
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
  type RefTargets,
  type RetrieveCacheEntryResult,
  type UserOptions,
} from './types.ts';

export class CacheManager implements CacheManagerDef {
  // @ts-expect-error cache is initialised in constructor
  private _cache: Core;
  private readonly _debug: boolean;
  private readonly _fallbackCacheControlDirectives: string;
  private readonly _hashCacheKeys: boolean;

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    if (!('cache' in options)) {
      errors.push(new ArgsError('Expected "cache" to be in options.'));
    }

    if (errors.length > 0) {
      throw new AggregateError(errors, 'Argument validation errors');
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

    this._debug = options.debug ?? false;

    this._fallbackCacheControlDirectives =
      options.fallbackCacheControlDirectives ?? 'no-cache, max-age=0, must-revalidate';

    this._hashCacheKeys = options.hashCacheKeys ?? false;
  }

  public analyzeQuery(
    operationData: OperationData,
    context: SetRequired<OperationContext, 'fieldPaths'>,
  ): AnalyzeQueryResult {
    const { ast } = operationData;
    const { data, extensions, kind, resolvedPaths = [] } = this._retrieveResponseData(operationData, context);

    if (kind === 'miss') {
      return { kind: 'cache-miss', operationData };
    }

    if (kind === 'hit') {
      return { kind: 'cache-hit', responseData: { data, extensions } };
    }

    const filteredAst = filterQuery(ast, resolvedPaths, context);
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

  public cacheQuery(
    operationData: OperationData,
    responseData: ResponseData,
    context: SetRequired<OperationContext, 'fieldPaths'>,
  ): void {
    this._storeResponseData(operationData, responseData, context);
  }

  get hashCacheKeys(): boolean {
    return this._hashCacheKeys;
  }

  private _addTagToCacheMetadata(
    cacheKey: string,
    tag: string | number | undefined,
    options: { hashKey?: boolean } = {},
  ): void {
    if (tag) {
      const metadataEntry = this._cache.getMetadataEntry(cacheKey, options);

      if (metadataEntry && !metadataEntry.tags.includes(tag)) {
        metadataEntry.tags = [...metadataEntry.tags, tag];
      }
    }
  }

  private _log(message: string): void {
    if (this._debug) {
      console.debug(message);
    }
  }

  private _readEntity(key: string, { data }: OperationContext): EntityCacheEntry | undefined {
    const cacheKey = `Entity:${key}`;

    const result = this._cache.get<EntityCacheEntry>(cacheKey, {
      hashKey: this._hashCacheKeys,
    });

    if (result) {
      this._addTagToCacheMetadata(cacheKey, data.tag, { hashKey: this._hashCacheKeys });
    }

    return result;
  }

  private _readOperation(operation: string, { data }: OperationContext): OperationCacheEntry | undefined {
    const cacheKey = `Operation:${operation.replaceAll('\n', '')}`;

    const result = this._cache.get<OperationCacheEntry>(cacheKey, {
      hashKey: this._hashCacheKeys,
    });

    if (result) {
      this._addTagToCacheMetadata(cacheKey, data.tag, { hashKey: this._hashCacheKeys });
    }

    return result;
  }

  private _readOperationPath(key: string, { data }: OperationContext): OperationPathCacheEntry | undefined {
    const cacheKey = `OperationPath:${key}`;

    const result = this._cache.get<OperationPathCacheEntry>(cacheKey, {
      hashKey: this._hashCacheKeys,
    });

    if (result) {
      this._addTagToCacheMetadata(cacheKey, data.tag, { hashKey: this._hashCacheKeys });
    }

    return result;
  }

  private _retrieveEntityData(
    cacheKey: string,
    operationPath: string,
    context: OperationContext,
  ): RetrieveCacheEntryResult<Record<string, unknown>> {
    const { fieldPaths } = context;
    const entityCacheEntry = this._readEntity(cacheKey, context);

    if (!entityCacheEntry) {
      this._log(`Unable to retrieve entity for cache key "${cacheKey}"`);
      return { kind: 'miss' };
    }

    const { extensions, refTargets, value } = entityCacheEntry;
    const refTargetEntries = Object.entries(refTargets);
    const entityRequiredFields = this._validateEntityRequiredFields(value, operationPath, fieldPaths);

    if (!entityRequiredFields) {
      return { kind: 'miss' };
    }

    let cacheMetadata: CacheMetadata = {
      [cacheKey]: extensions.cacheability,
    };

    const requiredFieldNames = Object.keys(entityRequiredFields);
    const filteredRefTargets: RefTargets = {};

    for (const [ref, responseKeys] of refTargetEntries) {
      for (const responseKey of responseKeys) {
        const [rootPath] = responseKey.split('.');

        if (rootPath && requiredFieldNames.includes(rootPath)) {
          filteredRefTargets[ref] = responseKeys;
        }
      }
    }

    const filteredRefTargetEntries = Object.entries(filteredRefTargets);

    if (filteredRefTargetEntries.length === 0) {
      return {
        extensions: { cacheMetadata },
        kind: 'hit',
        value: entityRequiredFields,
      };
    }

    for (const [ref, target] of filteredRefTargetEntries) {
      for (const responseKey of target) {
        const scopedOperationPath = buildOperationPathFromResponseKey(responseKey, operationPath);
        const result = this._retrieveEntityData(ref, scopedOperationPath, context);

        if (result.kind === 'miss') {
          this._log(`Unable to retrieve entity, no data for entity cache key "${ref}"`);
          return { kind: 'miss' };
        }

        cacheMetadata = {
          ...cacheMetadata,
          ...result.extensions.cacheMetadata,
        };

        const existingValue = get(entityRequiredFields, responseKey);

        if (isPlainObject(existingValue) && !isRef(existingValue)) {
          set(entityRequiredFields, responseKey, { ...existingValue, ...result.value });
        } else {
          set(entityRequiredFields, responseKey, result.value);
        }
      }
    }

    return {
      extensions: { cacheMetadata },
      kind: 'hit',
      value: entityRequiredFields,
    };
  }

  private _retrieveOperationData(operation: string, context: OperationContext): RetrieveCacheEntryResult<PlainObject> {
    const { fieldPaths } = context;
    const operationCacheEntry = this._readOperation(operation, context);

    if (!operationCacheEntry) {
      this._log(`Unable to retrieve operation data for cache key "${operation}"`);
      return { kind: 'miss' };
    }

    const cacheKeyToOperationPathLookup = buildCacheKeyToOperationPathLookup(fieldPaths);
    const { refTargets } = operationCacheEntry;
    const data: PlainObject = {};
    let cacheMetadata: CacheMetadata = {};

    for (const [ref, responseKeys] of Object.entries(refTargets)) {
      // As we are building the list above, it is safe to assume
      // operationPath is defined.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const operationPath = cacheKeyToOperationPathLookup[ref]!;
      const result = this._retrieveOperationPathData(ref, operationPath, context);

      if (result.kind === 'miss') {
        this._log(`Unable to retrieve operation data, no data for operation path cache key "${ref}"`);
        return { kind: 'miss' };
      }

      cacheMetadata = {
        ...cacheMetadata,
        ...result.extensions.cacheMetadata,
      };

      for (const responseKey of responseKeys) {
        // get() generic typing doesn't seem to work properly
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const existingValue = get(data, responseKey) as unknown;

        if (isPlainObject(result.value) && isPlainObject(existingValue) && !isRef(existingValue)) {
          set(data, responseKey, { ...existingValue, ...result.value });
        } else {
          set(data, responseKey, result.value);
        }
      }
    }

    return {
      extensions: { cacheMetadata },
      kind: 'hit',
      value: data,
    };
  }

  private _retrieveOperationPathData(
    cacheKey: string,
    operationPath: string,
    context: OperationContext,
  ): RetrieveCacheEntryResult {
    const operationPathCacheEntry = this._readOperationPath(cacheKey, context);

    if (!operationPathCacheEntry) {
      this._log(`Unable to retrieve operation data, no data for operation path cache key "${cacheKey}"`);
      return { kind: 'miss' };
    }

    const { extensions, refTargets, value } = operationPathCacheEntry;
    const refTargetEntries = Object.entries(refTargets);

    let cacheMetadata: CacheMetadata = {
      [cacheKey]: extensions.cacheability,
    };

    if (refTargetEntries.length === 0) {
      return {
        extensions: { cacheMetadata },
        kind: 'hit',
        value: structuredClone(value),
      };
    }

    // @ts-expect-error if refTargetEntries.length is greater than 0, it means
    // the value will definitely be an object.
    let newValue = structuredClone<PlainObject<unknown>>(value);

    for (const [ref, target] of refTargetEntries) {
      for (const responseKey of target) {
        const scopedOperationPath = buildOperationPathFromResponseKey(responseKey, operationPath);
        const result = this._retrieveEntityData(ref, scopedOperationPath, context);

        if (result.kind === 'miss') {
          this._log(`Unable to retrieve operation path data, no data for entity cache key "${ref}"`);
          return { kind: 'miss' };
        }

        cacheMetadata = {
          ...cacheMetadata,
          ...result.extensions.cacheMetadata,
        };

        if (responseKey) {
          const existingValue = get(newValue, responseKey);

          if (isPlainObject(existingValue) && !isRef(existingValue)) {
            set(newValue, responseKey, { ...existingValue, ...result.value });
          } else {
            set(newValue, responseKey, result.value);
          }
        } else {
          newValue = result.value;
        }
      }
    }

    return {
      extensions: { cacheMetadata },
      kind: 'hit',
      value: newValue,
    };
  }

  private _retrieveResponseData(
    { operation }: OperationData,
    context: OperationContext,
  ): {
    data: Record<string, unknown>;
    extensions: { cacheMetadata: CacheMetadata };
    kind: 'hit' | 'miss' | 'partial';
    rejectedPaths?: string[];
    resolvedPaths?: string[];
  } {
    const { fieldPaths } = context;
    const resolvedOperationPaths = new Set<string>();
    const rejectedOperationPaths = new Set<string>();
    const cachedResponseData: Record<string, unknown> = {};
    const result = this._retrieveOperationData(operation, context);

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
      const operationPathResult = this._retrieveOperationPathData(operationPathCacheKey, operationPath, context);

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

  private _storeResponseData(
    { operation }: OperationData,
    { data, extensions }: ResponseData,
    context: SetRequired<OperationContext, 'fieldPaths'>,
  ): void {
    const { data: ctxData, fieldPaths, idKey } = context;

    const {
      entities,
      operation: normalisedOperation,
      operationPaths,
    } = normaliseResponseData(data, extensions, fieldPaths, {
      fallbackCacheControlDirectives: this._fallbackCacheControlDirectives,
      idKey,
    });

    this._writeOperation(operation, normalisedOperation, { tag: ctxData.tag });

    for (const [entityCacheKey, entityCacheEntry] of Object.entries(entities)) {
      this._writeEntity(entityCacheKey, entityCacheEntry, context);
    }

    for (const [operationPathCacheKey, operationPathCacheEntry] of Object.entries(operationPaths)) {
      this._writeOperationPath(operationPathCacheKey, operationPathCacheEntry, { tag: ctxData.tag });
    }
  }

  private _validateEntityRequiredFields(
    data: Entity,
    operationPath: string,
    fieldPaths: FieldPaths,
  ): PlainObject<unknown> | false {
    const fieldPathMetadata = fieldPaths[operationPath];

    if (!fieldPathMetadata) {
      this._log(`No required fields for operationPath "${operationPath}"`);
      return data;
    }

    if (!fieldPathMetadata.requiredFields || fieldPathMetadata.requiredFields.__typename.length === 0) {
      this._log(`No required fields for operationPath "${operationPath}"`);
      return data;
    }

    const requiredFieldNames = getRequiredFieldNames(fieldPathMetadata.requiredFields, data.__typename);
    const missingFieldNames = requiredFieldNames.filter(name => data[name] === undefined);

    if (missingFieldNames.length > 0) {
      this._log(`Unable to retrieve data for fields: ${missingFieldNames.join(', ')}`);
      return false;
    }

    const requiredFields: Record<string, unknown> = {};

    for (const name of requiredFieldNames) {
      requiredFields[name] = data[name];
    }

    return requiredFields;
  }

  private _writeEntity(cacheKey: string, cacheEntry: EntityCacheEntry, context: OperationContext): void {
    const { extensions, kind, refTargets, value } = cacheEntry;
    const result = this._readEntity(cacheKey, context);
    const finalValue = result ? { ...result.value, ...value } : value;
    const finalRefTargets = result ? mergeRefTargets(finalValue, result.refTargets, refTargets) : cacheEntry.refTargets;

    this._cache.set(
      `Entity:${cacheKey}`,
      { extensions, kind, refTargets: finalRefTargets, value: finalValue },
      {
        cacheOptions: { metadata: extensions.cacheability },
        hashKey: this._hashCacheKeys,
        tag: context.data.tag,
      },
    );
  }

  private _writeOperation(operation: string, cacheEntry: OperationCacheEntry, { tag }: CacheOptions = {}): void {
    const cacheKey = `Operation:${operation.replaceAll('\n', '')}`;
    const { cacheMetadata } = cacheEntry.extensions;
    let metadata: CacheabilityMetadata | undefined;

    for (const cacheabilityMetadata of Object.values(cacheMetadata)) {
      if (!metadata || metadata.ttl > cacheabilityMetadata.ttl) {
        metadata = cacheabilityMetadata;
      }
    }

    this._cache.set(cacheKey, cacheEntry, {
      cacheOptions: { metadata },
      hashKey: this._hashCacheKeys,
      tag,
    });
  }

  private _writeOperationPath(cacheKey: string, cacheEntry: OperationPathCacheEntry, { tag }: CacheOptions = {}): void {
    this._cache.set(`OperationPath:${cacheKey}`, cacheEntry, {
      cacheOptions: { metadata: cacheEntry.extensions.cacheability },
      hashKey: this._hashCacheKeys,
      tag,
    });
  }
}
