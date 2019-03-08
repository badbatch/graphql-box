import Cachemap from "@cachemap/core";
import {
  CacheMetadata,
  CacheTypes,
  FieldTypeInfo,
  hashRequest,
  PlainObjectMap,
  PlainObjectStringMap,
  RawResponseDataWithMaybeCacheMetadata,
  RequestContext,
  RequestData,
  RequestOptions,
  ResponseData,
} from "@handl/core";
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
import { cloneDeep, get, isArray, isNumber, isObjectLike, isPlainObject, isUndefined, set, unset } from "lodash";
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
  TYPE_NAME_KEY,
} from "../consts";
import { logCacheEntry, logCacheQuery, logPartialCompiled } from "../debug";
import {
  AnalyzeQueryResult,
  AncestorKeysAndPaths,
  CachedAncestorFieldData,
  CachedFieldData,
  CachedResponseData,
  CacheManagerDef,
  CacheManagerInit,
  CachemapOptions,
  CheckCacheEntryResult,
  ClientOptions,
  ConstructorOptions,
  DataForCachingEntry,
  FieldCount,
  FieldPathChecklist,
  InitOptions,
  KeysAndPaths,
  KeysAndPathsOptions,
  MergedCachedFieldData,
  PartialQueryResponse,
  PartialQueryResponses,
  QueryResponseCacheEntry,
  ResponseDataForCaching,
  UserOptions,
} from "../defs";
import { dehydrateCacheMetadata, rehydrateCacheMetadata } from "../helpers/cache-metadata";

export class CacheManager implements CacheManagerDef  {
  public static async init(options: InitOptions): Promise<CacheManager> {
    const errors: TypeError[] = [];

    if (!options.cache) {
       errors.push(new TypeError("@handl/cache-manager expected options.cache."));
    }

    if (!!options.typeCacheDirectives && !isPlainObject(options.typeCacheDirectives)) {
      errors.push(new TypeError("@handl/cache-manager expected options.typeCacheDirectives to be a plain object."));
    }

    if (errors.length) return Promise.reject(errors);

    return new CacheManager(options);
  }

  private static _analyzeLeafField(
    field: FieldNode,
    cachedAncestorFieldData: CachedAncestorFieldData,
    { data, fieldCount, fieldPathChecklist }: CachedResponseData,
    options: RequestOptions,
    context: RequestContext,
  ): void {
    const keysAndPaths = CacheManager._getFieldKeysAndPaths(field, cachedAncestorFieldData);
    const { propNameOrIndex, requestFieldPath } = keysAndPaths;
    const { dataEntityData, requestFieldPathData } = cachedAncestorFieldData;

    const cachedFieldData = CacheManager._getFieldDataFromAncestor(dataEntityData, propNameOrIndex)
      || CacheManager._getFieldDataFromAncestor(requestFieldPathData, propNameOrIndex);

    CacheManager._setFieldPathChecklist(fieldPathChecklist, { data: cachedFieldData }, requestFieldPath);
    CacheManager._setFieldCount(fieldCount, { data: cachedFieldData });
    CacheManager._setCachedData(data, { data: cachedFieldData }, propNameOrIndex);
  }

