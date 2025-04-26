import { type Core } from '@cachemap/core';
import {
  type CacheMetadata,
  type CacheTypes,
  type CachemapOptions,
  DATA_ENTITIES,
  DEFAULT_TYPE_ID_KEY,
  type EntityData,
  type FieldTypeInfo,
  type PlainData,
  QUERY_RESPONSES,
  REQUEST_FIELD_PATHS,
  type RawResponseDataWithMaybeCacheMetadata,
  type RequestContext,
  type RequestData,
  type RequestOptions,
  type ResponseData,
  TYPE_NAME_KEY,
} from '@graphql-box/core';
import {
  ArgsError,
  GroupedError,
  type KeysAndPaths,
  buildFieldKeysAndPaths,
  dehydrateCacheMetadata,
  getChildFields,
  getFragmentDefinitions,
  getOperationDefinitions,
  hasChildFields,
  hashRequest,
  isArray,
  isObjectLike,
  isPlainObject,
  iterateChildFields,
  rehydrateCacheMetadata,
} from '@graphql-box/helpers';
import { Cacheability } from 'cacheability';
import { type FieldNode, Kind, OperationTypeNode, print } from 'graphql';
import { assign, get, isEqual, isNumber, isUndefined, set, unset } from 'lodash-es';
import { CACHE_CONTROL, HEADER_NO_CACHE, METADATA, NO_CACHE } from './constants.ts';
import { logCacheEntry, logCacheQuery, logPartialCompiled } from './debug/index.ts';
import { areOnlyPopulatedFieldsTypeIdKeys } from './helpers/areOnlyPopulatedFieldsTypeIdKeys.ts';
import {
  allCacheTiersDisabled,
  entityCacheTierEnabled,
  entityOrRequestPathCacheTiersEnabled,
  queryResponseCacheTierEnabled,
  requestPathCacheTierEnabled,
  someCacheTiersEnabled,
} from './helpers/cacheTiersEnabled.ts';
import { combineDataSets } from './helpers/combineData.ts';
import { createEntityDataKey } from './helpers/createEntityDataKey.ts';
import { deriveOpCacheability } from './helpers/deriveOpCacheability.ts';
import { filterOutPropsWithEntityArgsOrDirectives } from './helpers/filterOutPropsWithEntityArgsOrDirectives.ts';
import { filterOutPropsWithEntityOrArgs } from './helpers/filterOutPropsWithEntityOrArgs.ts';
import { filterQuery } from './helpers/filterQuery.ts';
import { getDataValue } from './helpers/getDataValue.ts';
import { hasTypename } from './helpers/hasTypename.ts';
import { isFieldEntity } from './helpers/isFieldEntity.ts';
import { isLastResponseChunk } from './helpers/isLastResponseChunk.ts';
import { isNotLastResponseChunk } from './helpers/isNotLastResponseChunk.ts';
import { isNotResponseChunk } from './helpers/isNotResponseChunk.ts';
import { mergeDataSets } from './helpers/mergeObjects.ts';
import { mergeResponseDataSets } from './helpers/mergeResponseDataSets.ts';
import { normalizePatchResponseData } from './helpers/normalizePatchResponseData.ts';
import { getValidTypeIdValue } from './helpers/validTypeIdValue.ts';
import {
  type AnalyzeQueryResult,
  type AncestorKeysAndPaths,
  type CacheManagerContext,
  type CacheManagerDef,
  type CacheTiersEnabled,
  type CachedAncestorFieldData,
  type CachedResponseData,
  type CheckCacheEntryResult,
  type DataForCachingEntry,
  type FieldCount,
  type FieldPathChecklist,
  type MergedCachedFieldData,
  type PartialQueryResponse,
  type PartialQueryResponses,
  type QueryResponseCacheEntry,
  type ResponseDataForCaching,
  type TypenamesAndKind,
  type UserOptions,
} from './types.ts';

export class CacheManager implements CacheManagerDef {
  private static _countFieldPathChecklist(fieldPathChecklist: FieldPathChecklist): FieldCount {
    const fieldCount: FieldCount = { missing: 0, total: 0 };

    for (const [, checklistValues] of fieldPathChecklist) {
      fieldCount.total += checklistValues.length;
      const missing = checklistValues.filter(({ hasData }) => !hasData);
      fieldCount.missing += missing.length;
    }

    return fieldCount;
  }

  private static _getFieldDataFromAncestor<T>(ancestorFieldData: unknown, propNameOrIndex: string | number) {
    const dataValue = getDataValue<T>(ancestorFieldData, propNameOrIndex);
    return isObjectLike(dataValue) ? structuredClone(dataValue) : dataValue;
  }

  private static _getOperationCacheControl(cacheMetadata: CacheMetadata | undefined, operation: string): string {
    const defaultCacheControl = HEADER_NO_CACHE;

    if (!cacheMetadata) {
      return defaultCacheControl;
    }

    const cacheability = cacheMetadata.get(operation);
    return cacheability ? cacheability.printCacheControl() : defaultCacheControl;
  }

  private static _isNodeEntity(fieldTypeInfo?: FieldTypeInfo): boolean {
    if (!fieldTypeInfo) {
      return false;
    }

    const { isEntity, possibleTypes } = fieldTypeInfo;
    return isEntity || possibleTypes.some(type => type.isEntity);
  }

