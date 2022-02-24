import Cachemap from "@cachemap/core";
import {
  CacheMetadata,
  CacheTypes,
  DATA_ENTITIES,
  FieldTypeInfo,
  PlainObjectMap,
  PlainObjectStringMap,
  QUERY,
  QUERY_RESPONSES,
  REQUEST_FIELD_PATHS,
  RawResponseDataWithMaybeCacheMetadata,
  RequestContext,
  RequestData,
  RequestOptions,
  ResponseData,
  TYPE_NAME_KEY,
} from "@graphql-box/core";
import {
  FRAGMENT_SPREAD,
  dehydrateCacheMetadata,
  getChildFields,
  getFragmentDefinitions,
  getOperationDefinitions,
  hasChildFields,
  hashRequest,
  iterateChildFields,
  mergeObjects,
  rehydrateCacheMetadata,
} from "@graphql-box/helpers";
import Cacheability from "cacheability";
import { FieldNode, print } from "graphql";
import { assign, cloneDeep, get, isArray, isObjectLike, isPlainObject, isUndefined, set, unset } from "lodash";
import { CACHE_CONTROL, HEADER_NO_CACHE, METADATA, NO_CACHE } from "../consts";
import { logCacheEntry, logCacheQuery, logPartialCompiled } from "../debug";
import {
  AnalyzeQueryResult,
  AncestorKeysAndPaths,
  CacheManagerContext,
  CacheManagerDef,
  CacheManagerInit,
  CachedAncestorFieldData,
  CachedResponseData,
  CachemapOptions,
  CheckCacheEntryResult,
  ClientOptions,
  ConstructorOptions,
  DataForCachingEntry,
  FieldCount,
  FieldPathChecklist,
  FieldPathChecklistValue,
  InitOptions,
  KeysAndPaths,
  MergedCachedFieldData,
  PartialQueryResponse,
  PartialQueryResponses,
  QueryResponseCacheEntry,
  ResponseDataForCaching,
  TypeNamesAndKind,
  UserOptions,
} from "../defs";
import { buildFieldKeysAndPaths } from "../helpers/buildKeysAndPaths";
import deriveOpCacheability from "../helpers/deriveOpCacheability";
import filterOutPropsWithArgsOrDirectives from "../helpers/filterOutPropsWithArgsOrDirectives";
import filterQuery from "../helpers/filterQuery";
import normalizeResponseData from "../helpers/normalizeResponseData";
import { getValidTypeIDValue } from "../helpers/validTypeIDValue";

export class CacheManager implements CacheManagerDef {
  public static async init(options: InitOptions): Promise<CacheManager> {
    const errors: TypeError[] = [];

    if (!options.cache) {
      errors.push(new TypeError("@graphql-box/cache-manager expected options.cache."));
    }

    if (!!options.typeCacheDirectives && !isPlainObject(options.typeCacheDirectives)) {
      const message = "@graphql-box/cache-manager expected options.typeCacheDirectives to be a plain object.";
      errors.push(new TypeError(message));
    }

    if (errors.length) {
      return Promise.reject(errors);
    }

    return new CacheManager(options);
  }

  private static _countFieldPathChecklist(fieldPathChecklist: FieldPathChecklist): FieldCount {
    const fieldCount: FieldCount = { missing: 0, total: 0 };

    fieldPathChecklist.forEach(checklistValues => {
      fieldCount.total += checklistValues.length;
      const missing = checklistValues.filter(({ hasData }) => !hasData);
      fieldCount.missing += missing.length;
    });

    return fieldCount;
  }

  private static _getFieldDataFromAncestor(ancestorFieldData: any, propNameOrIndex: string | number): any {
    return isObjectLike(ancestorFieldData) ? cloneDeep(ancestorFieldData[propNameOrIndex]) : undefined;
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
    return isEntity || possibleTypes.some(type => !!type.isEntity);
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
    requestData: PlainObjectMap,
    { data }: MergedCachedFieldData,
    propNameOrIndex: string | number,
  ): void {
    if (!isObjectLike(data) && !isUndefined(data)) {
      requestData[propNameOrIndex] = data as string | number | boolean | null;
    } else if (isObjectLike(data)) {
      const objectLikeData = data as PlainObjectMap | any[];
      requestData[propNameOrIndex] = isArray(objectLikeData) ? [] : {};
    }
  }

