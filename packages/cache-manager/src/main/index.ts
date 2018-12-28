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
} from "@handl/helpers";
import Cacheability from "cacheability";
import { DocumentNode, FieldNode, print } from "graphql";
import { get, isArray, isNumber, isObjectLike, isPlainObject, isUndefined } from "lodash";
import { CACHE_CONTROL, DATA_ENTITIES, METADATA, NO_CACHE, REQUEST_FIELD_PATHS } from "../consts";
import logPartialCompiled from "../debug/log-partial-compiled";
import logQuery from "../debug/log-query";
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
    cachedAncestorFieldData: defs.CachedFieldData,
    { data, fieldCount, fieldPathChecklist }: defs.CachedRequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): void {
    const keysAndPaths = CacheManager._getFieldKeysAndPaths(field, cachedAncestorFieldData);
    const { propNameOrIndex, requestFieldPath } = keysAndPaths;

    const {
      dataEntityData: ancestorDataEntityData,
      requestFieldPathData: ancestorRequestFieldPathData,
    } = cachedAncestorFieldData;

    const cachedFieldData: defs.CachedFieldData = {
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
    { fieldPathChecklist }: defs.CachedRequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<void> {
    const queryNode = getOperationDefinitions(ast as DocumentNode, context.operation)[0];
    const fields = getChildFields(queryNode) as FieldNode[];

    for (let i = fields.length - 1; i >= 0; i -= 1) {
      const field = fields[i];
      const { requestFieldPath } = CacheManager._getFieldKeysAndPaths(field, {});
      if (CacheManager._filterField(field, fieldPathChecklist, requestFieldPath)) deleteChildFields(queryNode, field);
    }

    context.filtered = true;
  }

  private static _getFieldDataFromAncestor(ancestorFieldData: any, propNameOrIndex: string | number): any {
    return isObjectLike(ancestorFieldData) ? ancestorFieldData[propNameOrIndex] : undefined;
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
      name,
      propNameOrIndex,
      requestFieldCacheKey: updatedRequestFieldCacheKey,
      requestFieldPath: updatedRequestFieldPath,
      responseDataPath: updatedResponseDataPath,
    };
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

  private static _rehydrateCacheMetadata(dehydratedCacheMetadata: defs.DehydratedCacheMetadata): defs.CacheMetadata {
    const cacheMetadata: defs.CacheMetadata = new Map();

    return Object.keys(dehydratedCacheMetadata).reduce((map: defs.CacheMetadata, key: string) => {
      const cacheability = new Cacheability({ metadata: dehydratedCacheMetadata[key] });
      map.set(key, cacheability);
      return map;
    }, cacheMetadata);
  }

  private static _setCachedRequestData(
    cachedFieldData: defs.CachedFieldData,
    { cacheMetadata, data, fieldCount, fieldPathChecklist }: defs.CachedRequestData,
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

  private _cache: Cachemap;
  private _partialQueryResponses: Map<string, defs.PartialQueryResponse>;
  private _typeCacheDirectives: coreDefs.PlainObjectStringMap | undefined;
  private _typeIDKey: string;

  constructor(options: defs.ConstructorOptions) {
    this._cache = options.cache;
    this._typeCacheDirectives = options.typeCacheDirectives;
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
    if (!requestData.ast) {
      return Promise.reject(new TypeError("@handl/cache-manager expected an AST."));
    }

    const cachedRequestData = await this._getCachedRequestData(requestData, options, context);

    const { cacheMetadata, data, fieldCount } = cachedRequestData;
    if (fieldCount.missing === fieldCount.total) return { updated: requestData };

    if (!fieldCount.missing) return { response: { cacheMetadata, data } };

    this._setPartialQueryResponse(requestData.hash, { cacheMetadata, data }, options, context);
    await CacheManager._filterQuery(requestData, cachedRequestData, options, context);

    const ast = requestData.ast as DocumentNode;
    const request = print(ast);
    return { updated: { ast, hash: hashRequest(request), request } };
  }

  public async check(
    cacheType: coreDefs.CacheTypes,
    hash: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<defs.CheckResult | false> {
    try {
      return this._check(cacheType, hash, options, context);
    } catch (error) {
      return false;
    }
  }

  private async _analyzeField(
    field: FieldNode,
    cachedAncestorFieldData: defs.CachedFieldData,
    cachedRequestData: defs.CachedRequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<void> {
    if (hasChildFields(field)) {
      await this._analyzeParentField(field, cachedAncestorFieldData, cachedRequestData, options, context);
    } else {
      await CacheManager._analyzeLeafField(field, cachedAncestorFieldData, cachedRequestData, options, context);
    }
  }

  private async _analyzeParentField(
    field: FieldNode,
    cachedAncestorFieldData: defs.CachedFieldData,
    cachedRequestData: defs.CachedRequestData,
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

    CacheManager._setCachedRequestData(cachedFieldData, cachedRequestData, keysAndPaths, options, context);
    const data = CacheManager._getValidFieldData(cachedFieldData);
    if (!isObjectLike(data)) return;

    const objectLikeData = data as coreDefs.PlainObjectMap | any[];
    const promises: Array<Promise<void>> = [];

    iterateChildFields(field, objectLikeData, (childField: FieldNode, childIndex?: number) => {
      promises.push(this._analyzeField(
        childField,
        { index: childIndex, requestFieldCacheKey, requestFieldPath, ...cachedFieldData },
        { ...cachedRequestData, data: cachedRequestData.data[propNameOrIndex] },
        options,
        context,
      ));
    });

    await Promise.all(promises);
  }

  private _buildDataEntityCacheKey(
    { requestFieldPathData }: defs.CachedFieldData,
    { typeIDValue, typeName }: coreDefs.FieldTypeInfo,
  ): string {
    if (typeIDValue) return `${typeName}::${typeIDValue}`;

    let requestFieldPathDataIDValue: string | number | undefined;

    if (requestFieldPathData && isPlainObject(requestFieldPathData)) {
      requestFieldPathDataIDValue = requestFieldPathData[this._typeIDKey];
    }

    return requestFieldPathDataIDValue ? `${typeName}::${requestFieldPathDataIDValue}` : "";
  }

  private async _check(
    cacheType: coreDefs.CacheTypes,
    hash: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<defs.CheckResult | false> {
    try {
      const cacheability = await this._has(cacheType, hash);

      if (!cacheability || !CacheManager._isValid(cacheability)) return false;

      const data = await this._get(cacheType, hash, options, context);

      if (!data) return false;

      return { cacheability, data };
    } catch (error) {
      return false;
    }
  }

  @logQuery(CacheManager._debugManager)
  private async _get(
    cacheType: coreDefs.CacheTypes,
    hash: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.ResponseData> {
    try {
      return this._cache.get(`${cacheType}::${hash}`);
    } catch (errors) {
      return { errors };
    }
  }

  private async _has(
    cacheType: coreDefs.CacheTypes,
    hash: string,
  ): Promise<Cacheability | false> {
    try {
      return this._cache.has(`${cacheType}::${hash}`);
    } catch (error) {
      return false;
    }
  }

  private async _getCachedRequestData(
    { ast }: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<defs.CachedRequestData> {
    const cachedRequestData: defs.CachedRequestData = {
      cacheMetadata: new Map(),
      data: {},
      fieldCount: { missing: 0, total: 0 },
      fieldPathChecklist: new Map(),
    };

    const queryNode = getOperationDefinitions(ast as DocumentNode, context.operation)[0];
    const fields = getChildFields(queryNode) as FieldNode[];
    await Promise.all(fields.map((field) => this._analyzeField(field, {}, cachedRequestData, options, context)));

    return cachedRequestData;
  }

  private async _setDataEntityData(
    cachedFieldData: defs.CachedFieldData,
    fieldTypeInfo: coreDefs.FieldTypeInfo,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<void> {
    const checkResult = await this._check(
      DATA_ENTITIES,
      this._buildDataEntityCacheKey(cachedFieldData, fieldTypeInfo),
      options,
      context,
    );

    if (checkResult) {
      const { cacheability, data } = checkResult;
      if (cacheability && !cachedFieldData.cacheability) cachedFieldData.cacheability = cacheability;
      if (data) cachedFieldData.requestFieldPathData = data;
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

  private async _setRequestFieldPathData(
    cachedFieldData: defs.CachedFieldData,
    hash: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<void> {
    const checkResult = await this._check(REQUEST_FIELD_PATHS, hash, options, context);

    if (checkResult) {
      const { cacheability, data } = checkResult;
      if (cacheability) cachedFieldData.cacheability = cacheability;
      if (data) cachedFieldData.requestFieldPathData = data;
    }
  }
}

export default function init(userOptions: defs.UserOptions): defs.CacheManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@handl/cache-manager expected userOptions to be a plain object.");
  }

  return (clientOptions: defs.ClientOptions) => CacheManager.init({ ...clientOptions, ...userOptions });
}