  private static _isNodeRequestFieldPath(fieldTypeInfo?: FieldTypeInfo): boolean {
    return (
      !!fieldTypeInfo &&
      (this._isNodeEntity(fieldTypeInfo) || fieldTypeInfo.hasArguments || fieldTypeInfo.hasDirectives)
    );
  }

  private static _isValid(cacheability: Cacheability): boolean {
    const noCache = get(cacheability, [METADATA, CACHE_CONTROL, NO_CACHE], false);
    return !noCache && cacheability.checkTTL();
  }

  private static _mergeResponseCacheMetadata(
    cacheMetadata: CacheMetadata,
    partialQueryResponse?: PartialQueryResponse,
  ): CacheMetadata {
    if (!partialQueryResponse) {
      return cacheMetadata;
    }

    return new Map([...partialQueryResponse.cacheMetadata, ...cacheMetadata]);
  }

  private static _setCachedData(
    responseData: unknown,
    { data }: MergedCachedFieldData,
    propNameOrIndex: string | number,
  ): void {
    const setData = (value: unknown) => {
      if (isArray(responseData) && isNumber(propNameOrIndex)) {
        responseData[propNameOrIndex] = value;
      } else if (isPlainObject(responseData)) {
        responseData[propNameOrIndex] = value;
      }
    };

    if (!isObjectLike(data) && !isUndefined(data)) {
      setData(data);
    } else if (isArray(data)) {
      setData([]);
    } else if (isPlainObject(data)) {
      setData({});
    }
  }

  private static _setCachedResponseSlice(
    cachedFieldData: MergedCachedFieldData,
    { cacheMetadata, data, fieldPathChecklist }: CachedResponseData,
    { propNameOrIndex, requestFieldPath }: KeysAndPaths,
    typeNamesAndKind: TypenamesAndKind,
    _options: RequestOptions,
    { data: ctxData }: CacheManagerContext,
  ) {
    CacheManager._setCacheMetadata(cacheMetadata, cachedFieldData.cacheability, requestFieldPath, ctxData.operation);
    CacheManager._setFieldPathChecklist(fieldPathChecklist, cachedFieldData, requestFieldPath, typeNamesAndKind);
    CacheManager._setCachedData(data, cachedFieldData, propNameOrIndex);
  }

  private static _setCacheMetadata(
    cacheMetadata: CacheMetadata,
    cacheability: Cacheability | undefined,
    requestFieldPath: string,
    operation: string,
  ): void {
    if (!cacheability) {
      return;
    }

    cacheMetadata.set(requestFieldPath, cacheability);
    const operationCacheability = cacheMetadata.get(operation);

    if (!operationCacheability || operationCacheability.metadata.ttl > cacheability.metadata.ttl) {
      cacheMetadata.set(operation, cacheability);
    }
  }

  private static _setFieldPathChecklist(
    fieldPathChecklist: FieldPathChecklist,
    { data }: MergedCachedFieldData,
    requestFieldPath: string,
    { dataTypename: dataTypeName, fieldTypename: fieldTypeName, fragmentKind, fragmentName }: TypenamesAndKind,
  ): void {
    if (isUndefined(fieldTypeName) || fragmentKind === Kind.FRAGMENT_SPREAD) {
      if (fieldPathChecklist.has(requestFieldPath)) {
        return;
      }

      fieldPathChecklist.set(requestFieldPath, [{ fragmentKind, fragmentName, hasData: !isUndefined(data) }]);
      return;
    }

    if (dataTypeName !== fieldTypeName) {
      return;
    }

    const entry = fieldPathChecklist.get(requestFieldPath);
    const checklistValues = entry ?? [];

    if (checklistValues.some(({ typeName }) => typeName === dataTypeName)) {
      return;
    }

    fieldPathChecklist.set(requestFieldPath, [
      ...checklistValues,
      { fragmentKind, fragmentName, hasData: !isUndefined(data), typeName: dataTypeName },
    ]);
  }

  private _cache: Core | undefined;
  private readonly _cacheTiersEnabled: CacheTiersEnabled = { entity: false, queryResponse: true, requestPath: false };
  private readonly _cascadeCacheControl: boolean;
  private readonly _fallbackOperationCacheability: string;
  private _partialQueryResponses: PartialQueryResponses = new Map();
  private _responseChunksAwaitingCaching = new Map<string, RawResponseDataWithMaybeCacheMetadata[]>();
  private readonly _typeCacheDirectives: Record<string, string>;
  private readonly _typeIDKey: string;

