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
import { buildOperationPathFromResponseKey } from '#helpers/buildOperationPathFromResponseKey.ts';
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
    const { data, extensions, kind, resolvedPaths = [] } = await this._retrieveResponseData(operationData, context);

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

  private async _readEntity(key: string, { data }: OperationContext): Promise<EntityCacheEntry | undefined> {
    const cacheKey = `Entity:${key}`;

    const result = await this._cache.get<EntityCacheEntry>(cacheKey, {
      hashKey: this._hashCacheKeys,
    });

    if (result) {
      this._addTagToCacheMetadata(cacheKey, data.tag, { hashKey: this._hashCacheKeys });
    }

    return result;
  }

  private async _readOperation(
    operation: string,
    { data }: OperationContext,
  ): Promise<OperationCacheEntry | undefined> {
    const cacheKey = `Operation:${operation.replaceAll('\n', '')}`;

    const result = await this._cache.get<OperationCacheEntry>(cacheKey, {
      hashKey: this._hashCacheKeys,
    });

    if (result) {
      this._addTagToCacheMetadata(cacheKey, data.tag, { hashKey: this._hashCacheKeys });
    }

    return result;
  }

  private async _readOperationPath(
    key: string,
    { data }: OperationContext,
  ): Promise<OperationPathCacheEntry | undefined> {
    const cacheKey = `OperationPath:${key}`;

    const result = await this._cache.get<OperationPathCacheEntry>(cacheKey, {
      hashKey: this._hashCacheKeys,
    });

    if (result) {
      this._addTagToCacheMetadata(cacheKey, data.tag, { hashKey: this._hashCacheKeys });
    }

    return result;
  }

  private async _retrieveEntityData(
    cacheKey: string,
    operationPath: string,
    context: OperationContext,
  ): Promise<RetrieveCacheEntryResult<Entity>> {
    const { fieldPaths } = context;
    const entityCacheEntry = await this._readEntity(cacheKey, context);

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
      const result = await this._retrieveEntityData(ref, operationPath, context);

      if (result.kind === 'miss') {
        this._log(`Unable to retrieve entity, no data for entity cache key "${ref}"`);
        return { kind: 'miss' };
      }

      cacheMetadata = {
        ...cacheMetadata,
        ...result.extensions.cacheMetadata,
      };

      for (const responseKey of target) {
        const scopedOperationPath = buildOperationPathFromResponseKey(responseKey, operationPath);
        const requiredFields = this._validateEntityRequiredFields(result.value, scopedOperationPath, fieldPaths);

        if (!requiredFields) {
          return { kind: 'miss' };
        }

        set(entity, responseKey, requiredFields);
      }
    }

    return {
      extensions: { cacheMetadata, ...restExtensions },
      kind: 'hit',
      value: entity,
    };
  }

  private async _retrieveOperationData(
    operation: string,
    context: OperationContext,
  ): Promise<RetrieveCacheEntryResult<PlainObject>> {
    const { fieldPaths } = context;
    const operationCacheEntry = await this._readOperation(operation, context);

    if (!operationCacheEntry) {
      this._log(`Unable to retrieve operation data for cache key "${operation}"`);
      return { kind: 'miss' };
    }

    const cacheKeyToOperationPathLookup = buildCacheKeyToOperationPathLookup(fieldPaths);
    const { extensions, refTargets } = operationCacheEntry;
    let { cacheMetadata } = extensions;
    const data: PlainObject = {};

    for (const [ref, responseKeys] of Object.entries(refTargets)) {
      // As we are building the list above, it is safe to assume
      // operationPath is defined.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const operationPath = cacheKeyToOperationPathLookup[ref]!;
      const result = await this._retrieveOperationPathData(ref, operationPath, context);

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
      extensions: { ...extensions, cacheMetadata },
      kind: 'hit',
      value: data,
    };
  }

  private async _retrieveOperationPathData(
    cacheKey: string,
    operationPath: string,
    context: OperationContext,
  ): Promise<RetrieveCacheEntryResult> {
    const { fieldPaths } = context;
    const operationPathCacheEntry = await this._readOperationPath(cacheKey, context);

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
      const result = await this._retrieveEntityData(ref, operationPath, context);

      if (result.kind === 'miss') {
        this._log(`Unable to retrieve operation path data, no data for entity cache key "${ref}"`);
        return { kind: 'miss' };
      }

      cacheMetadata = {
        ...cacheMetadata,
        ...result.extensions.cacheMetadata,
      };

      for (const responseKey of target) {
        const scopedOperationPath = buildOperationPathFromResponseKey(responseKey, operationPath);
        const requiredFields = this._validateEntityRequiredFields(result.value, scopedOperationPath, fieldPaths);

        if (!requiredFields) {
          return { kind: 'miss' };
        }

        if (responseKey) {
          set(newValue, responseKey, requiredFields);
        } else {
          newValue = requiredFields;
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
    { operation }: OperationData,
    context: OperationContext,
  ): Promise<{
    data: Record<string, unknown>;
    extensions: { cacheMetadata: CacheMetadata };
    kind: 'hit' | 'miss' | 'partial';
    rejectedPaths?: string[];
    resolvedPaths?: string[];
  }> {
    const { fieldPaths } = context;
    const resolvedOperationPaths = new Set<string>();
    const rejectedOperationPaths = new Set<string>();
    const cachedResponseData: Record<string, unknown> = {};
    const result = await this._retrieveOperationData(operation, context);

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
      const operationPathResult = await this._retrieveOperationPathData(operationPathCacheKey, operationPath, context);

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
    context: SetRequired<OperationContext, 'fieldPaths'>,
  ): Promise<void> {
    const { data: ctxData, fieldPaths, idKey } = context;

    const {
      entities,
      operation: normalisedOperation,
      operationPaths,
    } = normaliseResponseData(data, extensions, fieldPaths, {
      fallbackCacheControlDirectives: this._fallbackCacheControlDirectives,
      idKey,
    });

    const cacheWritePromises: Promise<void>[] = [
      this._writeOperation(operation, normalisedOperation, { tag: ctxData.tag }),
    ];

    for (const [entityCacheKey, entityCacheEntry] of Object.entries(entities)) {
      cacheWritePromises.push(this._writeEntity(entityCacheKey, entityCacheEntry, context));
    }

    for (const [operationPathCacheKey, operationPathCacheEntry] of Object.entries(operationPaths)) {
      cacheWritePromises.push(
        this._writeOperationPath(operationPathCacheKey, operationPathCacheEntry, { tag: ctxData.tag }),
      );
    }

    await Promise.all(cacheWritePromises);
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

  private async _writeEntity(cacheKey: string, cacheEntry: EntityCacheEntry, context: OperationContext): Promise<void> {
    const { extensions, kind, refTargets, value } = cacheEntry;
    const result = await this._readEntity(cacheKey, context);
    const finalValue = result ? { ...result.value, ...value } : value;
    const finalRefTargets = result ? mergeRefTargets(finalValue, result.refTargets, refTargets) : cacheEntry.refTargets;

    return this._cache.set(
      `Entity:${cacheKey}`,
      { extensions, kind, refTargets: finalRefTargets, value: finalValue },
      {
        cacheOptions: { metadata: extensions.cacheability },
        hashKey: this._hashCacheKeys,
        tag: context.data.tag,
      },
    );
  }

  private async _writeOperation(
    operation: string,
    cacheEntry: OperationCacheEntry,
    { tag }: CacheOptions = {},
  ): Promise<void> {
    const cacheKey = `Operation:${operation.replaceAll('\n', '')}`;
    const { cacheMetadata } = cacheEntry.extensions;
    let metadata: CacheabilityMetadata | undefined;

    for (const cacheabilityMetadata of Object.values(cacheMetadata)) {
      if (!metadata || metadata.ttl > cacheabilityMetadata.ttl) {
        metadata = cacheabilityMetadata;
      }
    }

    return this._cache.set(cacheKey, cacheEntry, {
      cacheOptions: { metadata },
      hashKey: this._hashCacheKeys,
      tag,
    });
  }

  private async _writeOperationPath(
    cacheKey: string,
    cacheEntry: OperationPathCacheEntry,
    { tag }: CacheOptions = {},
  ): Promise<void> {
    return this._cache.set(`OperationPath:${cacheKey}`, cacheEntry, {
      cacheOptions: { metadata: cacheEntry.extensions.cacheability },
      hashKey: this._hashCacheKeys,
      tag,
    });
  }
}