  private static _setCachedResponseData(
    cachedFieldData: MergedCachedFieldData,
    { cacheMetadata, data, fieldPathChecklist }: CachedResponseData,
    { propNameOrIndex, requestFieldPath }: KeysAndPaths,
    typeNamesAndKind: TypeNamesAndKind,
    _options: RequestOptions,
    { operation }: CacheManagerContext,
  ) {
    CacheManager._setCacheMetadata(cacheMetadata, cachedFieldData.cacheability, requestFieldPath, operation);
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
    { dataTypeName, fieldTypeName, fragmentKind, fragmentName }: TypeNamesAndKind,
  ): void {
    if (isUndefined(fieldTypeName) || fragmentKind === FRAGMENT_SPREAD) {
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
    const checklistValues = entry ? (entry as FieldPathChecklistValue[]) : [];

    if (checklistValues.some(({ typeName }) => typeName === dataTypeName)) {
      return;
    }

    fieldPathChecklist.set(requestFieldPath, [
      ...checklistValues,
      { fragmentKind, fragmentName, hasData: !isUndefined(data), typeName: dataTypeName as string },
    ]);
  }

  private _cache: Cachemap;
  private _cascadeCacheControl: boolean;
  private _fallbackOperationCacheability: string;
  private _partialQueryResponses: PartialQueryResponses = new Map();
  private _typeCacheDirectives: PlainObjectStringMap;
  private _typeIDKey: string;

  constructor(options: ConstructorOptions) {
    const { cache, cascadeCacheControl, fallbackOperationCacheability, typeCacheDirectives, typeIDKey } = options;
    this._cache = cache;
    this._cascadeCacheControl = cascadeCacheControl || false;
    this._fallbackOperationCacheability = fallbackOperationCacheability || NO_CACHE;
    this._typeCacheDirectives = typeCacheDirectives || {};
    this._typeIDKey = typeIDKey;
  }

  get cache(): Cachemap {
    return this._cache;
  }

  public async analyzeQuery(
    requestData: RequestData,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<AnalyzeQueryResult> {
    const { ast, hash } = requestData;

    if (!ast) {
      return Promise.reject(new TypeError("@graphql-box/cache-manager expected an AST."));
    }

    const cacheManagerContext: CacheManagerContext = {
      ...context,
      fragmentDefinitions: getFragmentDefinitions(ast),
      typeIDKey: this._typeIDKey,
    };

    const cachedResponseData = await this._retrieveCachedResponseData(requestData, options, cacheManagerContext);
    const { cacheMetadata, data, fieldCount } = cachedResponseData;

    if (fieldCount.missing === fieldCount.total) {
      return { updated: requestData };
    }

    if (!fieldCount.missing) {
      const dataCaching = this._setQueryResponseCacheEntry(hash, { cacheMetadata, data }, options, cacheManagerContext);

      if (options.awaitDataCaching) {
        await dataCaching;
      }

      return { response: { cacheMetadata, data } };
    }

    this._setPartialQueryResponse(hash, { cacheMetadata, data }, options, cacheManagerContext);
    const filteredAST = filterQuery(requestData, cachedResponseData, cacheManagerContext);
    const { fragmentDefinitions, typeIDKey, ...rest } = cacheManagerContext;
    assign(context, rest);
    const request = print(filteredAST);
    return { updated: { ast: filteredAST, hash: hashRequest(request), request } };
  }

  public async checkCacheEntry(
    cacheType: CacheTypes,
    hash: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<CheckCacheEntryResult | false> {
    return this._checkCacheEntry(cacheType, hash, options, context);
  }

  public async checkQueryResponseCacheEntry(
    hash: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<ResponseData | false> {
    const result = await this._checkCacheEntry(QUERY_RESPONSES, hash, options, context);

    if (!result) {
      return false;
    }

    const { cacheMetadata, data } = result.entry as QueryResponseCacheEntry;

    return {
      cacheMetadata: rehydrateCacheMetadata(cacheMetadata),
      data,
    };
  }

  public deletePartialQueryResponse(hash: string): void {
    this._partialQueryResponses.delete(hash);
  }

  public async resolveQuery(
    requestData: RequestData,
    updatedRequestData: RequestData,
    rawResponseData: RawResponseDataWithMaybeCacheMetadata,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<ResponseData> {
    const cacheManagerContext: CacheManagerContext = {
      ...context,
      fragmentDefinitions: getFragmentDefinitions(updatedRequestData.ast),
      typeIDKey: this._typeIDKey,
    };

    const dataCaching: Promise<void>[] = [];

    const { cacheMetadata, data, hasNext, paths } = await this._resolveRequest(
      updatedRequestData,
      rawResponseData,
      options,
      cacheManagerContext,
    );

    let partialQueryResponse: PartialQueryResponse | undefined;

    if (cacheManagerContext.queryFiltered) {
      if (!(rawResponseData.hasNext || rawResponseData.paths)) {
        dataCaching.push(
          this._setQueryResponseCacheEntry(
            updatedRequestData.hash,
            { cacheMetadata, data },
            options,
            cacheManagerContext,
          ),
        );
      }

      if (!rawResponseData.paths) {
        partialQueryResponse = this._getPartialQueryResponse(requestData.hash);
      }
    }

    const responseCacheMetadata = CacheManager._mergeResponseCacheMetadata(cacheMetadata, partialQueryResponse);
    const responseData = this._mergeResponseData(data, partialQueryResponse);

    if (!(rawResponseData.hasNext || rawResponseData.paths)) {
      dataCaching.push(
        this._setQueryResponseCacheEntry(
          requestData.hash,
          { cacheMetadata: responseCacheMetadata, data: responseData },
          options,
          cacheManagerContext,
        ),
      );
    }

    if (options.awaitDataCaching) {
      await Promise.all(dataCaching);
    }

    return { cacheMetadata: responseCacheMetadata, data: responseData, hasNext, paths };
  }

  public async resolveRequest(
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

    return this._resolveRequest(requestData, rawResponseData, options, cacheManagerContext);
  }

  private async _analyzeFieldNode(
    fieldNode: FieldNode,
    cachedAncestorFieldData: CachedAncestorFieldData,
    cachedResponseData: CachedResponseData,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<void> {
    if (hasChildFields(fieldNode)) {
      await this._analyzeParentFieldNode(fieldNode, cachedAncestorFieldData, cachedResponseData, options, context);
    } else {
      await this._analyzeLeafFieldNode(fieldNode, cachedAncestorFieldData, cachedResponseData, options, context);
    }
  }

  private async _analyzeLeafFieldNode(
    fieldNode: FieldNode,
    cachedAncestorFieldData: CachedAncestorFieldData,
    cachedResponseData: CachedResponseData,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<void> {
    const keysAndPaths = buildFieldKeysAndPaths(fieldNode, cachedAncestorFieldData, context);
    const { hashedRequestFieldCacheKey, propNameOrIndex, requestFieldPath } = keysAndPaths;
    const fieldTypeInfo = context.fieldTypeMap.get(requestFieldPath);
    const { entityData, fragmentKind, fragmentName, requestFieldPathData, typeName } = cachedAncestorFieldData;

    const typeNamesAndKind = {
      dataTypeName: entityData?.__typename || requestFieldPathData?.__typename,
      fieldTypeName: typeName,
      fragmentKind,
      fragmentName,
    };

    if (CacheManager._isNodeRequestFieldPath(fieldTypeInfo)) {
      const { cacheability, entry } = await this._retrieveCachedRequestFieldPathData(
        hashedRequestFieldCacheKey,
        options,
        context,
      );

      CacheManager._setCachedResponseData(
        { cacheability, data: entry },
        cachedResponseData,
        keysAndPaths,
        typeNamesAndKind,
        options,
        context,
      );
    } else {
      const cachedFieldData =
        CacheManager._getFieldDataFromAncestor(entityData, propNameOrIndex) ||
        CacheManager._getFieldDataFromAncestor(requestFieldPathData, propNameOrIndex);

      CacheManager._setFieldPathChecklist(
        cachedResponseData.fieldPathChecklist,
        { data: cachedFieldData },
        requestFieldPath,
        typeNamesAndKind,
      );

      CacheManager._setCachedData(cachedResponseData.data, { data: cachedFieldData }, propNameOrIndex);
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
    const fieldTypeInfo = context.fieldTypeMap.get(requestFieldPath) as FieldTypeInfo;

    const { cacheability, data, entityData, requestFieldPathData } = await this._retrieveCachedParentNodeData(
      cachedAncestorFieldData,
      keysAndPaths,
      fieldTypeInfo,
      options,
      context,
    );

    const { fragmentKind, fragmentName, typeName } = cachedAncestorFieldData;

    CacheManager._setCachedResponseData(
      { cacheability, data },
      cachedResponseData,
      keysAndPaths,
      { dataTypeName: get(data, TYPE_NAME_KEY), fieldTypeName: typeName, fragmentKind, fragmentName },
      options,
      context,
    );

    if (!isObjectLike(data)) {
      return;
    }

    const objectLikeData = data as PlainObjectMap | any[];
    const promises: Promise<void>[] = [];

    iterateChildFields(
      fieldNode,
      objectLikeData,
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
            { ...cachedResponseData, data: cachedResponseData.data[propNameOrIndex] },
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
    const queryNode = getOperationDefinitions(ast, context.operation)[0];
    const fieldsAndTypeNames = getChildFields(queryNode);

    if (!fieldsAndTypeNames) {
      return cacheMetadata;
    }

    fieldsAndTypeNames.forEach(({ fieldNode }) =>
      this._setFieldCacheability(
        fieldNode,
        { requestFieldPath: context.operation },
        { cacheMetadata, data },
        options,
        context,
      ),
    );

    return cacheMetadata;
  }

  private async _checkCacheEntry(
    cacheType: CacheTypes,
    hash: string,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<CheckCacheEntryResult | false> {
    try {
      const cacheability = await this._hasCacheEntry(cacheType, hash);

      if (!cacheability || !CacheManager._isValid(cacheability)) {
        return false;
      }

      const entry = await this._getCacheEntry(cacheType, hash, options, context);

      if (isUndefined(entry)) {
        return false;
      }

      return { cacheability, entry };
    } catch (error) {
      return false;
    }
  }

  private _createCacheMetadata(
    { _cacheMetadata, headers }: RawResponseDataWithMaybeCacheMetadata,
    { operation }: CacheManagerContext,
  ): CacheMetadata {
    const cacheMetadata = new Map();

    const cacheability = deriveOpCacheability({
      _cacheMetadata,
      fallback: this._fallbackOperationCacheability,
      headers,
    });

    cacheMetadata.set(operation, cacheability);

    if (_cacheMetadata) {
      rehydrateCacheMetadata(_cacheMetadata, cacheMetadata);
    }

    return cacheMetadata;
  }

  @logCacheQuery()
  private async _getCacheEntry(
    cacheType: CacheTypes,
    hash: string,
    _options: RequestOptions,
    _context: CacheManagerContext,
  ): Promise<any> {
    try {
      return await this._cache.get(`${cacheType}::${hash}`);
    } catch (errors) {
      return Promise.reject(errors);
    }
  }

  private _getPartialQueryResponse(hash: string): PartialQueryResponse | undefined {
    const partialQueryResponse = this._partialQueryResponses.get(hash);
    this._partialQueryResponses.delete(hash);
    return partialQueryResponse;
  }

  private async _hasCacheEntry(cacheType: CacheTypes, hash: string): Promise<Cacheability | false> {
    try {
      return await this._cache.has(`${cacheType}::${hash}`);
    } catch (error) {
      return false;
    }
  }

  private _isFieldEntity(fieldData: any, { isEntity, possibleTypes }: FieldTypeInfo): boolean {
    if (!get(fieldData, this._typeIDKey, null)) {
      return false;
    }

    if (isEntity) {
      return true;
    }

    if (!possibleTypes.length) {
      return false;
    }

    return possibleTypes.some(type => type.typeName === fieldData.__typename);
  }

  private _mergeObjects<T>(obj: T, src: T): T {
    return mergeObjects(obj, src, (_key: string, val: any): string | number | undefined => {
      return isPlainObject(val) && val[this._typeIDKey] ? val[this._typeIDKey] : undefined;
    });
  }

  private _mergeResponseData(
    responseData: PlainObjectMap,
    partialQueryResponse?: PartialQueryResponse,
  ): PlainObjectMap {
    if (!partialQueryResponse) {
      return responseData;
    }

    return this._mergeObjects(partialQueryResponse.data, responseData);
  }

  private async _parseEntityAndRequestFieldPathCacheEntryData(
    field: FieldNode,
    ancestorKeysAndPaths: AncestorKeysAndPaths,
    { cacheMetadata, entityData, requestFieldPathData }: ResponseDataForCaching,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<void> {
    const keysAndPaths = buildFieldKeysAndPaths(field, ancestorKeysAndPaths, context);
    const { requestFieldCacheKey, requestFieldPath, responseDataPath } = keysAndPaths;
    const fieldData = get(requestFieldPathData, responseDataPath);
    const fieldTypeInfo = context.fieldTypeMap.get(requestFieldPath);

    if (!isObjectLike(fieldData) && !fieldTypeInfo?.hasDirectives) {
      return;
    }

    if (isObjectLike(fieldData)) {
      const promises: Promise<void>[] = [];

      iterateChildFields(
        field,
        fieldData as PlainObjectMap | any[],
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

    await this._setEntityAndRequestFieldPathCacheEntry(
      field,
      keysAndPaths,
      { cacheMetadata, entityData, requestFieldPathData },
      options,
      context,
    );
  }

  private async _resolveRequest(
    requestData: RequestData,
    rawResponseData: RawResponseDataWithMaybeCacheMetadata,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<ResponseData> {
    const normalizedResponseData = rawResponseData.paths ? normalizeResponseData(rawResponseData) : rawResponseData;
    const dataCaching: Promise<void>[] = [];
    const cacheMetadata = this._buildCacheMetadata(requestData, normalizedResponseData, options, context);
    const { data, hasNext, paths } = normalizedResponseData;

    dataCaching.push(
      this._setEntityAndRequestFieldPathCacheEntries(
        requestData,
        { cacheMetadata, entityData: cloneDeep(data), requestFieldPathData: cloneDeep(data) },
        options,
        context,
      ),
    );

    if (options.awaitDataCaching) {
      await Promise.all(dataCaching);
    }

    return { cacheMetadata, data, hasNext, paths };
  }

  private async _retrieveCachedEntityData(
    validTypeIDValue: string | number,
    { possibleTypes, typeName }: FieldTypeInfo,
    options: RequestOptions,
    context: CacheManagerContext,
  ) {
    const typeNames = [...possibleTypes.map(type => type.typeName), typeName];

    const checkResults = await Promise.all(
      typeNames.map(name => this._checkCacheEntry(DATA_ENTITIES, `${name}::${validTypeIDValue}`, options, context)),
    );

    const validResults = checkResults.filter(result => !!result) as CheckCacheEntryResult[];
    let validResult: CheckCacheEntryResult | undefined;

    if (validResults.length === 1) {
      validResult = validResults[0];
    } else if (validResults.length > 1) {
      validResults.sort(({ cacheability: a }, { cacheability: b }) => a.metadata.ttl - b.metadata.ttl);

      validResult = {
        cacheability: validResults[0].cacheability,
        entry: validResults.reduce((obj, { entry }) => this._mergeObjects(obj, entry), {}),
      };
    }

    return (validResult || {}) as Partial<CheckCacheEntryResult>;
  }

  private async _retrieveCachedParentNodeData(
    { entityData: ancestorEntityData, requestFieldPathData: ancestorRequestFieldPathData }: CachedAncestorFieldData,
    { hashedRequestFieldCacheKey, propNameOrIndex }: KeysAndPaths,
    fieldTypeInfo: FieldTypeInfo,
    options: RequestOptions,
    context: CacheManagerContext,
  ) {
    let entityData = CacheManager._getFieldDataFromAncestor(ancestorEntityData, propNameOrIndex);
    let requestFieldPathData = CacheManager._getFieldDataFromAncestor(ancestorRequestFieldPathData, propNameOrIndex);
    let cacheability: Cacheability | undefined;

    if (CacheManager._isNodeRequestFieldPath(fieldTypeInfo)) {
      const { cacheability: entryCacheability, entry } = await this._retrieveCachedRequestFieldPathData(
        hashedRequestFieldCacheKey,
        options,
        context,
      );

      if (entry) {
        requestFieldPathData = this._mergeObjects(requestFieldPathData, entry);
      }

      if (entryCacheability) {
        cacheability = entryCacheability;
      }
    }

    const validTypeIDValue = getValidTypeIDValue(requestFieldPathData, fieldTypeInfo, this._typeIDKey);

    if (CacheManager._isNodeEntity(fieldTypeInfo) && validTypeIDValue) {
      const { cacheability: entryCacheability, entry } = await this._retrieveCachedEntityData(
        validTypeIDValue,
        fieldTypeInfo,
        options,
        context,
      );

      if (entry) {
        entityData = this._mergeObjects(entityData, entry);
      }

      if (entryCacheability && (!cacheability || entryCacheability.metadata.ttl > cacheability?.metadata.ttl)) {
        cacheability = entryCacheability;
      }
    }

    const data =
      !isUndefined(requestFieldPathData) || !isUndefined(entityData)
        ? this._mergeObjects(requestFieldPathData, entityData)
        : entityData ?? requestFieldPathData;

    return {
      cacheability,
      data,
      entityData,
      requestFieldPathData,
    };
  }

  private async _retrieveCachedRequestFieldPathData(
    hash: string,
    options: RequestOptions,
    context: CacheManagerContext,
  ) {
    return (this._checkCacheEntry(REQUEST_FIELD_PATHS, hash, options, context) || {}) as Partial<CheckCacheEntryResult>;
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

    const queryNode = getOperationDefinitions(ast, context.operation)[0];
    const fieldsAndTypeNames = getChildFields(queryNode);

    if (!fieldsAndTypeNames) {
      return cachedResponseData;
    }

    await Promise.all(
      fieldsAndTypeNames.map(({ fieldNode }) =>
        this._analyzeFieldNode(
          fieldNode,
          { requestFieldPath: context.operation },
          cachedResponseData,
          options,
          context,
        ),
      ),
    );

    cachedResponseData.fieldCount = CacheManager._countFieldPathChecklist(cachedResponseData.fieldPathChecklist);
    return cachedResponseData;
  }

  @logCacheEntry()
  private async _setCacheEntry(
    cacheType: CacheTypes,
    hash: string,
    value: any,
    cachemapOptions: CachemapOptions,
    _options: RequestOptions,
    _context: CacheManagerContext,
  ): Promise<void> {
    try {
      await this._cache.set(`${cacheType}::${hash}`, cloneDeep(value), cachemapOptions);
    } catch (error) {
      // no catch
    }
  }

  private async _setEntityAndRequestFieldPathCacheEntries(
    requestData: RequestData,
    responseData: ResponseDataForCaching,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<void> {
    const operationNode = getOperationDefinitions(requestData.ast, context.operation)[0];
    const fieldsAndTypeNames = getChildFields(operationNode);

    if (!fieldsAndTypeNames) {
      return;
    }

    await Promise.all(
      fieldsAndTypeNames.map(({ fieldNode }) => {
        return this._parseEntityAndRequestFieldPathCacheEntryData(
          fieldNode,
          { requestFieldPath: context.operation },
          responseData,
          options,
          context,
        );
      }),
    );
  }

  private async _setEntityAndRequestFieldPathCacheEntry(
    field: FieldNode,
    keysAndPaths: KeysAndPaths,
    { cacheMetadata, entityData, requestFieldPathData }: ResponseDataForCaching,
    options: RequestOptions,
    context: CacheManagerContext,
  ) {
    const { requestFieldPath, responseDataPath } = keysAndPaths;
    const fieldData = get(entityData, responseDataPath);
    const fieldTypeInfo = context.fieldTypeMap.get(requestFieldPath);
    const cacheability = cacheMetadata.get(requestFieldPath);

    if (isUndefined(fieldData) || !fieldTypeInfo || !cacheability) {
      return;
    }

    const promises: Promise<void>[] = [];

    promises.push(
      this._setRequestFieldPathCacheEntry(
        field,
        keysAndPaths,
        { cacheability, data: requestFieldPathData, fieldTypeInfo },
        options,
        context,
      ),
    );

    const isEntity = this._isFieldEntity(fieldData, fieldTypeInfo);

    if (!isEntity && fieldTypeInfo.hasArguments) {
      unset(entityData, responseDataPath);
    }

    if (isEntity) {
      promises.push(
        this._setEntityCacheEntry(keysAndPaths, { cacheability, data: entityData, fieldTypeInfo }, options, context),
      );
    }

    await Promise.all(promises);
  }

  private async _setEntityCacheEntry(
    { responseDataPath }: KeysAndPaths,
    { cacheability, data, fieldTypeInfo }: DataForCachingEntry,
    options: RequestOptions,
    context: CacheManagerContext,
  ) {
    let fieldData = get(data, responseDataPath);
    const fieldTypeName = fieldTypeInfo.isEntity ? fieldTypeInfo.typeName : fieldData.__typename;
    const entityDataKey = `${fieldTypeName}::${fieldData[this._typeIDKey]}`;
    const result = await this._checkCacheEntry(DATA_ENTITIES, entityDataKey, options, context);

    if (result) {
      fieldData = this._mergeObjects(result.entry, fieldData);
    }

    await this._setCacheEntry(
      DATA_ENTITIES,
      entityDataKey,
      fieldData,
      { cacheHeaders: { cacheControl: cacheability.printCacheControl() }, tag: options.tag },
      options,
      context,
    );

    set(data, responseDataPath, { __cacheKey: `${DATA_ENTITIES}::${entityDataKey}` });
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
    const fieldData = get(data, responseDataPath);
    const fieldTypeInfo = context.fieldTypeMap.get(requestFieldPath);

    if (!isObjectLike(fieldData) && !fieldTypeInfo?.hasDirectives) {
      return;
    }

    this._setFieldTypeCacheDirective(cacheMetadata, { ancestorRequestFieldPath, requestFieldPath }, context);

    if (isObjectLike(fieldData)) {
      iterateChildFields(
        field,
        fieldData as PlainObjectMap | any[],
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
    { fieldTypeMap, operation }: CacheManagerContext,
  ): void {
    if (cacheMetadata.has(requestFieldPath)) {
      return;
    }

    const fieldTypeInfo = fieldTypeMap.get(requestFieldPath);

    if (fieldTypeInfo && this._typeCacheDirectives[fieldTypeInfo.typeName]) {
      const cacheability = new Cacheability({ cacheControl: this._typeCacheDirectives[fieldTypeInfo.typeName] });
      CacheManager._setCacheMetadata(cacheMetadata, cacheability, requestFieldPath, operation);
    } else if (this._cascadeCacheControl && ancestorRequestFieldPath) {
      CacheManager._setCacheMetadata(
        cacheMetadata,
        cacheMetadata.get(ancestorRequestFieldPath),
        requestFieldPath,
        operation,
      );
    }
  }

  @logPartialCompiled()
  private async _setPartialQueryResponse(
    hash: string,
    partialQueryResponse: PartialQueryResponse,
    _options: RequestOptions,
    _context: CacheManagerContext,
  ): Promise<void> {
    this._partialQueryResponses.set(hash, partialQueryResponse);
  }

  private async _setQueryResponseCacheEntry(
    hash: string,
    { cacheMetadata, data }: ResponseData,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<void> {
    const dehydratedCacheMetadata = dehydrateCacheMetadata(cacheMetadata);
    const cacheControl = CacheManager._getOperationCacheControl(cacheMetadata, context.operation);

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
    field: FieldNode,
    keysAndPaths: KeysAndPaths,
    { cacheability, data, fieldTypeInfo }: DataForCachingEntry,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<void> {
    const { hashedRequestFieldCacheKey, responseDataPath } = keysAndPaths;
    let fieldData = get(data, responseDataPath);
    const isEntity = this._isFieldEntity(fieldData, fieldTypeInfo);
    const hasArgsOrDirectives = fieldTypeInfo.hasArguments || fieldTypeInfo.hasDirectives;

    if (context.operation === QUERY && (isEntity || hasArgsOrDirectives)) {
      if (isPlainObject(fieldData) && field.selectionSet?.selections) {
        fieldData = filterOutPropsWithArgsOrDirectives(fieldData, field.selectionSet.selections, keysAndPaths, context);
      }

      const result = await this._checkCacheEntry(REQUEST_FIELD_PATHS, hashedRequestFieldCacheKey, options, context);

      if (result && isObjectLike(fieldData)) {
        fieldData = this._mergeObjects(result.entry, fieldData);
      }

      await this._setCacheEntry(
        REQUEST_FIELD_PATHS,
        hashedRequestFieldCacheKey,
        fieldData,
        { cacheHeaders: { cacheControl: cacheability.printCacheControl() }, tag: options.tag },
        options,
        context,
      );

      if (hasChildFields(field)) {
        if (isEntity) {
          set(data, responseDataPath, { __cacheKey: `${REQUEST_FIELD_PATHS}::${hashedRequestFieldCacheKey}` });
        } else {
          unset(data, responseDataPath);
        }
      }
    }
  }
}

export default function init(userOptions: UserOptions): CacheManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@graphql-box/cache-manager expected userOptions to be a plain object.");
  }

  return (clientOptions: ClientOptions) => CacheManager.init({ ...clientOptions, ...userOptions });
}