  constructor(options: UserOptions) {
    const errors: ArgsError[] = [];

    if (!('cache' in options)) {
      errors.push(new ArgsError('@graphql-box/cache-manager expected cache to be in options.'));
    }

    if (!!options.typeCacheDirectives && !isPlainObject(options.typeCacheDirectives)) {
      const message = '@graphql-box/cache-manager expected options.typeCacheDirectives to be a plain object.';
      errors.push(new ArgsError(message));
    }

    if (errors.length > 0) {
      throw new GroupedError('@graphql-box/cache-manager argument validation errors.', errors);
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

    this._cacheTiersEnabled = { ...this._cacheTiersEnabled, ...options.cacheTiersEnabled };
    this._cascadeCacheControl = options.cascadeCacheControl ?? false;
    this._fallbackOperationCacheability = options.fallbackOperationCacheability ?? NO_CACHE;
    this._typeCacheDirectives = options.typeCacheDirectives ?? {};
    this._typeIDKey = options.typeIDKey ?? DEFAULT_TYPE_ID_KEY;
  }

  public async analyzeQuery(
    requestData: RequestData,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<AnalyzeQueryResult> {
    // the client has already checked the query response cache with
    // `checkQueryResponseCacheEntry`, so at this point the entity and
    // request path caches are the only relevant ones.
    if (!entityOrRequestPathCacheTiersEnabled(this._cacheTiersEnabled)) {
      return { updated: requestData };
    }

    const { ast, hash } = requestData;

    const cacheManagerContext: CacheManagerContext = {
      ...context,
      fragmentDefinitions: getFragmentDefinitions(ast),
      typeIDKey: this._typeIDKey,
    };

    const cachedResponseData = await this._retrieveCachedResponseData(requestData, options, cacheManagerContext);
    const { cacheMetadata, data, fieldCount } = cachedResponseData;

    /**
     * Second half of check is required for the scenario where the only matching data is
     * the typeIDKey field, i.e. "id", in which case there is no point settings a partial
     * query response because we request the typeIDKey field with every request.
     */
    if (fieldCount.missing === fieldCount.total || areOnlyPopulatedFieldsTypeIdKeys(data, this._typeIDKey)) {
      return { updated: requestData };
    }

    if (!fieldCount.missing && queryResponseCacheTierEnabled(this._cacheTiersEnabled)) {
      const dataCaching = this._setQueryResponseCacheEntry(hash, { cacheMetadata, data }, options, cacheManagerContext);

      if (options.awaitDataCaching) {
        await dataCaching;
      }

      return { response: { cacheMetadata, data } };
    }

    const filteredAST = filterQuery(requestData, cachedResponseData, cacheManagerContext);
    const filteredRequest = print(filteredAST);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fragmentDefinitions, typeIDKey, ...rest } = cacheManagerContext;
    assign(context, { ...rest, filteredRequest });

    if (queryResponseCacheTierEnabled(this._cacheTiersEnabled)) {
      this._setPartialQueryResponse(hash, { cacheMetadata, data }, options, context);
    }

    return {
      updated: { ast: filteredAST, hash: hashRequest(filteredRequest), request: filteredRequest },
    };
  }

  get cache(): Core | undefined {
    return this._cache;
  }

  public async cacheQuery(
    requestData: RequestData,
    updatedRequestData: RequestData | undefined,
    rawResponseData: RawResponseDataWithMaybeCacheMetadata,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<ResponseData> {
    const cacheManagerContext: CacheManagerContext = {
      ...context,
      fragmentDefinitions: getFragmentDefinitions((updatedRequestData ?? requestData).ast),
      typeIDKey: this._typeIDKey,
    };

    return this._cacheResponse(requestData, updatedRequestData, rawResponseData, options, cacheManagerContext);
  }

  public async cacheResponse(
    requestData: RequestData,
    rawResponseData: RawResponseDataWithMaybeCacheMetadata,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<ResponseData> {
    const cacheManagerContext: CacheManagerContext = {
      ...context,
      fragmentDefinitions: getFragmentDefinitions(requestData.ast),
      typeIDKey: this._typeIDKey,
    };

    return this._cacheResponse(requestData, undefined, rawResponseData, options, cacheManagerContext);
  }

  get cacheTiersEnabled(): CacheTiersEnabled {
    return this._cacheTiersEnabled;
  }

  public async checkCacheEntry(
    cacheType: CacheTypes,
    hash: string,
    options: RequestOptions,
    context: RequestContext & { requestFieldCacheKey?: string },
  ): Promise<CheckCacheEntryResult | false> {
    if (allCacheTiersDisabled(this._cacheTiersEnabled)) {
      return false;
    }

    return this._checkCacheEntry(cacheType, hash, options, context);
  }

  public async checkQueryResponseCacheEntry(
    hash: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<ResponseData | false> {
    if (!queryResponseCacheTierEnabled(this._cacheTiersEnabled)) {
      return false;
    }

    const result = await this._checkCacheEntry<QueryResponseCacheEntry>(QUERY_RESPONSES, hash, options, context);

    if (!result) {
      return false;
    }

    const { cacheMetadata, data } = result.entry;

    return {
      cacheMetadata: rehydrateCacheMetadata(cacheMetadata),
      data,
    };
  }

  public deletePartialQueryResponse(hash: string): void {
    if (queryResponseCacheTierEnabled(this._cacheTiersEnabled)) {
      this._partialQueryResponses.delete(hash);
    }
  }

  public async setQueryResponseCacheEntry(
    requestData: RequestData,
    responseData: ResponseData,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<void> {
    if (queryResponseCacheTierEnabled(this._cacheTiersEnabled)) {
      return this._setQueryResponseCacheEntry(requestData.hash, responseData, options, context);
    }
  }

  private async _analyzeFieldNode(
    fieldNode: FieldNode,
    cachedAncestorFieldData: CachedAncestorFieldData,
    cachedResponseData: CachedResponseData & { data: unknown },
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<void> {
    await (hasChildFields(fieldNode, { fragmentDefinitions: context.fragmentDefinitions })
      ? this._analyzeParentFieldNode(fieldNode, cachedAncestorFieldData, cachedResponseData, options, context)
      : this._analyzeLeafFieldNode(fieldNode, cachedAncestorFieldData, cachedResponseData, options, context));
  }

  private async _analyzeLeafFieldNode(
    fieldNode: FieldNode,
    cachedAncestorFieldData: CachedAncestorFieldData,
    cachedResponseData: CachedResponseData & { data: unknown },
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<void> {
    const keysAndPaths = buildFieldKeysAndPaths(fieldNode, cachedAncestorFieldData, context);
    const { hashedRequestFieldCacheKey, propNameOrIndex, requestFieldCacheKey, requestFieldPath } = keysAndPaths;
    const fieldTypeInfo = context.fieldTypeMap.get(requestFieldPath);
    const { entityData, fragmentKind, fragmentName, requestFieldPathData, typeName } = cachedAncestorFieldData;

    const dataTypename = hasTypename(entityData)
      ? entityData.__typename
      : hasTypename(requestFieldPathData)
        ? requestFieldPathData.__typename
        : undefined;

    const typenamesAndKind = {
      dataTypename,
      fieldTypename: typeName,
      fragmentKind,
      fragmentName,
    };

    if (!CacheManager._isNodeRequestFieldPath(fieldTypeInfo)) {
      const cachedFieldData =
        CacheManager._getFieldDataFromAncestor(entityData, propNameOrIndex) ??
        CacheManager._getFieldDataFromAncestor(requestFieldPathData, propNameOrIndex);

      CacheManager._setFieldPathChecklist(
        cachedResponseData.fieldPathChecklist,
        { data: cachedFieldData },
        requestFieldPath,
        typenamesAndKind,
      );

      CacheManager._setCachedData(cachedResponseData.data, { data: cachedFieldData }, propNameOrIndex);
    } else if (requestPathCacheTierEnabled(this._cacheTiersEnabled)) {
      const { cacheability, entry } = await this._retrieveCachedRequestFieldPathData(
        hashedRequestFieldCacheKey,
        requestFieldCacheKey,
        options,
        context,
      );

      CacheManager._setCachedResponseSlice(
        { cacheability, data: entry },
        cachedResponseData,
        keysAndPaths,
        typenamesAndKind,
        options,
        context,
      );
    }
  }

  private async _analyzeParentFieldNode(
    fieldNode: FieldNode,
    cachedAncestorFieldData: CachedAncestorFieldData,
    cachedResponseData: CachedResponseData,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<void> {
    const keysAndPaths = buildFieldKeysAndPaths(fieldNode, cachedAncestorFieldData, context);
    const { propNameOrIndex, requestFieldCacheKey, requestFieldPath } = keysAndPaths;
    const fieldTypeInfo = context.fieldTypeMap.get(requestFieldPath);

    if (!fieldTypeInfo) {
      return;
    }

    const { cacheability, data, entityData, requestFieldPathData } = await this._retrieveCachedParentNodeData(
      cachedAncestorFieldData,
      keysAndPaths,
      fieldTypeInfo,
      options,
      context,
    );

    const { fragmentKind, fragmentName, typeName } = cachedAncestorFieldData;
    // Don't get this one, need to look into it more
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const dataTypename = get(data, TYPE_NAME_KEY);

    CacheManager._setCachedResponseSlice(
      { cacheability, data },
      cachedResponseData,
      keysAndPaths,

      {
        dataTypename,
        fieldTypename: typeName,
        fragmentKind,
        fragmentName,
      },
      options,
      context,
    );

    if (!isObjectLike(data)) {
      return;
    }

    const promises: Promise<void>[] = [];

    iterateChildFields(
      fieldNode,
      data,
      context.fragmentDefinitions,
      (
        childField: FieldNode,
        childTypeName: string | undefined,
        childFragmentKind: string | undefined,
        childFragmentName: string | undefined,
        childIndex?: number,
      ) => {
        promises.push(
          this._analyzeFieldNode(
            childField,
            {
              cacheability,
              entityData,
              fragmentKind: childFragmentKind,
              fragmentName: childFragmentName,
              index: childIndex,
              requestFieldCacheKey,
              requestFieldPath,
              requestFieldPathData,
              typeName: childTypeName,
            },
            {
              ...cachedResponseData,
              // `cachedResponseData.data[propNameOrIndex]` will always be either an empty array
              // or an empty object at this point as based on whether `data` is object-like
              // `cachedResponseData.data[propNameOrIndex]` is set accordingly in
              // _setCachedResponseData > _setCachedData
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              data: getDataValue<PlainData>(cachedResponseData.data, propNameOrIndex)!,
            },
            options,
            context,
          ),
        );
      },
    );

    await Promise.all(promises);
  }

  private _buildCacheMetadata(
    { ast }: RequestData,
    { data, ...otherProps }: RawResponseDataWithMaybeCacheMetadata,
    options: RequestOptions,
    context: CacheManagerContext,
  ): CacheMetadata {
    const cacheMetadata = this._createCacheMetadata({ data, ...otherProps }, context);
    const queryNode = getOperationDefinitions(ast, context.data.operation)[0];

    if (!queryNode) {
      return cacheMetadata;
    }

    const fieldsAndTypeNames = getChildFields(queryNode);

    if (!fieldsAndTypeNames) {
      return cacheMetadata;
    }

    for (const { fieldNode } of fieldsAndTypeNames)
      this._setFieldCacheability(
        fieldNode,
        { requestFieldPath: context.data.operation },
        { cacheMetadata, data },
        options,
        context,
      );

    return cacheMetadata;
  }

  private async _cacheResponse(
    requestData: RequestData,
    updatedRequestData: RequestData | undefined,
    rawResponseData: RawResponseDataWithMaybeCacheMetadata,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<ResponseData> {
    const normalizedResponseData = normalizePatchResponseData(rawResponseData, context);
    let responseDataForCaching: RawResponseDataWithMaybeCacheMetadata | undefined = normalizedResponseData;

    if (isNotLastResponseChunk(rawResponseData, context)) {
      this._setResponseChunksAwaitingCaching(normalizedResponseData, context);
      responseDataForCaching = undefined;
    }

    if (isLastResponseChunk(rawResponseData, context)) {
      responseDataForCaching = this._retrieveResponseDataForCaching(normalizedResponseData, context);
    }

    const dataCaching: Promise<void>[] = [];

    if (responseDataForCaching && someCacheTiersEnabled(this._cacheTiersEnabled)) {
      const { data } = responseDataForCaching;
      const cacheMetadata = this._buildCacheMetadata(requestData, responseDataForCaching, options, context);

      if (entityOrRequestPathCacheTiersEnabled(this._cacheTiersEnabled)) {
        dataCaching.push(
          this._setEntityAndRequestFieldPathCacheEntries(
            requestData,
            {
              cacheMetadata,
              entityData: structuredClone(data),
              requestFieldPathData: structuredClone(data),
            },
            options,
            context,
          ),
        );
      }

      let queryCacheMetadata: CacheMetadata | undefined;
      let queryData: PlainData | undefined;

      if (
        context.data.operation === OperationTypeNode.QUERY &&
        queryResponseCacheTierEnabled(this._cacheTiersEnabled)
      ) {
        let partialQueryResponse: PartialQueryResponse | undefined;

        if (context.data.queryFiltered && updatedRequestData) {
          dataCaching.push(
            this._setQueryResponseCacheEntry(updatedRequestData.hash, { cacheMetadata, data }, options, context),
          );

          partialQueryResponse = this._getPartialQueryResponse(requestData.hash);
        }

        queryCacheMetadata = CacheManager._mergeResponseCacheMetadata(cacheMetadata, partialQueryResponse);
        queryData = this._mergeResponseData(data, partialQueryResponse);

        dataCaching.push(
          this._setQueryResponseCacheEntry(
            requestData.hash,
            { cacheMetadata: queryCacheMetadata, data: queryData },
            options,
            context,
          ),
        );
      }

      if (options.awaitDataCaching) {
        await Promise.all(dataCaching);
      }

      if (isNotResponseChunk(normalizedResponseData, context) && queryCacheMetadata && queryData) {
        return {
          cacheMetadata: queryCacheMetadata,
          data: queryData,
        };
      }
    }

    const { data, hasNext, paths } = normalizedResponseData;

    return {
      cacheMetadata: this._buildCacheMetadata(requestData, normalizedResponseData, options, context),
      data,
      hasNext,
      paths,
    };
  }

  private async _checkCacheEntry<T>(
    cacheType: CacheTypes,
    hash: string,
    options: RequestOptions,
    context: CacheManagerContext & { requestFieldCacheKey?: string },
  ): Promise<CheckCacheEntryResult<T> | false> {
    try {
      const cacheability = await this._hasCacheEntry(cacheType, hash);

      if (!cacheability || !CacheManager._isValid(cacheability)) {
        return false;
      }

      const entry = await this._getCacheEntry<T>(cacheType, hash, options, context);

      if (isUndefined(entry)) {
        return false;
      }

      return { cacheability, entry };
    } catch {
      return false;
    }
  }

  private _createCacheMetadata(
    { _cacheMetadata, headers }: RawResponseDataWithMaybeCacheMetadata,
    { data }: CacheManagerContext,
  ): CacheMetadata {
    const cacheMetadata = new Map<string, Cacheability>();

    const cacheability = deriveOpCacheability({
      _cacheMetadata,
      fallback: this._fallbackOperationCacheability,
      headers,
    });

    cacheMetadata.set(data.operation, cacheability);

    if (_cacheMetadata) {
      rehydrateCacheMetadata(_cacheMetadata, cacheMetadata);
    }

    return cacheMetadata;
  }

  @logCacheQuery()
  private async _getCacheEntry<T>(
    cacheType: CacheTypes,
    hash: string,
    _options: RequestOptions,
    _context: CacheManagerContext & { requestFieldCacheKey?: string },
  ): Promise<T | undefined> {
    return this._cache?.get<T>(`${cacheType}::${hash}`);
  }

  private _getPartialQueryResponse(hash: string): PartialQueryResponse | undefined {
    const partialQueryResponse = this._partialQueryResponses.get(hash);
    this._partialQueryResponses.delete(hash);
    return partialQueryResponse;
  }

  private async _hasCacheEntry(cacheType: CacheTypes, hash: string): Promise<Cacheability | false> {
    try {
      return (await this._cache?.has(`${cacheType}::${hash}`)) ?? false;
    } catch {
      return false;
    }
  }

  private _mergeResponseData(responseData: PlainData, partialQueryResponse?: PartialQueryResponse): PlainData {
    if (!partialQueryResponse) {
      return responseData;
    }

    return mergeDataSets(partialQueryResponse.data, responseData, this._typeIDKey);
  }

  private async _parseEntityAndRequestFieldPathCacheEntryData(
    field: FieldNode,
    ancestorKeysAndPaths: AncestorKeysAndPaths,
    { cacheMetadata, entityData, requestFieldPathData }: ResponseDataForCaching,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<void> {
    const keysAndPaths = buildFieldKeysAndPaths(field, ancestorKeysAndPaths, context);
    const { hashedRequestFieldCacheKey, requestFieldCacheKey, requestFieldPath, responseDataPath } = keysAndPaths;
    // get has rubbish return typing
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const fieldData = get(requestFieldPathData, responseDataPath) as unknown;
    const fieldTypeInfo = context.fieldTypeMap.get(requestFieldPath);
    const cacheability = cacheMetadata.get(requestFieldPath);

    if (!isObjectLike(fieldData) && !fieldTypeInfo?.hasDirectives) {
      return;
    }

    if (isObjectLike(fieldData)) {
      const promises: Promise<void>[] = [];

      iterateChildFields(
        field,
        fieldData,
        context.fragmentDefinitions,
        (
          childField: FieldNode,
          _typeName: string | undefined,
          _fragmentKind: string | undefined,
          _fragmentName: string | undefined,
          childIndex?: number,
        ) => {
          promises.push(
            this._parseEntityAndRequestFieldPathCacheEntryData(
              childField,
              { index: childIndex, requestFieldCacheKey, requestFieldPath, responseDataPath },
              { cacheMetadata, entityData, requestFieldPathData },
              options,
              context,
            ),
          );
        },
      );

      await Promise.all(promises);
    }

    if (isUndefined(fieldData) || !fieldTypeInfo || !cacheability) {
      return;
    }

    const isEntity = isFieldEntity(fieldData, fieldTypeInfo, this._typeIDKey);
    const hasArgsOrDirectives = fieldTypeInfo.hasArguments || fieldTypeInfo.hasDirectives;

    if (
      context.data.operation === OperationTypeNode.QUERY &&
      (isEntity || hasArgsOrDirectives) &&
      requestPathCacheTierEnabled(this._cacheTiersEnabled)
    ) {
      await this._setRequestFieldPathCacheEntry(
        keysAndPaths,
        {
          cacheability,
          fieldData: filterOutPropsWithEntityArgsOrDirectives(structuredClone(fieldData), field, keysAndPaths, context),
          fieldTypeInfo,
        },
        options,
        context,
      );

      if (hasChildFields(field, { fragmentDefinitions: context.fragmentDefinitions })) {
        if (isEntity) {
          set(requestFieldPathData, responseDataPath, {
            __cacheKey: `${REQUEST_FIELD_PATHS}::${hashedRequestFieldCacheKey}`,
          });
        } else {
          unset(requestFieldPathData, responseDataPath);
        }
      }
    }

    if (isEntity && entityCacheTierEnabled(this._cacheTiersEnabled)) {
      await this._setEntityCacheEntry(
        {
          cacheability,
          fieldData: filterOutPropsWithEntityOrArgs(
            // Casting here for ease of typing
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            structuredClone(get(entityData, responseDataPath) as EntityData),
            field,
            keysAndPaths,
            context,
          ),
          fieldTypeInfo,
        },
        options,
        context,
      );

      set(entityData, responseDataPath, {
        __cacheKey: `${DATA_ENTITIES}::${createEntityDataKey(fieldData, fieldTypeInfo, context)}`,
      });
    }
  }

  private async _retrieveCachedEntityData(
    validTypeIDValue: string | number,
    { possibleTypes, typeName }: FieldTypeInfo,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<Partial<CheckCacheEntryResult<EntityData>>> {
    const typeNames = [...possibleTypes.map(type => type.typeName), typeName];

    const checkResults = await Promise.all(
      typeNames.map(name =>
        this._checkCacheEntry<EntityData>(DATA_ENTITIES, `${name}::${String(validTypeIDValue)}`, options, context),
      ),
    );

    const validResults = checkResults.filter(result => !!result);
    let validResult: CheckCacheEntryResult<EntityData> | undefined;

    if (validResults.length === 1) {
      validResult = validResults[0];
    } else if (validResults.length > 1) {
      validResults.sort(({ cacheability: a }, { cacheability: b }) => a.metadata.ttl - b.metadata.ttl);

      const firstResult = validResults[0];

      if (firstResult) {
        validResult = {
          cacheability: firstResult.cacheability,
          // By the time the merge has happened, the type is EntityData
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          entry: validResults.reduce<Partial<EntityData>>(
            (obj, { entry }) => mergeDataSets(obj, entry, this._typeIDKey),
            {},
          ) as EntityData,
        };
      }
    }

    return validResult ?? {};
  }

  private async _retrieveCachedParentNodeData(
    { entityData: ancestorEntityData, requestFieldPathData: ancestorRequestFieldPathData }: CachedAncestorFieldData,
    { hashedRequestFieldCacheKey, propNameOrIndex, requestFieldCacheKey }: KeysAndPaths,
    fieldTypeInfo: FieldTypeInfo,
    options: RequestOptions,
    context: CacheManagerContext,
  ) {
    let entityData = CacheManager._getFieldDataFromAncestor(ancestorEntityData, propNameOrIndex);
    let requestFieldPathData = CacheManager._getFieldDataFromAncestor(ancestorRequestFieldPathData, propNameOrIndex);
    let cacheability: Cacheability | undefined;

    if (CacheManager._isNodeRequestFieldPath(fieldTypeInfo) && requestPathCacheTierEnabled(this._cacheTiersEnabled)) {
      const { cacheability: entryCacheability, entry } = await this._retrieveCachedRequestFieldPathData(
        hashedRequestFieldCacheKey,
        requestFieldCacheKey,
        options,
        context,
      );

      requestFieldPathData = combineDataSets(requestFieldPathData, entry, this._typeIDKey);

      if (entryCacheability) {
        cacheability = entryCacheability;
      }
    }

    const validTypeIDValue = getValidTypeIdValue(requestFieldPathData, fieldTypeInfo, this._typeIDKey);

    if (
      CacheManager._isNodeEntity(fieldTypeInfo) &&
      validTypeIDValue &&
      entityCacheTierEnabled(this._cacheTiersEnabled)
    ) {
      const { cacheability: entryCacheability, entry } = await this._retrieveCachedEntityData(
        validTypeIDValue,
        fieldTypeInfo,
        options,
        context,
      );

      entityData = combineDataSets(entityData, entry, this._typeIDKey);

      if (entryCacheability && (!cacheability || entryCacheability.metadata.ttl > cacheability.metadata.ttl)) {
        cacheability = entryCacheability;
      }
    }

    const data = isEqual(entityData, requestFieldPathData)
      ? entityData
      : combineDataSets(entityData, requestFieldPathData, this._typeIDKey);

    return {
      cacheability,
      data,
      entityData,
      requestFieldPathData,
    };
  }

  private async _retrieveCachedRequestFieldPathData(
    hash: string,
    requestFieldCacheKey: string,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<Partial<CheckCacheEntryResult>> {
    return (
      (await this._checkCacheEntry(REQUEST_FIELD_PATHS, hash, options, { ...context, requestFieldCacheKey })) || {}
    );
  }

  private async _retrieveCachedResponseData(
    { ast }: RequestData,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<CachedResponseData> {
    const cachedResponseData: CachedResponseData = {
      cacheMetadata: new Map(),
      data: {},
      fieldCount: { missing: 0, total: 0 },
      fieldPathChecklist: new Map(),
    };

    const queryNode = getOperationDefinitions(ast, context.data.operation)[0];

    if (!queryNode) {
      return cachedResponseData;
    }

    const fieldsAndTypeNames = getChildFields(queryNode);

    if (!fieldsAndTypeNames) {
      return cachedResponseData;
    }

    await Promise.all(
      fieldsAndTypeNames.map(({ fieldNode }) =>
        this._analyzeFieldNode(
          fieldNode,
          { requestFieldPath: context.data.operation },
          cachedResponseData,
          options,
          context,
        ),
      ),
    );

    cachedResponseData.fieldCount = CacheManager._countFieldPathChecklist(cachedResponseData.fieldPathChecklist);
    return cachedResponseData;
  }

  private _retrieveResponseDataForCaching(
    normalizedResponseData: RawResponseDataWithMaybeCacheMetadata,
    context: CacheManagerContext,
  ) {
    const responseChunks = this._responseChunksAwaitingCaching.get(context.data.requestID);
    this._responseChunksAwaitingCaching.delete(context.data.requestID);
    return mergeResponseDataSets([...(responseChunks ?? []), normalizedResponseData]);
  }

  @logCacheEntry()
  private async _setCacheEntry(
    cacheType: CacheTypes,
    hash: string,
    value: unknown,
    cachemapOptions: CachemapOptions,
    _options: RequestOptions,
    _context: CacheManagerContext & { requestFieldCacheKey?: string },
  ): Promise<void> {
    try {
      await this._cache?.set(`${cacheType}::${hash}`, structuredClone(value), cachemapOptions);
    } catch {
      // no catch
    }
  }

  private async _setEntityAndRequestFieldPathCacheEntries(
    requestData: RequestData,
    responseData: ResponseDataForCaching,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<void> {
    const operationNode = getOperationDefinitions(requestData.ast, context.data.operation)[0];

    if (!operationNode) {
      return;
    }

    const fieldsAndTypeNames = getChildFields(operationNode);

    if (!fieldsAndTypeNames) {
      return;
    }

    await Promise.all(
      fieldsAndTypeNames.map(({ fieldNode }) => {
        return this._parseEntityAndRequestFieldPathCacheEntryData(
          fieldNode,
          { requestFieldPath: context.data.operation },
          responseData,
          options,
          context,
        );
      }),
    );
  }

  private async _setEntityCacheEntry(
    { cacheability, fieldData, fieldTypeInfo }: DataForCachingEntry<EntityData>,
    options: RequestOptions,
    context: CacheManagerContext,
  ) {
    const fieldTypeName = fieldTypeInfo.isEntity ? fieldTypeInfo.typeName : fieldData.__typename;
    const entityDataKey = `${fieldTypeName}::${String(fieldData[this._typeIDKey])}`;
    const result = await this._checkCacheEntry<EntityData>(DATA_ENTITIES, entityDataKey, options, context);

    if (result) {
      fieldData = mergeDataSets(result.entry, fieldData, this._typeIDKey);
    }

    await this._setCacheEntry(
      DATA_ENTITIES,
      entityDataKey,
      fieldData,
      { cacheHeaders: { cacheControl: cacheability.printCacheControl() }, tag: options.tag },
      options,
      context,
    );
  }

  private _setFieldCacheability(
    field: FieldNode,
    ancestorKeysAndPaths: AncestorKeysAndPaths,
    { cacheMetadata, data }: ResponseData,
    options: RequestOptions,
    context: CacheManagerContext,
  ): void {
    const { requestFieldPath: ancestorRequestFieldPath } = ancestorKeysAndPaths;
    const keysAndPaths = buildFieldKeysAndPaths(field, ancestorKeysAndPaths, context);
    const { requestFieldPath, responseDataPath } = keysAndPaths;

    if (!isObjectLike(data)) {
      return;
    }

    // get return type annotation is rubbish
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const fieldData = get(data, responseDataPath) as unknown;
    const fieldTypeInfo = context.fieldTypeMap.get(requestFieldPath);

    if (!isObjectLike(fieldData) && !fieldTypeInfo?.hasDirectives) {
      return;
    }

    this._setFieldTypeCacheDirective(cacheMetadata, { ancestorRequestFieldPath, requestFieldPath }, context);

    if (isObjectLike(fieldData)) {
      iterateChildFields(
        field,
        fieldData,
        context.fragmentDefinitions,
        (
          childField: FieldNode,
          _typeName: string | undefined,
          _fragmentKind: string | undefined,
          _fragmentName: string | undefined,
          childIndex?: number,
        ) => {
          this._setFieldCacheability(
            childField,
            { index: childIndex, requestFieldPath, responseDataPath },
            { cacheMetadata, data },
            options,
            context,
          );
        },
      );
    }
  }

  private _setFieldTypeCacheDirective(
    cacheMetadata: CacheMetadata,
    { ancestorRequestFieldPath, requestFieldPath }: { ancestorRequestFieldPath?: string; requestFieldPath: string },
    { data, fieldTypeMap }: CacheManagerContext,
  ): void {
    if (cacheMetadata.has(requestFieldPath)) {
      return;
    }

    const fieldTypeInfo = fieldTypeMap.get(requestFieldPath);

    if (fieldTypeInfo && this._typeCacheDirectives[fieldTypeInfo.typeName]) {
      const cacheability = new Cacheability({ cacheControl: this._typeCacheDirectives[fieldTypeInfo.typeName] });
      CacheManager._setCacheMetadata(cacheMetadata, cacheability, requestFieldPath, data.operation);
    } else if (this._cascadeCacheControl && ancestorRequestFieldPath) {
      CacheManager._setCacheMetadata(
        cacheMetadata,
        cacheMetadata.get(ancestorRequestFieldPath),
        requestFieldPath,
        data.operation,
      );
    }
  }

  @logPartialCompiled()
  private _setPartialQueryResponse(
    hash: string,
    partialQueryResponse: PartialQueryResponse,
    _options: RequestOptions,
    _context: CacheManagerContext,
  ): void {
    this._partialQueryResponses.set(hash, partialQueryResponse);
  }

  private async _setQueryResponseCacheEntry(
    hash: string,
    { cacheMetadata, data }: ResponseData,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<void> {
    const dehydratedCacheMetadata = dehydrateCacheMetadata(cacheMetadata);
    const cacheControl = CacheManager._getOperationCacheControl(cacheMetadata, context.data.operation);

    await this._setCacheEntry(
      QUERY_RESPONSES,
      hash,
      { cacheMetadata: dehydratedCacheMetadata, data },
      { cacheHeaders: { cacheControl }, tag: options.tag },
      options,
      context,
    );
  }

  private async _setRequestFieldPathCacheEntry(
    keysAndPaths: KeysAndPaths,
    { cacheability, fieldData }: DataForCachingEntry,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<void> {
    const { hashedRequestFieldCacheKey, requestFieldCacheKey } = keysAndPaths;

    const result = await this._checkCacheEntry(REQUEST_FIELD_PATHS, hashedRequestFieldCacheKey, options, {
      ...context,
      requestFieldCacheKey,
    });

    if (result && isObjectLike(result.entry) && isObjectLike(fieldData)) {
      fieldData = mergeDataSets(result.entry, fieldData, this._typeIDKey);
    }

    void this._setCacheEntry(
      REQUEST_FIELD_PATHS,
      hashedRequestFieldCacheKey,
      fieldData,
      { cacheHeaders: { cacheControl: cacheability.printCacheControl() }, tag: options.tag },
      options,
      { ...context, requestFieldCacheKey },
    );
  }

  private _setResponseChunksAwaitingCaching(
    normalizedResponseData: RawResponseDataWithMaybeCacheMetadata,
    context: CacheManagerContext,
  ) {
    const responseChunks = this._responseChunksAwaitingCaching.get(context.data.requestID);

    if (responseChunks) {
      this._responseChunksAwaitingCaching.set(context.data.requestID, [...responseChunks, normalizedResponseData]);
    } else {
      this._responseChunksAwaitingCaching.set(context.data.requestID, [normalizedResponseData]);
    }
  }
}