  private static _buildRequestFieldCacheKey(
    name: string,
    requestFieldCacheKey: string,
    args?: PlainObjectMap,
    directives?: PlainObjectMap,
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

  private static _getFieldDataFromAncestor(ancestorFieldData: any, propNameOrIndex: string | number): any {
    return isObjectLike(ancestorFieldData) ? ancestorFieldData[propNameOrIndex] : undefined;
  }

  private static _getFieldKeysAndPaths(
    field: FieldNode,
    options: KeysAndPathsOptions,
  ): KeysAndPaths {
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
    cacheMetadata: CacheMetadata | undefined,
    operation: string,
  ): string {
    const defaultCacheControl = HEADER_NO_CACHE;
    if (!cacheMetadata) return defaultCacheControl;

    const cacheability = cacheMetadata.get(operation);
    return cacheability ? cacheability.printCacheControl() : defaultCacheControl;
  }

  private static _getResponseCacheMetadata(
    cacheMetadata: CacheMetadata,
    partialQueryResponse?: PartialQueryResponse,
  ): CacheMetadata {
    if (!partialQueryResponse) return cacheMetadata;

    return new Map([...partialQueryResponse.cacheMetadata, ...cacheMetadata]);
  }

  private static _isDataEntity(fieldTypeInfo?: FieldTypeInfo): boolean {
    if (!fieldTypeInfo) return false;

    const { isEntity, possibleTypes } = fieldTypeInfo;
    return isEntity || possibleTypes.some((type) => !!type.isEntity);
  }

  private static _isFieldEntity(fieldData: any, { isEntity, possibleTypes }: FieldTypeInfo): boolean {
    if (isEntity) return true;
    if (!possibleTypes.length) return false;
    return possibleTypes.some((type) => type.typeName === fieldData.__typename);
  }

  private static _isRequestFieldPath(fieldTypeInfo?: FieldTypeInfo): boolean {
    return !!fieldTypeInfo
      && (this._isDataEntity(fieldTypeInfo)
      || fieldTypeInfo.hasArguments
      || fieldTypeInfo.hasDirectives);
  }

  private static _isValid(cacheability: Cacheability): boolean {
    const noCache = get(cacheability, [METADATA, CACHE_CONTROL, NO_CACHE], false);
    return !noCache && cacheability.checkTTL();
  }

  private static _setCachedResponseData(
    cachedFieldData: MergedCachedFieldData,
    { cacheMetadata, data, fieldCount, fieldPathChecklist }: CachedResponseData,
    { propNameOrIndex, requestFieldPath }: KeysAndPaths,
    options: RequestOptions,
    { operation }: RequestContext,
  ) {
    CacheManager._setCacheMetadata(cacheMetadata, cachedFieldData.cacheability, requestFieldPath, operation);
    CacheManager._setFieldPathChecklist(fieldPathChecklist, cachedFieldData, requestFieldPath);
    CacheManager._setFieldCount(fieldCount, cachedFieldData);
    CacheManager._setCachedData(data, cachedFieldData, propNameOrIndex);
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

  private static _setCacheMetadata(
    cacheMetadata: CacheMetadata,
    cacheability: Cacheability | undefined,
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

  private static _setFieldCount(fieldCount: FieldCount, { data }: MergedCachedFieldData): void {
    if (isUndefined(data)) fieldCount.missing += 1;
    fieldCount.total += 1;
  }

  private static _setFieldPathChecklist(
    fieldPathChecklist: FieldPathChecklist,
    { data }: MergedCachedFieldData,
    requestFieldPath: string,
  ): void {
    if (fieldPathChecklist.has(requestFieldPath)) return;

    fieldPathChecklist.set(requestFieldPath, !isUndefined(data));
  }

  private _cache: Cachemap;
  private _cascadeCacheControl: boolean;
  private _fallbackOperationCacheability: string;
  private _partialQueryResponses: PartialQueryResponses = new Map();
  private _typeCacheDirectives: PlainObjectStringMap;
  private _typeIDKey: string;

  constructor(options: ConstructorOptions) {
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
    requestData: RequestData,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<AnalyzeQueryResult> {
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
    this._filterQuery(requestData, cachedResponseData, context);
    const request = print(ast);
    return { updated: { ast, hash: hashRequest(request), request } };
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

    if (!result) return false;

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
    const dataCaching: Array<Promise<void>> = [];
    const { cacheMetadata, data } = await this._resolveRequest(updatedRequestData, rawResponseData, options, context);

    let partialQueryResponse: PartialQueryResponse | undefined;

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
    requestData: RequestData,
    rawResponseData: RawResponseDataWithMaybeCacheMetadata,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<ResponseData> {
    return this._resolveRequest(requestData, rawResponseData, options, context);
  }

  private async _analyzeField(
    field: FieldNode,
    cachedAncestorFieldData: CachedAncestorFieldData,
    cachedResponseData: CachedResponseData,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<void> {
    if (hasChildFields(field)) {
      await this._analyzeParentField(field, cachedAncestorFieldData, cachedResponseData, options, context);
    } else {
      await CacheManager._analyzeLeafField(field, cachedAncestorFieldData, cachedResponseData, options, context);
    }
  }

  private async _analyzeParentField(
    field: FieldNode,
    cachedAncestorFieldData: CachedAncestorFieldData,
    cachedResponseData: CachedResponseData,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<void> {
    const keysAndPaths = CacheManager._getFieldKeysAndPaths(field, cachedAncestorFieldData);
    const { hashedRequestFieldCacheKey, propNameOrIndex, requestFieldCacheKey, requestFieldPath } = keysAndPaths;
    const fieldTypeInfo = context.fieldTypeMap.get(requestFieldPath);

    const {
      dataEntityData: ancestorDataEntityData,
      requestFieldPathData: ancestorRequestFieldPathData,
    } = cachedAncestorFieldData;

    const cachedFieldData: CachedFieldData = {
      dataEntityData: CacheManager._getFieldDataFromAncestor(ancestorDataEntityData, propNameOrIndex),
      requestFieldPathData: CacheManager._getFieldDataFromAncestor(ancestorRequestFieldPathData, propNameOrIndex),
    };

    if (CacheManager._isRequestFieldPath(fieldTypeInfo)) {
      await this._setRequestFieldPathData(cachedFieldData, hashedRequestFieldCacheKey, options, context);
    }

    if (CacheManager._isDataEntity(fieldTypeInfo)) {
      await this._setDataEntityData(cachedFieldData, fieldTypeInfo as FieldTypeInfo, options, context);
    }

    const { cacheability, dataEntityData, requestFieldPathData  } = cachedFieldData;

    const data = !isUndefined(requestFieldPathData) || !isUndefined(dataEntityData)
      ? this._mergeObjects(requestFieldPathData, dataEntityData) : undefined;

    CacheManager._setCachedResponseData({ cacheability, data }, cachedResponseData, keysAndPaths, options, context);
    if (!isObjectLike(data)) return;

    const objectLikeData = data as PlainObjectMap | any[];
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
    { ast }: RequestData,
    { data, ...otherProps }: RawResponseDataWithMaybeCacheMetadata,
    options: RequestOptions,
    context: RequestContext,
  ): CacheMetadata {
    const cacheMetadata = this._createCacheMetadata({ data, ...otherProps }, context);
    const queryNode = getOperationDefinitions(ast, context.operation)[0];
    const fields = getChildFields(queryNode) as FieldNode[];

    fields.forEach((field) => this._setFieldCacheability(
      field,
      { requestFieldPath: context.operation },
      { cacheMetadata, data },
      options,
      context,
    ));

    return cacheMetadata;
  }

  private async _checkCacheEntry(
    cacheType: CacheTypes,
    hash: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<CheckCacheEntryResult | false> {
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
    rawResponseData: RawResponseDataWithMaybeCacheMetadata,
    { operation }: RequestContext,
  ): CacheMetadata {
    const cacheMetadata = new Map();
    const cacheControl = rawResponseData.headers.get(HEADER_CACHE_CONTROL) || this._fallbackOperationCacheability;
    const cacheability = new Cacheability({ cacheControl });
    cacheMetadata.set(operation, cacheability);

    if (rawResponseData.cacheMetadata) {
      rehydrateCacheMetadata(rawResponseData.cacheMetadata, cacheMetadata);
    }

    return cacheMetadata;
  }

  private _filterField(
    field: FieldNode,
    fieldPathChecklist: FieldPathChecklist,
    ancestorRequestFieldPath: string,
    context: RequestContext,
  ): boolean {
    const childFields = getChildFields(field) as FieldNode[] | undefined;
    if (!childFields) return false;

    for (let i = childFields.length - 1; i >= 0; i -= 1) {
      const childField = childFields[i];
      const childFieldName = getName(childField);

      if (childFieldName === this._typeIDKey || childFieldName === TYPE_NAME_KEY) continue;

      const { requestFieldPath } = CacheManager._getFieldKeysAndPaths(
        childField,
        { requestFieldPath: ancestorRequestFieldPath },
      );

      const check = fieldPathChecklist.get(requestFieldPath);

      if (check && !hasChildFields(childField)) {
        deleteChildFields(field, childField);
      } else if (check && this._filterField(childField, fieldPathChecklist, requestFieldPath, context)) {
        deleteChildFields(field, childField);
      }
    }

    const fieldTypeInfo = context.fieldTypeMap.get(ancestorRequestFieldPath);

    if (fieldTypeInfo && fieldTypeInfo.isEntity && childFields.length === 1) {
      deleteChildFields(field, childFields[0]);
    }

    return !hasChildFields(field);
  }

  private _filterQuery(
    { ast }: RequestData,
    { fieldPathChecklist }: CachedResponseData,
    context: RequestContext,
  ): void {
    const queryNode = getOperationDefinitions(ast, context.operation)[0];
    const fields = getChildFields(queryNode) as FieldNode[];

    for (let i = fields.length - 1; i >= 0; i -= 1) {
      const field = fields[i];
      const { requestFieldPath } = CacheManager._getFieldKeysAndPaths(field, { requestFieldPath: context.operation });
      if (this._filterField(field, fieldPathChecklist, requestFieldPath, context)) deleteChildFields(queryNode, field);
    }

    context.queryFiltered = true;
  }

  @logCacheQuery()
  private async _getCacheEntry(
    cacheType: CacheTypes,
    hash: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<ResponseData> {
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

  private _getResponseData(
    responseData: PlainObjectMap,
    partialQueryResponse?: PartialQueryResponse,
  ): PlainObjectMap {
    if (!partialQueryResponse) return responseData;

    return this._mergeObjects(partialQueryResponse.data, responseData);
  }

  private async _hasCacheEntry(
    cacheType: CacheTypes,
    hash: string,
  ): Promise<Cacheability | false> {
    try {
      return await this._cache.has(`${cacheType}::${hash}`);
    } catch (error) {
      return false;
    }
  }

  private async _getCachedResponseData(
    { ast }: RequestData,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<CachedResponseData> {
    const cachedResponseData: CachedResponseData = {
      cacheMetadata: new Map(),
      data: {},
      fieldCount: { missing: 0, total: 0 },
      fieldPathChecklist: new Map(),
    };

    const queryNode = getOperationDefinitions(ast, context.operation)[0];
    const fields = getChildFields(queryNode) as FieldNode[];

    await Promise.all(fields.map((field) => this._analyzeField(
      field,
      { requestFieldPath: context.operation },
      cachedResponseData,
      options,
      context,
    )));

    return cachedResponseData;
  }

  private _mergeObjects<T>(obj: T, src: T): T {
    return mergeObjects(obj, src, (key: string, val: any): string | number | undefined => {
      return isPlainObject(val) && val[this._typeIDKey] ? val[this._typeIDKey] : undefined;
    });
  }

  private async _parseFieldDataEntityAndRequestFieldPathCacheEntryData(
    field: FieldNode,
    ancestorKeysAndPaths: AncestorKeysAndPaths,
    { cacheMetadata, dataEntityData, requestFieldPathData }: ResponseDataForCaching,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<void> {
    const keysAndPaths = CacheManager._getFieldKeysAndPaths(field, ancestorKeysAndPaths);
    const { requestFieldCacheKey, requestFieldPath, responseDataPath } = keysAndPaths;
    const fieldData = get(requestFieldPathData, responseDataPath, null);
    if (!isObjectLike(fieldData)) return;

    const objectLikeFieldData = fieldData as PlainObjectMap | any[];
    const promises: Array<Promise<void>> = [];

    iterateChildFields(field, objectLikeFieldData, (childField: FieldNode, childIndex?: number) => {
      promises.push(this._parseFieldDataEntityAndRequestFieldPathCacheEntryData(
        childField,
        { index: childIndex, requestFieldCacheKey, requestFieldPath, responseDataPath },
        { cacheMetadata, dataEntityData, requestFieldPathData },
        options,
        context,
      ));
    });

    await Promise.all(promises);

    await this._setFieldDataEntityAndRequestFieldPathCacheEntry(
      field,
      keysAndPaths,
      { cacheMetadata, dataEntityData, requestFieldPathData },
      options,
      context,
    );
  }

  private async _resolveRequest(
    requestData: RequestData,
    rawResponseData: RawResponseDataWithMaybeCacheMetadata,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<ResponseData> {
    const dataCaching: Array<Promise<void>> = [];
    const cacheMetadata = this._buildCacheMetadata(requestData, rawResponseData, options, context);
    const { data } = rawResponseData;

    dataCaching.push(this._setDataEntityAndRequestFieldPathCacheEntries(
      requestData,
      { cacheMetadata, dataEntityData: cloneDeep(data), requestFieldPathData: cloneDeep(data) },
      options,
      context,
    ));

    if (options.awaitDataCaching) await Promise.all(dataCaching);

    return { cacheMetadata, data };
  }

  @logCacheEntry()
  private async _setCacheEntry(
    cacheType: CacheTypes,
    hash: string,
    value: any,
    cachemapOptions: CachemapOptions,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<void> {
    try {
      await this._cache.set(`${cacheType}::${hash}`, cloneDeep(value), cachemapOptions);
    } catch (error) {
      // no catch
    }
  }

  private async _setDataEntityData(
    cachedFieldData: CachedFieldData,
    { possibleTypes, typeIDValue, typeName }: FieldTypeInfo,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<void> {
    const requestFieldPathDataIDValue = isPlainObject(cachedFieldData.requestFieldPathData)
      ? cachedFieldData.requestFieldPathData[this._typeIDKey] : undefined;

    const validTypeIDValue = typeIDValue || requestFieldPathDataIDValue;
    if (!validTypeIDValue) return;

    const typeNames = [...possibleTypes.map((type) => type.typeName), typeName];

    const checkResults = await Promise.all(typeNames.map((name) => this._checkCacheEntry(
      DATA_ENTITIES,
      `${name}::${validTypeIDValue}`,
      options,
      context,
    )));

    const validResults = checkResults.filter((result) => !!result) as CheckCacheEntryResult[];
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

    if (validResult) {
      const { cacheability, entry } = validResult;
      if (cacheability && !cachedFieldData.cacheability) cachedFieldData.cacheability = cacheability;
      if (entry) cachedFieldData.dataEntityData = entry;
    }
  }

  private async _setDataEntityAndRequestFieldPathCacheEntries(
    requestData: RequestData,
    responseData: ResponseDataForCaching,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<void> {
    const queryNode = getOperationDefinitions(requestData.ast, context.operation)[0];
    const fields = getChildFields(queryNode) as FieldNode[];

    await Promise.all(
      fields.map((field) => {
        return this._parseFieldDataEntityAndRequestFieldPathCacheEntryData(
          field,
          { requestFieldPath: context.operation },
          responseData,
          options,
          context,
        );
      }),
    );
  }

  private async _setDataEntityCacheEntry(
    { responseDataPath }: KeysAndPaths,
    { cacheability, data, fieldTypeInfo }: DataForCachingEntry,
    options: RequestOptions,
    context: RequestContext,
  ) {
    const hasArgsOrDirectives = fieldTypeInfo.hasArguments || fieldTypeInfo.hasDirectives;
    let fieldData = get(data, responseDataPath, null);
    const isEntity = CacheManager._isFieldEntity(fieldData, fieldTypeInfo);

    if (!isEntity && hasArgsOrDirectives) {
      unset(data, responseDataPath);
    }

    if (isEntity) {
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
  }

  private _setFieldCacheability(
    field: FieldNode,
    ancestorKeysAndPaths: AncestorKeysAndPaths,
    { cacheMetadata, data }: ResponseData,
    options: RequestOptions,
    context: RequestContext,
  ): void {
    const { requestFieldPath: ancestorRequestFieldPath } = ancestorKeysAndPaths;
    const keysAndPaths = CacheManager._getFieldKeysAndPaths(field, ancestorKeysAndPaths);
    const { requestFieldPath, responseDataPath } = keysAndPaths;
    const fieldData = get(data, responseDataPath, null);
    if (!isObjectLike(fieldData)) return;

    const objectLikeFieldData = fieldData as PlainObjectMap | any[];
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
    keysAndPaths: KeysAndPaths,
    { cacheMetadata, dataEntityData, requestFieldPathData }: ResponseDataForCaching,
    options: RequestOptions,
    context: RequestContext,
  ) {
    const { requestFieldPath } = keysAndPaths;
    const fieldTypeInfo = context.fieldTypeMap.get(requestFieldPath);
    const cacheability = cacheMetadata.get(requestFieldPath);
    if (!fieldTypeInfo || !cacheability) return;

    const promises: Array<Promise<void>> = [];

    promises.push(this._setRequestFieldPathCacheEntry(
      field,
      keysAndPaths,
      { cacheability, data: requestFieldPathData, fieldTypeInfo },
      options,
      context,
    ));

    promises.push(this._setDataEntityCacheEntry(
      keysAndPaths,
      { cacheability, data: dataEntityData, fieldTypeInfo },
      options,
      context,
    ));

    await Promise.all(promises);
  }

  private _setFieldTypeCacheDirective(
    cacheMetadata: CacheMetadata,
    { ancestorRequestFieldPath, requestFieldPath }: { ancestorRequestFieldPath?: string, requestFieldPath: string },
    { fieldTypeMap, operation }: RequestContext,
  ): void {
    if (cacheMetadata.has(requestFieldPath)) return;

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
    options: RequestOptions,
    context: RequestContext,
  ): Promise<void> {
    this._partialQueryResponses.set(hash, partialQueryResponse);
  }

  private async _setQueryResponseCacheEntry(
    hash: string,
    { cacheMetadata, data }: ResponseData,
    options: RequestOptions,
    context: RequestContext,
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
    { hashedRequestFieldCacheKey, responseDataPath }: KeysAndPaths,
    { cacheability, data, fieldTypeInfo }: DataForCachingEntry,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<void> {
    const hasArgsOrDirectives = fieldTypeInfo.hasArguments || fieldTypeInfo.hasDirectives;
    let fieldData = get(data, responseDataPath, null);
    const isEntity = CacheManager._isFieldEntity(fieldData, fieldTypeInfo);

    if (context.operation === QUERY && (isEntity || hasArgsOrDirectives)) {
      const result = await this._checkCacheEntry(REQUEST_FIELD_PATHS, hashedRequestFieldCacheKey, options, context);

      if (result) {
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

  private async _setRequestFieldPathData(
    cachedFieldData: CachedFieldData,
    hash: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<void> {
    const checkResult = await this._checkCacheEntry(REQUEST_FIELD_PATHS, hash, options, context);

    if (checkResult) {
      const { cacheability, entry } = checkResult;
      if (cacheability) cachedFieldData.cacheability = cacheability;
      if (entry) cachedFieldData.requestFieldPathData = entry;
    }
  }
}

export default function init(userOptions: UserOptions): CacheManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@handl/cache-manager expected userOptions to be a plain object.");
  }

  return (clientOptions: ClientOptions) => CacheManager.init({ ...clientOptions, ...userOptions });
}
