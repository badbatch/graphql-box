import Cachemap from "@cachemap/core";
import { coreDefs, hashRequest } from "@handl/core";
import { debugDefs } from "@handl/debug-manager";
import {
  deleteChildFields,
  getAlias,
  getArguments,
  getChildFields,
  getDirectives,
  getName,
  getOperationDefinitions,
  hasChildFields,
  iterateChildFields,
  mergeObjects,
} from "@handl/helpers";
import Cacheability from "cacheability";
import { FieldNode, print } from "graphql";
import { cloneDeep, get, isArray, isNumber, isObjectLike, isPlainObject, isUndefined, unset } from "lodash";
import {
  CACHE_CONTROL,
  DATA_ENTITIES,
  HEADER_CACHE_CONTROL,
  HEADER_NO_CACHE,
  METADATA,
  NO_CACHE,
  QUERY,
  QUERY_RESPONSES,
  REQUEST_FIELD_PATHS,
} from "../consts";
import { logCacheEntry, logCacheQuery, logPartialCompiled } from "../debug";
import * as defs from "../defs";

export class CacheManager implements defs.CacheManager  {
  public static async init(options: defs.InitOptions): Promise<CacheManager> {
    const errors: TypeError[] = [];

    if (!options.cache) {
       errors.push(new TypeError("@handl/cache-manager expected options.cache."));
    }

    if (!!options.typeCacheDirectives && !isPlainObject(options.typeCacheDirectives)) {
      errors.push(new TypeError("@handl/cache-manager expected options.typeCacheDirectives to be a plain object."));
    }

    if (errors.length) return Promise.reject(errors);

    try {
      CacheManager._debugManager = options.debugManager;
      return new CacheManager(options);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private static _debugManager: debugDefs.DebugManager | undefined;

  private static _analyzeLeafField(
    field: FieldNode,
    cachedAncestorFieldData: defs.CachedAncestorFieldData,
    { data, fieldCount, fieldPathChecklist }: defs.CachedResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): void {
    const keysAndPaths = CacheManager._getFieldKeysAndPaths(field, cachedAncestorFieldData);
    const { propNameOrIndex, requestFieldPath } = keysAndPaths;

    const {
      dataEntityData: ancestorDataEntityData,
      requestFieldPathData: ancestorRequestFieldPathData,
    } = cachedAncestorFieldData;

    const cachedFieldData: defs.CachedAncestorFieldData = {
      dataEntityData: CacheManager._getFieldDataFromAncestor(ancestorDataEntityData, propNameOrIndex),
      requestFieldPathData: CacheManager._getFieldDataFromAncestor(ancestorRequestFieldPathData, propNameOrIndex),
    };

    CacheManager._setFieldPathChecklist(fieldPathChecklist, cachedFieldData, requestFieldPath);
    CacheManager._setFieldCount(fieldCount, cachedFieldData);
    CacheManager._setCachedData(data, cachedFieldData, propNameOrIndex);
  }

  private static _buildRequestFieldCacheKey(
    name: string,
    requestFieldCacheKey: string,
    args?: coreDefs.PlainObjectMap,
    directives?: coreDefs.PlainObjectMap,
    index?: number,
  ): string {
    let key = `${isNumber(index) ? index : name}`;
    if (args) key = `${key}(${JSON.stringify(args)})`;
    if (directives) key = `${key}(${JSON.stringify(directives)})`;
    return CacheManager._buildKey(key, requestFieldCacheKey);
  }

  private static _buildKey(key: string | number, path: string): string {
    const paths: Array<string | number> = [];
    if (path.length) paths.push(path);
    paths.push(key);
    return paths.join(".");
  }

  private static _dehydrateCacheMetadata(cacheMetadata: defs.CacheMetadata): defs.DehydratedCacheMetadata {
    const obj: defs.DehydratedCacheMetadata = {};

    cacheMetadata.forEach((cacheability, key) => {
      obj[key] = cacheability.metadata;
    });

    return obj;
  }

  private static _filterField(
    field: FieldNode,
    fieldPathChecklist: defs.FieldPathChecklist,
    ancestorRequestFieldPath: string,
  ): boolean {
    const childFields = getChildFields(field) as FieldNode[] | undefined;
    if (!childFields) return false;

    for (let i = childFields.length - 1; i >= 0; i -= 1) {
      const childField = childFields[i];

      const { requestFieldPath } = CacheManager._getFieldKeysAndPaths(
        field,
        { requestFieldPath: ancestorRequestFieldPath },
      );

      const check = fieldPathChecklist.get(requestFieldPath);

      if (check && !hasChildFields(childField)) {
        deleteChildFields(field, childField);
      } else if (check && CacheManager._filterField(childField, fieldPathChecklist, requestFieldPath)) {
        deleteChildFields(field, childField);
      }
    }

    return !hasChildFields(field);
  }

  private static async _filterQuery(
    { ast }: coreDefs.RequestData,
    { fieldPathChecklist }: defs.CachedResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<void> {
    const queryNode = getOperationDefinitions(ast, context.operation)[0];
    const fields = getChildFields(queryNode) as FieldNode[];

    for (let i = fields.length - 1; i >= 0; i -= 1) {
      const field = fields[i];
      const { requestFieldPath } = CacheManager._getFieldKeysAndPaths(field, {});
      if (CacheManager._filterField(field, fieldPathChecklist, requestFieldPath)) deleteChildFields(queryNode, field);
    }

    context.queryFiltered = true;
  }

  private static _getFieldDataFromAncestor(ancestorFieldData: any, propNameOrIndex: string | number): any {
    return isObjectLike(ancestorFieldData) ? ancestorFieldData[propNameOrIndex] : undefined;
  }

  private static _getFieldDataFromResponseDataPath(
    data: coreDefs.PlainObjectMap,
    responseDataPath: string = "",
  ): any {
    return get(data, responseDataPath, null);
  }

  private static _getFieldKeysAndPaths(
    field: FieldNode,
    options: defs.KeysAndPathsOptions,
  ): defs.KeysAndPaths {
    const { index, requestFieldCacheKey = "", requestFieldPath = "", responseDataPath = "" } = options;
    const name = getName(field) as string;

    const updatedRequestFieldCacheKey = CacheManager._buildRequestFieldCacheKey(
      name,
      requestFieldCacheKey,
      getArguments(field),
      getDirectives(field),
      index,
    );

    const fieldAliasOrName = getAlias(field) || name;

    const updatedRequestFieldPath = isNumber(index)
      ? requestFieldPath
      : CacheManager._buildKey(fieldAliasOrName, requestFieldPath);

    const propNameOrIndex = isNumber(index) ? index : fieldAliasOrName;
    const updatedResponseDataPath = CacheManager._buildKey(propNameOrIndex, responseDataPath);

    return {
      hashedRequestFieldCacheKey: hashRequest(updatedRequestFieldCacheKey),
      propNameOrIndex,
      requestFieldCacheKey: updatedRequestFieldCacheKey,
      requestFieldPath: updatedRequestFieldPath,
      responseDataPath: updatedResponseDataPath,
    };
  }

  private static _getOperationCacheControl(
    cacheMetadata: coreDefs.CacheMetadata | undefined,
    operation: string,
  ): string {
    const defaultCacheControl = HEADER_NO_CACHE;
    if (!cacheMetadata) return defaultCacheControl;

    const cacheability = cacheMetadata.get(operation);
    return cacheability ? cacheability.printCacheControl() : defaultCacheControl;
  }

  private static _getResponseCacheMetadata(
    cacheMetadata: coreDefs.CacheMetadata,
    partialQueryResponse?: defs.PartialQueryResponse,
  ): coreDefs.CacheMetadata {
    if (!partialQueryResponse) return cacheMetadata;

    return new Map([...partialQueryResponse.cacheMetadata, ...cacheMetadata]);
  }

  private static _getValidFieldData({ dataEntityData, requestFieldPathData }: defs.CachedFieldData): any {
    return !isUndefined(requestFieldPathData) ? requestFieldPathData : dataEntityData;
  }

  private static _isDataEntity(fieldTypeInfo?: coreDefs.FieldTypeInfo): boolean {
    return !!fieldTypeInfo && fieldTypeInfo.isEntity;
  }

  private static _isRequestFieldPath(fieldTypeInfo?: coreDefs.FieldTypeInfo): boolean {
    return !!fieldTypeInfo && (fieldTypeInfo.isEntity || fieldTypeInfo.hasArguments || fieldTypeInfo.hasDirectives);
  }

  private static _isValid(cacheability: Cacheability): boolean {
    const noCache = get(cacheability, [METADATA, CACHE_CONTROL, NO_CACHE], false);
    return !noCache && cacheability.checkTTL();
  }

  private static _rehydrateCacheMetadata(
    dehydratedCacheMetadata: defs.DehydratedCacheMetadata,
    cacheMetadata: defs.CacheMetadata = new Map(),
  ): defs.CacheMetadata {
    return Object.keys(dehydratedCacheMetadata).reduce((map: defs.CacheMetadata, key: string) => {
      const cacheability = new Cacheability({ metadata: dehydratedCacheMetadata[key] });
      map.set(key, cacheability);
      return map;
    }, cacheMetadata);
  }

  private static _setCachedResponseData(
    cachedFieldData: defs.CachedFieldData,
    { cacheMetadata, data, fieldCount, fieldPathChecklist }: defs.CachedResponseData,
    { propNameOrIndex, requestFieldPath }: defs.KeysAndPaths,
    options: coreDefs.RequestOptions,
    { operation }: coreDefs.RequestContext,
  ) {
    CacheManager._setCacheMetadata(cacheMetadata, cachedFieldData, requestFieldPath, operation);
    CacheManager._setFieldPathChecklist(fieldPathChecklist, cachedFieldData, requestFieldPath);
    CacheManager._setFieldCount(fieldCount, cachedFieldData);
    CacheManager._setCachedData(data, cachedFieldData, propNameOrIndex);
  }

  private static _setCachedData(
    requestData: coreDefs.PlainObjectMap,
    cachedFieldData: defs.CachedFieldData,
    propNameOrIndex: string | number,
  ): void {
    const data = CacheManager._getValidFieldData(cachedFieldData);

    if (!isObjectLike(data) && !isUndefined(data)) {
      requestData[propNameOrIndex] = data as string | number | boolean | null;
    } else if (isObjectLike(data)) {
      const objectLikeData = data as coreDefs.PlainObjectMap | any[];
      requestData[propNameOrIndex] = isArray(objectLikeData) ? [] : {};
    }
  }

  private static _setCacheMetadata(
    cacheMetadata: defs.CacheMetadata,
    { cacheability }: defs.CachedFieldData,
    requestFieldPath: string,
    operation: string,
  ): void {
    if (!cacheability) return;

    cacheMetadata.set(requestFieldPath, cacheability);
    const operationCacheability = cacheMetadata.get(operation);

    if (!operationCacheability || (operationCacheability.metadata.ttl > cacheability.metadata.ttl)) {
      cacheMetadata.set(operation, cacheability);
    }
  }

  private static _setFieldCount(fieldCount: defs.FieldCount, cachedFieldData: defs.CachedFieldData): void {
    const data = CacheManager._getValidFieldData(cachedFieldData);
    if (isUndefined(data)) fieldCount.missing += 1;
    fieldCount.total += 1;
  }

  private static _setFieldPathChecklist(
    fieldPathChecklist: defs.FieldPathChecklist,
    cachedFieldData: defs.CachedFieldData,
    requestFieldPath: string,
  ): void {
    if (fieldPathChecklist.has(requestFieldPath)) return;

    const data = CacheManager._getValidFieldData(cachedFieldData);
    fieldPathChecklist.set(requestFieldPath, !isUndefined(data));
  }

  private static _toSetDataEntityCacheEntry(
    data: coreDefs.PlainObjectMap | any[],
    requestFieldPath: string,
    { fieldTypeMap, operation }: coreDefs.RequestContext,
  ): boolean {
    const fieldTypeInfo = fieldTypeMap.get(requestFieldPath);
    if (!fieldTypeInfo) return false;

    return fieldTypeInfo.isEntity && isPlainObject(data);
  }

  private static _toSetRequestFieldPathCacheEntry(
    data: coreDefs.PlainObjectMap | any[],
    requestFieldPath: string,
    { fieldTypeMap, operation }: coreDefs.RequestContext,
  ): boolean {
    const fieldTypeInfo = fieldTypeMap.get(requestFieldPath);
    if (!fieldTypeInfo) return false;

    const hasArgsOrDirectives = fieldTypeInfo.hasArguments || fieldTypeInfo.hasDirectives;
    return operation === QUERY && ((fieldTypeInfo.isEntity && isPlainObject(data)) || hasArgsOrDirectives);
  }

  private _cache: Cachemap;
  private _cascadeCacheControl: boolean;
  private _fallbackOperationCacheability: string;
  private _partialQueryResponses: Map<string, defs.PartialQueryResponse> = new Map();
  private _typeCacheDirectives: coreDefs.PlainObjectStringMap;
  private _typeIDKey: string;

  constructor(options: defs.ConstructorOptions) {
    this._cache = options.cache;
    this._cascadeCacheControl = options.cascadeCacheControl || false;
    this._fallbackOperationCacheability = options.fallbackOperationCacheability || NO_CACHE;
    this._typeCacheDirectives = options.typeCacheDirectives || {};
    this._typeIDKey = options.typeIDKey;
  }

  get cache(): Cachemap {
    return this._cache;
  }

  public async analyzeQuery(
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<defs.AnalyzeQueryResult> {
    const { ast, hash } = requestData;

    if (!ast) {
      return Promise.reject(new TypeError("@handl/cache-manager expected an AST."));
    }

    const cachedResponseData = await this._getCachedResponseData(requestData, options, context);

    const { cacheMetadata, data, fieldCount } = cachedResponseData;
    if (fieldCount.missing === fieldCount.total) return { updated: requestData };

    if (!fieldCount.missing) {
      const dataCaching = this._setQueryResponseCacheEntry(hash, { cacheMetadata, data }, options, context);
      if (options.awaitDataCaching) await dataCaching;

      return { response: { cacheMetadata, data } };
    }

    this._setPartialQueryResponse(hash, { cacheMetadata, data }, options, context);
    await CacheManager._filterQuery(requestData, cachedResponseData, options, context);

    const request = print(ast);
    return { updated: { ast, hash: hashRequest(request), request } };
  }

  public async checkCacheEntry(
    cacheType: coreDefs.CacheTypes,
    hash: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<defs.CheckCacheEntryResult | false> {
    return this._checkCacheEntry(cacheType, hash, options, context);
  }

  public async checkQueryResponseCacheEntry(
    hash: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.ResponseData | false> {
    const result = await this._checkCacheEntry(QUERY_RESPONSES, hash, options, context);

    if (!result) return false;

    const { cacheMetadata, data } = result.entry as defs.QueryResponseCacheEntry;

    return {
      cacheMetadata: CacheManager._rehydrateCacheMetadata(cacheMetadata),
      data,
    };
  }

  public deletePartialQueryResponse(hash: string): void {
    this._partialQueryResponses.delete(hash);
  }

  public async resolveQuery(
    requestData: coreDefs.RequestData,
    updatedRequestData: coreDefs.RequestData,
    rawResponseData: coreDefs.RawResponseDataWithMaybeCacheMetadata,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.ResponseData> {
    const dataCaching: Array<Promise<void>> = [];
    const { cacheMetadata, data } = await this._resolveRequest(updatedRequestData, rawResponseData, options, context);

    let partialQueryResponse: defs.PartialQueryResponse | undefined;

    if (context.queryFiltered) {
      dataCaching.push(this._setQueryResponseCacheEntry(
        updatedRequestData.hash,
        { cacheMetadata, data },
        options,
        context,
      ));

      partialQueryResponse = this._getPartialQueryResponse(requestData.hash);
    }

    const responseCacheMetadata = CacheManager._getResponseCacheMetadata(cacheMetadata, partialQueryResponse);
    const responseData = this._getResponseData(data, partialQueryResponse);

    dataCaching.push(this._setQueryResponseCacheEntry(
      requestData.hash,
      { cacheMetadata: responseCacheMetadata, data: responseData },
      options,
      context,
    ));

    if (options.awaitDataCaching) await Promise.all(dataCaching);

    return { cacheMetadata: responseCacheMetadata, data: responseData };
  }

  public async resolveRequest(
    requestData: coreDefs.RequestData,
    rawResponseData: coreDefs.RawResponseDataWithMaybeCacheMetadata,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.ResponseData> {
    return this._resolveRequest(requestData, rawResponseData, options, context);
  }

  private async _analyzeField(
    field: FieldNode,
    cachedAncestorFieldData: defs.CachedAncestorFieldData,
    cachedResponseData: defs.CachedResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<void> {
    if (hasChildFields(field)) {
      await this._analyzeParentField(field, cachedAncestorFieldData, cachedResponseData, options, context);
    } else {
      await CacheManager._analyzeLeafField(field, cachedAncestorFieldData, cachedResponseData, options, context);
    }
  }

  private async _analyzeParentField(
    field: FieldNode,
    cachedAncestorFieldData: defs.CachedAncestorFieldData,
    cachedResponseData: defs.CachedResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<void> {
    const keysAndPaths = CacheManager._getFieldKeysAndPaths(field, cachedAncestorFieldData);
    const { hashedRequestFieldCacheKey, propNameOrIndex, requestFieldCacheKey, requestFieldPath } = keysAndPaths;
    const fieldTypeInfo = context.fieldTypeMap.get(requestFieldPath);

    const {
      dataEntityData: ancestorDataEntityData,
      requestFieldPathData: ancestorRequestFieldPathData,
    } = cachedAncestorFieldData;

    const cachedFieldData: defs.CachedFieldData = {
      dataEntityData: CacheManager._getFieldDataFromAncestor(ancestorDataEntityData, propNameOrIndex),
      requestFieldPathData: CacheManager._getFieldDataFromAncestor(ancestorRequestFieldPathData, propNameOrIndex),
    };

    if (CacheManager._isRequestFieldPath(fieldTypeInfo)) {
      this._setRequestFieldPathData(cachedFieldData, hashedRequestFieldCacheKey, options, context);
    }

    if (CacheManager._isDataEntity(fieldTypeInfo)) {
      this._setDataEntityData(cachedFieldData, fieldTypeInfo as coreDefs.FieldTypeInfo, options, context);
    }

    CacheManager._setCachedResponseData(cachedFieldData, cachedResponseData, keysAndPaths, options, context);
    const data = CacheManager._getValidFieldData(cachedFieldData);
    if (!isObjectLike(data)) return;

    const objectLikeData = data as coreDefs.PlainObjectMap | any[];
    const promises: Array<Promise<void>> = [];

    iterateChildFields(field, objectLikeData, (childField: FieldNode, childIndex?: number) => {
      promises.push(this._analyzeField(
        childField,
        { index: childIndex, requestFieldCacheKey, requestFieldPath, ...cachedFieldData },
        { ...cachedResponseData, data: cachedResponseData.data[propNameOrIndex] },
        options,
        context,
      ));
    });

    await Promise.all(promises);
  }

  private _buildCacheMetadata(
    { ast }: coreDefs.RequestData,
    { data, ...otherProps }: coreDefs.RawResponseDataWithMaybeCacheMetadata,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): coreDefs.CacheMetadata {
    const cacheMetadata = this._createCacheMetadata({ data, ...otherProps }, context);
    const queryNode = getOperationDefinitions(ast, context.operation)[0];
    const fields = getChildFields(queryNode) as FieldNode[];
    fields.forEach((field) => this._setFieldCacheability(field, {}, { cacheMetadata, data }, options, context));
    return cacheMetadata;
  }

  private _buildDataEntityCacheKey(
    { requestFieldPathData }: defs.CachedAncestorFieldData,
    { typeIDValue, typeName }: coreDefs.FieldTypeInfo,
  ): string {
    if (typeIDValue) return `${typeName}::${typeIDValue}`;

    let requestFieldPathDataIDValue: string | number | undefined;

    if (requestFieldPathData && isPlainObject(requestFieldPathData)) {
      requestFieldPathDataIDValue = requestFieldPathData[this._typeIDKey];
    }

    return requestFieldPathDataIDValue ? `${typeName}::${requestFieldPathDataIDValue}` : "";
  }

  private async _checkCacheEntry(
    cacheType: coreDefs.CacheTypes,
    hash: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<defs.CheckCacheEntryResult | false> {
    try {
      const cacheability = await this._hasCacheEntry(cacheType, hash);

      if (!cacheability || !CacheManager._isValid(cacheability)) return false;

      const entry = await this._getCacheEntry(cacheType, hash, options, context);

      if (!entry) return false;

      return { cacheability, entry };
    } catch (error) {
      return false;
    }
  }

  private _createCacheMetadata(
    rawResponseData: coreDefs.RawResponseDataWithMaybeCacheMetadata,
    { operation }: coreDefs.RequestContext,
  ): coreDefs.CacheMetadata {
    const cacheMetadata = new Map();
    const cacheControl = rawResponseData.headers.get(HEADER_CACHE_CONTROL) || this._fallbackOperationCacheability;
    const cacheability = new Cacheability({ cacheControl });
    cacheMetadata.set(operation, cacheability);

    if (rawResponseData.cacheMetadata) {
      CacheManager._rehydrateCacheMetadata(rawResponseData.cacheMetadata, cacheMetadata);
    }

    return cacheMetadata;
  }

  @logCacheQuery(CacheManager._debugManager)
  private async _getCacheEntry(
    cacheType: coreDefs.CacheTypes,
    hash: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.ResponseData> {
    try {
      return this._cache.get(`${cacheType}::${hash}`);
    } catch (errors) {
      return Promise.reject(errors);
    }
  }

  private _getPartialQueryResponse(hash: string): defs.PartialQueryResponse | undefined {
    const partialQueryResponse = this._partialQueryResponses.get(hash);
    this._partialQueryResponses.delete(hash);
    return partialQueryResponse;
  }

  private _getResponseData(
    responseData: coreDefs.PlainObjectMap,
    partialQueryResponse?: defs.PartialQueryResponse,
  ): coreDefs.PlainObjectMap {
    if (!partialQueryResponse) return responseData;

    return mergeObjects(
      partialQueryResponse.data,
      responseData,
      (key: string, val: any): string | number | undefined => {
        return isPlainObject(val) && val[this._typeIDKey] ? val[this._typeIDKey] : undefined;
      },
    );
  }

  private async _hasCacheEntry(
    cacheType: coreDefs.CacheTypes,
    hash: string,
  ): Promise<Cacheability | false> {
    try {
      return this._cache.has(`${cacheType}::${hash}`);
    } catch (error) {
      return false;
    }
  }

  private async _getCachedResponseData(
    { ast }: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<defs.CachedResponseData> {
    const cachedResponseData: defs.CachedResponseData = {
      cacheMetadata: new Map(),
      data: {},
      fieldCount: { missing: 0, total: 0 },
      fieldPathChecklist: new Map(),
    };

    const queryNode = getOperationDefinitions(ast, context.operation)[0];
    const fields = getChildFields(queryNode) as FieldNode[];
    await Promise.all(fields.map((field) => this._analyzeField(field, {}, cachedResponseData, options, context)));

    return cachedResponseData;
  }

  private async _resolveRequest(
    requestData: coreDefs.RequestData,
    rawResponseData: coreDefs.RawResponseDataWithMaybeCacheMetadata,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.ResponseData> {
    const dataCaching: Array<Promise<void>> = [];
    const cacheMetadata = this._buildCacheMetadata(requestData, rawResponseData, options, context);
    const { data } = rawResponseData;

    dataCaching.push(this._setDataEntityAndRequestFieldPathCacheEntries(
      requestData,
      { cacheMetadata, data },
      options,
      context,
    ));

    if (options.awaitDataCaching) await Promise.all(dataCaching);

    return { cacheMetadata, data: rawResponseData.data };
  }

  @logCacheEntry(CacheManager._debugManager)
  private async _setCacheEntry(
    cacheType: coreDefs.CacheTypes,
    hash: string,
    value: any,
    cachemapOptions: defs.CachemapOptions,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<void> {
    try {
      await this._cache.set(`${cacheType}::${hash}`, value, cachemapOptions);
    } catch (error) {
      // no catch
    }
  }

  private async _setDataEntityData(
    cachedFieldData: defs.CachedFieldData,
    fieldTypeInfo: coreDefs.FieldTypeInfo,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<void> {
    const checkResult = await this._checkCacheEntry(
      DATA_ENTITIES,
      this._buildDataEntityCacheKey(cachedFieldData, fieldTypeInfo),
      options,
      context,
    );

    if (checkResult) {
      const { cacheability, entry } = checkResult;
      if (cacheability && !cachedFieldData.cacheability) cachedFieldData.cacheability = cacheability;
      if (entry) cachedFieldData.dataEntityData = entry;
    }
  }

  private async _setDataEntityAndRequestFieldPathCacheEntries(
    requestData: coreDefs.RequestData,
    responseData: coreDefs.ResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<void> {
    const queryNode = getOperationDefinitions(requestData.ast, context.operation)[0];
    const fields = getChildFields(queryNode) as FieldNode[];

    await Promise.all(
      fields.map((field) => {
        return this._setFieldDataEntityAndRequestFieldPathCacheEntry(
          field,
          {},
          responseData,
          options,
          context,
        );
      }),
    );
  }

  private async _setDataEntityCacheEntry(
    { requestFieldPath }: defs.KeysAndPaths,
    { cacheMetadata, data }: coreDefs.ResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ) {
    const { fieldTypeMap } = context;
    const fieldTypeInfo = fieldTypeMap.get(requestFieldPath);
    const cacheability = cacheMetadata.get(requestFieldPath);
    if (!fieldTypeInfo || !cacheability) return;

    const entityDataKey = `${fieldTypeInfo.typeName}:${data[this._typeIDKey]}`;

    await this._setCacheEntry(
      DATA_ENTITIES,
      entityDataKey,
      cloneDeep(data),
      { cacheHeaders: { cacheControl: cacheability.printCacheControl() }, tag: options.tag },
      options,
      context,
    );
  }

  private _setFieldCacheability(
    field: FieldNode,
    ancestorKeysAndPaths: defs.AncestorKeysAndPaths,
    { cacheMetadata, data }: coreDefs.ResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): void {
    const { requestFieldPath: ancestorRequestFieldPath } = ancestorKeysAndPaths;
    const keysAndPaths = CacheManager._getFieldKeysAndPaths(field, ancestorKeysAndPaths);
    const { requestFieldPath, responseDataPath } = keysAndPaths;
    const fieldData = CacheManager._getFieldDataFromResponseDataPath(data, responseDataPath);
    if (!isObjectLike(fieldData)) return;

    const objectLikeFieldData = fieldData as coreDefs.PlainObjectMap | any[];
    this._setFieldTypeCacheDirective(cacheMetadata, { ancestorRequestFieldPath, requestFieldPath }, context);

    iterateChildFields(field, objectLikeFieldData, (childField: FieldNode, childIndex?: number) => {
      this._setFieldCacheability(
        childField,
        { index: childIndex, requestFieldPath, responseDataPath },
        { cacheMetadata, data },
        options,
        context,
      );
    });
  }

  private async _setFieldDataEntityAndRequestFieldPathCacheEntry(
    field: FieldNode,
    ancestorKeysAndPaths: defs.AncestorKeysAndPaths,
    { cacheMetadata, data }: coreDefs.ResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<void> {
    const keysAndPaths = CacheManager._getFieldKeysAndPaths(field, ancestorKeysAndPaths);
    const { requestFieldCacheKey, requestFieldPath, responseDataPath } = keysAndPaths;
    const fieldData = CacheManager._getFieldDataFromResponseDataPath(data, responseDataPath);
    if (!isObjectLike(fieldData)) return;

    const objectLikeFieldData = fieldData as coreDefs.PlainObjectMap | any[];
    const promises: Array<Promise<void>> = [];

    iterateChildFields(field, objectLikeFieldData, (childField: FieldNode, childIndex?: number) => {
      promises.push(this._setFieldDataEntityAndRequestFieldPathCacheEntry(
        childField,
        { index: childIndex, requestFieldCacheKey, requestFieldPath, responseDataPath },
        { cacheMetadata, data },
        options,
        context,
      ));
    });

    await Promise.all(promises);

    if (CacheManager._toSetRequestFieldPathCacheEntry(objectLikeFieldData, requestFieldPath, context)) {
      await this._setRequestFieldPathCacheEntry(
        keysAndPaths,
        { cacheMetadata, data: objectLikeFieldData },
        options,
        context,
      );
    }

    if (CacheManager._toSetDataEntityCacheEntry(objectLikeFieldData, requestFieldPath, context)) {
      await this._setDataEntityCacheEntry(
        keysAndPaths,
        { cacheMetadata, data: objectLikeFieldData },
        options,
        context,
      );
    }

    unset(objectLikeFieldData, responseDataPath);
  }

  private _setFieldTypeCacheDirective(
    cacheMetadata: coreDefs.CacheMetadata,
    { ancestorRequestFieldPath, requestFieldPath }: { ancestorRequestFieldPath?: string, requestFieldPath: string },
    { fieldTypeMap, operation }: coreDefs.RequestContext,
  ): void {
    if (cacheMetadata.has(requestFieldPath)) return;

    const fieldTypeInfo = fieldTypeMap.get(requestFieldPath);

    if (fieldTypeInfo && this._typeCacheDirectives[fieldTypeInfo.typeName]) {
      const cacheability = new Cacheability({ cacheControl: this._typeCacheDirectives[fieldTypeInfo.typeName] });
      CacheManager._setCacheMetadata(cacheMetadata, { cacheability }, requestFieldPath, operation);
    } else if (this._cascadeCacheControl && ancestorRequestFieldPath) {
      CacheManager._setCacheMetadata(
        cacheMetadata,
        { cacheability: cacheMetadata.get(ancestorRequestFieldPath) },
        requestFieldPath,
        operation,
      );
    }
  }

  @logPartialCompiled(CacheManager._debugManager)
  private async _setPartialQueryResponse(
    hash: string,
    partialQueryResponse: defs.PartialQueryResponse,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<void> {
    this._partialQueryResponses.set(hash, partialQueryResponse);
  }

  private async _setQueryResponseCacheEntry(
    hash: string,
    { cacheMetadata, data }: coreDefs.ResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<void> {
    const dehydratedCacheMetadata = CacheManager._dehydrateCacheMetadata(cacheMetadata);
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
    { hashedRequestFieldCacheKey, requestFieldPath }: defs.KeysAndPaths,
    { cacheMetadata, data }: coreDefs.ResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<void> {
    const cacheability = cacheMetadata.get(requestFieldPath);
    if (!cacheability) return;

    await this._setCacheEntry(
      REQUEST_FIELD_PATHS,
      hashedRequestFieldCacheKey,
      cloneDeep(data),
      { cacheHeaders: { cacheControl: cacheability.printCacheControl() }, tag: options.tag },
      options,
      context,
    );
  }

  private async _setRequestFieldPathData(
    cachedFieldData: defs.CachedFieldData,
    hash: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<void> {
    const checkResult = await this._checkCacheEntry(REQUEST_FIELD_PATHS, hash, options, context);

    if (checkResult) {
      const { cacheability, entry } = checkResult;
      if (cacheability) cachedFieldData.cacheability = cacheability;
      if (entry) cachedFieldData.requestFieldPathData = entry;
    }
  }
}

export default function init(userOptions: defs.UserOptions): defs.CacheManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@handl/cache-manager expected userOptions to be a plain object.");
  }

  return (clientOptions: defs.ClientOptions) => CacheManager.init({ ...clientOptions, ...userOptions });
}
