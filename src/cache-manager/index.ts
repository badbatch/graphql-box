import { Cacheability } from "cacheability";

import {
  DocumentNode,
  FieldNode,
  print,
} from "graphql";

import {
  cloneDeep,
  get,
  has,
  isArray,
  isNumber,
  isObjectLike,
  isPlainObject,
  isString,
  isUndefined,
  set,
  unset,
} from "lodash";

import {
  CacheArgs,
  CacheEntryData,
  CacheEntryResult,
  CachesCheckMetadata,
  CacheUpdateDataTypes,
  CheckList,
  GetKeysResult,
  IterateChildFieldsCallback,
  KeyPaths,
  PartialData,
  UpdateDataCachesOptions,
} from "./types";

import hashRequest from "../helpers/hash-request";
import dehydrateCacheMetadata from "../helpers/dehydrate-cache-metadata";
import mergeObjects from "../helpers/merge-objects";

import {
  deleteChildFields,
  getAlias,
  getArguments,
  getChildFields,
  getName,
  getOperationDefinitions,
  hasChildFields,
} from "../helpers/parsing";

import { getDirectives } from "../helpers/parsing/directives";
import { logPartial } from "../monitoring";
import { CachemapProxy } from "../proxies/cachemap";

import {
  AnalyzeResult,
  CachemapArgsGroup,
  CacheMetadata,
  CacheTypes,
  ClientRequests,
  DataCachedResolver,
  ExportCacheResult,
  ExportCachesResult,
  FieldTypeInfo,
  ObjectMap,
  RequestContext,
  ResolveResult,
  StringObjectMap,
} from "../types";

export default class CacheManager {
  public static async create(args: CacheArgs): Promise<CacheManager> {
    try {
      const cache = new CacheManager(args);
      await cache._createCachemaps();
      return cache;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static getOperationCacheControl(cacheMetadata: CacheMetadata, operation: string): string {
    const cacheability = cacheMetadata.get(operation);
    return cacheability ? cacheability.printCacheControl() : "no-cache";
  }

  public static isValid(cacheability?: Cacheability | false): boolean {
    const noCache = get(cacheability, ["metadata", "cacheControl", "noCache"], false);
    return !!cacheability && !noCache && cacheability.checkTTL();
  }

  private static _buildCacheKey(
    name: string,
    cachePath: string,
    args?: ObjectMap,
    directives?: ObjectMap,
    index?: number,
  ): string {
    let key = `${isNumber(index) ? index : name}`;
    if (args) key = `${key}(${JSON.stringify(args)})`;
    if (directives) key = `${key}(${JSON.stringify(directives)})`;
    return CacheManager._buildKey(key, cachePath);
  }

  private static _buildKey(key: string | number, path: string): string {
    const paths: Array<string | number> = [];
    if (path.length) paths.push(path);
    paths.push(key);
    return paths.join(".");
  }

  private static _filterField(field: FieldNode, checkList: CheckList, queryPath: string): boolean {
    const childFields = getChildFields(field) as FieldNode[] | undefined;
    if (!childFields) return false;

    for (let i = childFields.length - 1; i >= 0; i -= 1) {
      const childField = childFields[i];
      if (getName(childField) === "_metadata") continue;
      const { queryKey } = this._getKeys(childField, { queryPath });
      const check = checkList.get(queryKey);

      if (check && !hasChildFields(childField)) {
        deleteChildFields(field, childField);
      } else if (check && CacheManager._filterField(childField, checkList, queryKey)) {
        deleteChildFields(field, childField);
      }
    }

    return !hasChildFields(field);
  }

  private static async _filterQuery(
    ast: DocumentNode,
    checkList: CheckList,
    context: RequestContext,
  ): Promise<void> {
    const queryNode = getOperationDefinitions(ast, context.operation)[0];
    const fields = getChildFields(queryNode) as FieldNode[];

    for (let i = fields.length - 1; i >= 0; i -= 1) {
      const field = fields[i];
      const { queryKey } = CacheManager._getKeys(field);
      if (CacheManager._filterField(field, checkList, queryKey)) deleteChildFields(queryNode, field);
    }
  }

  private static _getKeys(field: FieldNode, paths: KeyPaths = {}, index?: number): GetKeysResult {
    const { cachePath = "", dataPath = "", queryPath = "" } = paths;
    const name = getName(field) as string;
    const args = getArguments(field);
    const directives = getDirectives(field);
    const cacheKey = CacheManager._buildCacheKey(name, cachePath, args, directives, index);
    const hashKey = hashRequest(cacheKey);
    const nameKey = getAlias(field) || name;
    const queryKey = isNumber(index) ? queryPath : CacheManager._buildKey(nameKey, queryPath);
    const propKey = isNumber(index) ? index : nameKey;
    const dataKey = CacheManager._buildKey(propKey, dataPath);
    return { cacheKey, dataKey, hashKey, name, propKey, queryKey };
  }

  private static _iterateChildFields(
    field: FieldNode,
    data: ObjectMap | any[],
    callback: IterateChildFieldsCallback,
  ): void {
    if (!isArray(data)) {
      const childFields = getChildFields(field) as FieldNode[] | undefined;
      if (!childFields) return;

      childFields.forEach((child) => {
        callback(child);
      });
    } else {
      data.forEach((value, index) => {
        callback(field, index);
      });
    }
  }

  private static async _parseSingleField(
    field: FieldNode,
    metadata: CachesCheckMetadata,
    cacheEntryData: CacheEntryData = {},
    cachePath?: string,
    queryPath?: string,
    index?: number,
  ) {
    const { name, propKey, queryKey } = CacheManager._getKeys(field, { cachePath, queryPath }, index);
    let cacheDataValue: string | number | boolean | null | undefined;

    if (isPlainObject(cacheEntryData.primary) && !isUndefined(cacheEntryData.primary[name])) {
      cacheDataValue = cacheEntryData.primary[name];
    } else if (isPlainObject(cacheEntryData.secondary) && !isUndefined(cacheEntryData.secondary[name])) {
      cacheDataValue = cacheEntryData.secondary[name];
    }

    const { checkList, counter, queriedData } = metadata;
    CacheManager._setCheckList(checkList, { primary: cacheDataValue }, queryKey);
    CacheManager._setCounter(counter, { primary: cacheDataValue });
    CacheManager._setQueriedData(queriedData, { primary: cacheDataValue }, propKey);
  }

  private static _setCacheEntryMetadata(
    metadata: CachesCheckMetadata,
    cacheEntryData: CacheEntryData,
    { propKey, queryKey }: { propKey: string | number, queryKey: string },
    context: RequestContext,
  ): void {
    const { cacheMetadata, checkList, counter, queriedData } = metadata;
    CacheManager._setCacheMetadata(cacheMetadata, cacheEntryData.cacheability, queryKey, context);
    CacheManager._setCheckList(checkList, cacheEntryData, queryKey);
    CacheManager._setCounter(counter, cacheEntryData);
    CacheManager._setQueriedData(queriedData, cacheEntryData, propKey);
  }

  private static _setCacheMetadata(
    cacheMetadata: CacheMetadata,
    cacheability: Cacheability | false | undefined,
    queryKey: string,
    context: RequestContext,
  ): void {
    if (!CacheManager.isValid(cacheability)) return;
    const _cacheability = cacheability as Cacheability;
    cacheMetadata.set(queryKey, _cacheability);
    const operationCacheability = cacheMetadata.get(context.operation);

    if (!operationCacheability || (operationCacheability.metadata.ttl > _cacheability.metadata.ttl)) {
      cacheMetadata.set(context.operation, _cacheability);
    }
  }

  private static _setCheckList(checkList: CheckList, cacheEntryData: CacheEntryData, queryKey: string): void {
    if (checkList.has(queryKey)) return;
    const data = !isUndefined(cacheEntryData.primary) ? cacheEntryData.primary : cacheEntryData.secondary;
    checkList.set(queryKey, !isUndefined(data));
  }

  private static _setCounter(counter: { missing: number, total: number }, cacheEntryData: CacheEntryData): void {
    const data = !isUndefined(cacheEntryData.primary) ? cacheEntryData.primary : cacheEntryData.secondary;
    counter.total += 1;
    if (isUndefined(data)) counter.missing += 1;
  }

  private static _setQueriedData(
    queriedData: ObjectMap,
    cacheEntryData: CacheEntryData,
    propKey: string | number,
  ): void {
    const data = !isUndefined(cacheEntryData.primary) ? cacheEntryData.primary : cacheEntryData.secondary;

    if (!isObjectLike(data) && !isUndefined(data)) {
      queriedData[propKey] = data as string | number | boolean | null;
    } else if (isObjectLike(data)) {
      const objectLikeData = data as ObjectMap | any[];
      queriedData[propKey] = isArray(objectLikeData) ? [] : {};
    }
  }

  private _cachemapOptions: CachemapArgsGroup;
  private _dataEntities: CachemapProxy;
  private _queryPaths: CachemapProxy;
  private _partials: Map<string, PartialData>;
  private _requests: ClientRequests = { active: new Map(), pending: new Map() };
  private _resourceKey: string;
  private _responses: CachemapProxy;
  private _typeCacheControls: StringObjectMap;

  constructor({ cachemapOptions, resourceKey, typeCacheControls }: CacheArgs) {
    this._cachemapOptions = cachemapOptions;
    this._partials = new Map();
    this._resourceKey = resourceKey;
    this._typeCacheControls = typeCacheControls;
  }

  get dataEntities(): CachemapProxy {
    return this._dataEntities;
  }

  get queryPaths(): CachemapProxy {
    return this._queryPaths;
  }

  get requests(): ClientRequests {
    return this._requests;
  }

  get responses(): CachemapProxy {
    return this._responses;
  }

  public async analyze(
    queryHash: string,
    ast: DocumentNode,
    context: RequestContext,
  ): Promise<AnalyzeResult> {
    const checkDataCachesResult = await this._checkDataCaches(ast, context);
    const { cacheMetadata, checkList, counter, queriedData } = checkDataCachesResult;

    if (counter.missing === counter.total) {
      return { filtered: false, updatedAST: ast, updatedQuery: print(ast) };
    }

    if (!counter.missing) return { cachedData: queriedData, cacheMetadata };
    this._setPartial(queryHash, { cacheMetadata, cachedData: queriedData }, context);
    await CacheManager._filterQuery(ast, checkList, context);
    return { filtered: true, updatedAST: ast, updatedQuery: print(ast) };
  }

  public async export(tag: any): Promise<ExportCachesResult> {
    const caches: Array<[string, CachemapProxy]> = [
      ["dataEntities", this._dataEntities],
      ["queryPaths", this._queryPaths],
      ["responses", this._responses],
    ];

    try {
      const result: ExportCachesResult = {};

      await Promise.all(caches.map(([key, cache]) => {
        const promise = cache.export({ tag });
        const _key = key as CacheTypes;
        promise.then((res: ExportCacheResult) => result[_key] = res);
        return promise;
      }));

      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async import(args: ExportCachesResult): Promise<void> {
    const caches = {
      dataEntities: this._dataEntities,
      queryPaths: this._queryPaths,
      responses: this._responses,
    };

    try {
      await Promise.all(Object.keys(args).map((key: CacheTypes) => {
        const cache = caches[key];
        const exported = args[key];
        if (!exported) return undefined;
        return cache.import(exported);
      }));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async resolveMutation(
    ast: DocumentNode,
    data: ObjectMap,
    cacheMetadata: CacheMetadata,
    opts: { cacheResolve: DataCachedResolver, tag?: any },
    context: RequestContext,
  ): Promise<ResolveResult> {
    const updatedCacheMetadata = this._updateCacheMetadata(ast, data, context, cacheMetadata);

    (async () => {
      await this._updateDataCaches(
        ast,
        data,
        updatedCacheMetadata,
        { setPaths: false, tag: opts.tag },
        context,
      );

      opts.cacheResolve();
    })();

    return { cacheMetadata: updatedCacheMetadata, data };
  }

  public async resolveQuery(
    query: string,
    ast: DocumentNode,
    queryHash: string,
    data: ObjectMap,
    cacheMetadata: CacheMetadata,
    opts: { cacheResolve: DataCachedResolver, filtered: boolean, tag?: any },
    context: RequestContext,
  ): Promise<ResolveResult> {
    const partial = this._getPartial(queryHash);
    let updatedData = data;

    if (partial) {
      updatedData = mergeObjects(partial.cachedData, data, (key: string, val: any): string | number | undefined => {
        if (isPlainObject(val) && val[this._resourceKey]) {
          return val[this._resourceKey];
        }

        return undefined;
      });
    }

    const updatedCacheMetadata = this._updateCacheMetadata(
      ast,
      updatedData,
      context,
      cacheMetadata,
      partial && partial.cacheMetadata,
    );

    const updatedCacheControl = CacheManager.getOperationCacheControl(updatedCacheMetadata, context.operation);
    const filterCacheMetadata = opts.filtered && this._updateCacheMetadata(ast, data, context, cacheMetadata);

    const filterCacheControl = filterCacheMetadata &&
      CacheManager.getOperationCacheControl(filterCacheMetadata, context.operation);

    (async () => {
      const promises: Array<Promise<void>> = [];

      try {
        promises.push(this._responses.set(
          queryHash,
          { cacheMetadata: dehydrateCacheMetadata(updatedCacheMetadata), data: updatedData },
          { cacheHeaders: { cacheControl: updatedCacheControl }, tag: opts.tag },
          { ...context, cache: "responses" },
        ));

        if (filterCacheMetadata) {
          promises.push(this._responses.set(
            hashRequest(query),
            { cacheMetadata: dehydrateCacheMetadata(filterCacheMetadata), data },
            { cacheHeaders: { cacheControl: filterCacheControl }, tag: opts.tag },
            { ...context, cache: "responses" },
          ));
        }
      } catch (error) {
        // no catch
      }

      promises.push(this._updateDataCaches(
        ast,
        updatedData,
        updatedCacheMetadata,
        { tag: opts.tag },
        context,
      ));

      await Promise.all(promises);
      opts.cacheResolve();
    })();

    return { cacheMetadata: updatedCacheMetadata, data: updatedData };
  }

  public async resolveSubscription(
    ast: DocumentNode,
    data: ObjectMap,
    cacheMetadata: CacheMetadata,
    opts: { cacheResolve: DataCachedResolver, tag?: any },
    context: RequestContext,
  ): Promise<ResolveResult> {
    const updatedCacheMetadata = this._updateCacheMetadata(ast, data, context, cacheMetadata);

    (async () => {
      await this._updateDataCaches(
        ast,
        data,
        updatedCacheMetadata,
        { setPaths: false, tag: opts.tag },
        context,
      );

      opts.cacheResolve();
    })();

    return { cacheMetadata: updatedCacheMetadata, data };
  }

  public setTypeCacheControls(typeCacheControls: StringObjectMap): void {
    this._typeCacheControls = typeCacheControls;
  }

  public setOperationCacheability(cacheMetadata: CacheMetadata, operationName: string): void {
    const operationTypeName = operationName.charAt(0).toUpperCase() + operationName.slice(1);

    const typeCacheControl = this._typeCacheControls[operationTypeName] ||
      !cacheMetadata.has(operationName) && "no-cache";

    if (typeCacheControl) {
      const cacheability = new Cacheability();
      cacheability.parseCacheControl(typeCacheControl);
      cacheMetadata.set(operationName, cacheability);
    }
  }

  private async _checkDataCaches(
    ast: DocumentNode,
    context: RequestContext,
  ): Promise<CachesCheckMetadata> {
    const metadata: CachesCheckMetadata = {
      cacheMetadata: new Map(),
      checkList: new Map(),
      counter: { missing: 0, total: 0 },
      queriedData: {},
    };

    const queryNode = getOperationDefinitions(ast, context.operation)[0];
    const fields = getChildFields(queryNode) as FieldNode[];
    await Promise.all(fields.map((field) => this._parseField(field, metadata, context)));
    return metadata;
  }

  private async _checkDataEntityCacheEntry(
    fieldTypeInfo: FieldTypeInfo,
    context: RequestContext,
    cachedPathData?: ObjectMap,
    entityKey?: string,
  ): Promise<CacheEntryResult | undefined> {
    let key: string;

    if (!entityKey) {
      const { resourceValue, typeName } = fieldTypeInfo;
      let pathDataResourceValue: string | number | undefined;

      if (cachedPathData && isPlainObject(cachedPathData)) {
        pathDataResourceValue = cachedPathData[this._resourceKey];
      }

      if (!resourceValue && !pathDataResourceValue) return undefined;
      key = `${typeName}:${resourceValue || pathDataResourceValue}`;
    } else {
      key = entityKey;
    }

    let cacheability: Cacheability | false = false;
    let cachedData: any;

    try {
      cacheability = await this._dataEntities.has(key);

      if (CacheManager.isValid(cacheability)) {
        cachedData = await this._dataEntities.get(key, {}, { ...context, cache: "dataEntities" });
      }

      return { cacheability, cachedData };
    } catch (error) {
      return { cacheability, cachedData };
    }
  }

  private async _checkQueryPathCacheEntry(
    hashKey: string,
    context: RequestContext,
  ): Promise<CacheEntryResult> {
    let cacheability: Cacheability | false = false;
    let cachedData: any;

    try {
      cacheability = await this._queryPaths.has(hashKey);

      if (CacheManager.isValid(cacheability)) {
        cachedData = await this._queryPaths.get(hashKey, {}, { ...context, cache: "queryPaths" });
      }

      return { cacheability, cachedData };
    } catch (error) {
      return { cacheability, cachedData };
    }
  }

  private async _createCachemaps(): Promise<void> {
    try {
      this._dataEntities = await CachemapProxy.create(this._cachemapOptions.dataEntities);
      this._queryPaths = await CachemapProxy.create(this._cachemapOptions.queryPaths);
      this._responses = await CachemapProxy.create(this._cachemapOptions.responses);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _getPartial(queryHash: string): PartialData | undefined {
    if (!this._partials.has(queryHash)) return undefined;
    const partialData = this._partials.get(queryHash);
    this._partials.delete(queryHash);
    return partialData;
  }

  private async _parseData(
    field: FieldNode,
    dataTypes: CacheUpdateDataTypes,
    cacheMetadata: CacheMetadata,
    cacheControl: string,
    { keyPaths, index }: { keyPaths?: KeyPaths, index?: number } = {},
    opts: UpdateDataCachesOptions,
    context: RequestContext,
  ): Promise<void> {
    const {
      cacheKey,
      dataKey,
      hashKey,
      queryKey,
    } = CacheManager._getKeys(field, keyPaths, index);

    const entityfieldData = get(dataTypes.entities, dataKey, null);
    const pathfieldData = get(dataTypes.paths, dataKey, null);
    if (!isObjectLike(entityfieldData) && !isObjectLike(pathfieldData)) return;
    const metadata = cacheMetadata.get(queryKey);
    const _cacheControl = metadata && metadata.printCacheControl() || cacheControl;
    const promises: Array<Promise<void>> = [];
    const _keyPaths: KeyPaths = { cachePath: cacheKey, dataPath: dataKey, queryPath: queryKey };

    CacheManager._iterateChildFields(field, pathfieldData, (childField, childIndex) => {
      promises.push(this._parseData(
        childField,
        dataTypes,
        cacheMetadata,
        _cacheControl,
        { keyPaths: _keyPaths, index: childIndex },
        opts,
        context,
      ));
    });

    await Promise.all(promises);

    await this._setData(
      field,
      { entityfieldData, pathfieldData },
      dataTypes,
      _cacheControl,
      { dataKey, hashKey, queryKey },
      opts,
      context,
    );
  }

  private async _parseField(
    field: FieldNode,
    metadata: CachesCheckMetadata,
    context: RequestContext,
    cacheEntryData?: CacheEntryData,
    cachePath?: string,
    queryPath?: string,
    index?: number,
  ): Promise<void> {
    if (hasChildFields(field)) {
      await this._parseParentField(
        field,
        metadata,
        context,
        cacheEntryData,
        cachePath,
        queryPath,
        index,
      );
    } else {
      await CacheManager._parseSingleField(
        field,
        metadata,
        cacheEntryData,
        cachePath,
        queryPath,
        index,
      );
    }
  }

  private async _parseParentField(
    field: FieldNode,
    metadata: CachesCheckMetadata,
    context: RequestContext,
    { primary, secondary }: CacheEntryData = {},
    cachePath?: string,
    queryPath?: string,
    index?: number,
  ): Promise<void> {
    const {
      cacheKey,
      hashKey,
      propKey,
      queryKey,
    } = CacheManager._getKeys(field, { cachePath, queryPath }, index);

    const fieldTypeInfo = context.fieldTypeMap.get(queryKey);

    const cacheEntryData: CacheEntryData = {
      primary: isObjectLike(primary) ? primary[propKey] : undefined,
      secondary: isObjectLike(secondary) ? secondary[propKey] : undefined,
    };

    if (fieldTypeInfo && (fieldTypeInfo.isEntity || fieldTypeInfo.hasArguments || fieldTypeInfo.hasDirectives)) {
      const { cacheability, cachedData } = await this._checkQueryPathCacheEntry(hashKey, context);

      if (cacheability && cachedData) {
        cacheEntryData.primary = cachedData;
        cacheEntryData.cacheability = cacheability;
      }
    }

    if (fieldTypeInfo && fieldTypeInfo.isEntity) {
      const dataEntityResult = await this._checkDataEntityCacheEntry(
        fieldTypeInfo,
        context,
        cacheEntryData.primary,
        isPlainObject(cacheEntryData.secondary) && cacheEntryData.secondary._EntityKey,
      );

      if (dataEntityResult && dataEntityResult.cacheability && dataEntityResult.cachedData) {
        cacheEntryData.secondary = dataEntityResult.cachedData;
        if (!cacheEntryData.cacheability) cacheEntryData.cacheability = dataEntityResult.cacheability;
      }
    }

    CacheManager._setCacheEntryMetadata(
      metadata,
      cacheEntryData,
      { propKey, queryKey },
      context,
    );

    if (!isObjectLike(cacheEntryData.primary) && !isObjectLike(cacheEntryData.secondary)) return;
    const objectLikeData = cacheEntryData.primary || cacheEntryData.secondary as ObjectMap | any[];
    const { cacheMetadata, checkList, counter, queriedData } = metadata;
    const promises: Array<Promise<void>> = [];

    CacheManager._iterateChildFields(field, objectLikeData, (childField, childIndex) => {
      if (getName(childField) === "_metadata") return;

      promises.push(this._parseField(
        childField,
        { cacheMetadata, checkList, counter, queriedData: queriedData[propKey] },
        context,
        cacheEntryData,
        cacheKey,
        queryKey,
        childIndex,
      ));
    });

    await Promise.all(promises);
  }

  private _parseResponseMetadata(
    field: FieldNode,
    data: ObjectMap,
    context: RequestContext,
    cacheMetadata: CacheMetadata,
    dataPath?: string,
    queryPath?: string,
    index?: number,
  ): void {
    const { dataKey, queryKey } = CacheManager._getKeys(field, { dataPath, queryPath }, index);
    const fieldData = get(data, dataKey, null);
    if (!isObjectLike(fieldData)) return;
    const objectLikeFieldData = fieldData as ObjectMap | any[];

    const fieldTypeInfo = context.fieldTypeMap.get(queryKey);
    let cacheabilitySet = false;

    if (fieldTypeInfo && this._typeCacheControls[fieldTypeInfo.typeName]) {
      const cacheability = new Cacheability();
      cacheability.parseCacheControl(this._typeCacheControls[fieldTypeInfo.typeName]);
      CacheManager._setCacheMetadata(cacheMetadata, cacheability, queryKey, context);
      cacheabilitySet = true;
    }

    if (Object.prototype.hasOwnProperty.call(objectLikeFieldData, "_metadata")) {
      const objectFieldData = objectLikeFieldData as ObjectMap;

      if (
        !cacheabilitySet &&
        has(objectFieldData, ["_metadata", "cacheControl"]) &&
        isString(objectFieldData._metadata.cacheControl)
      ) {
        const cacheControl: string = objectFieldData._metadata.cacheControl;
        const cacheability = new Cacheability();
        cacheability.parseCacheControl(cacheControl);
        CacheManager._setCacheMetadata(cacheMetadata, cacheability, queryKey, context);
      }

      delete objectFieldData._metadata;
    }

    CacheManager._iterateChildFields(field, objectLikeFieldData, (childField, childIndex) => {
      this._parseResponseMetadata(childField, data, context, cacheMetadata, dataKey, queryKey, childIndex);
    });
  }

  private async _setData(
    field: FieldNode,
    { entityfieldData, pathfieldData }: { entityfieldData: ObjectMap | any[], pathfieldData: ObjectMap | any[] },
    dataTypes: CacheUpdateDataTypes,
    cacheControl: string,
    { dataKey, hashKey, queryKey }: { dataKey: string, hashKey: string, queryKey: string },
    { setEntities, setPaths, tag }: UpdateDataCachesOptions,
    context: RequestContext,
  ): Promise<void> {
    const fieldTypeInfo = context.fieldTypeMap.get(queryKey);
    if (!fieldTypeInfo) return;
    const hasArgsOrDirectives = fieldTypeInfo.hasArguments || fieldTypeInfo.hasDirectives;

    if (!fieldTypeInfo.isEntity && hasArgsOrDirectives) {
      unset(dataTypes.entities, dataKey);
    }

    try {
      const promises: Array<Promise<void>> = [];

      if (setEntities && fieldTypeInfo.isEntity && isPlainObject(entityfieldData)) {
        const objectMapEntityfieldData = entityfieldData as ObjectMap;
        const entityDataKey = `${fieldTypeInfo.typeName}:${objectMapEntityfieldData[this._resourceKey]}`;

        promises.push(this._dataEntities.set(
          entityDataKey,
          cloneDeep(objectMapEntityfieldData),
          { cacheHeaders: { cacheControl }, tag },
          { ...context, cache: "dataEntities" },
        ));

        set(dataTypes.entities, dataKey, { _EntityKey: entityDataKey });
      }

      if (setPaths && ((fieldTypeInfo.isEntity && isPlainObject(pathfieldData)) || hasArgsOrDirectives)) {
        promises.push(this._queryPaths.set(
          hashKey,
          cloneDeep(pathfieldData),
          { cacheHeaders: { cacheControl }, tag },
          { ...context, cache: "queryPaths" },
        ));

        if (hasChildFields(field)) {
          if (fieldTypeInfo.isEntity) {
            set(dataTypes.paths, dataKey, { _HashKey: hashKey });
          } else {
            unset(dataTypes.paths, dataKey);
          }
        }
      }

      await Promise.all(promises);
    } catch (error) {
      // no catch
    }
  }

  @logPartial
  private _setPartial(key: string, value: PartialData, context: RequestContext) {
    this._partials.set(key, value);
  }

  private _updateCacheMetadata(
    ast: DocumentNode,
    data: ObjectMap,
    context: RequestContext,
    cacheMetadata: CacheMetadata,
    partialCacheMetadata?: CacheMetadata,
  ): CacheMetadata {
    let _cacheMetadata: CacheMetadata = new Map([...cacheMetadata]);

    if (partialCacheMetadata) {
      const operationCacheability = cacheMetadata.get(context.operation);
      const partialCacheability = partialCacheMetadata.get(context.operation);

      if (
        operationCacheability &&
        partialCacheability &&
        operationCacheability.metadata.ttl < partialCacheability.metadata.ttl
      ) {
        _cacheMetadata = new Map([...partialCacheMetadata, ...cacheMetadata]);
      } else {
        _cacheMetadata = new Map([...cacheMetadata, ...partialCacheMetadata]);
      }
    }

    const operationNode = getOperationDefinitions(ast, context.operation)[0];
    const fields = getChildFields(operationNode) as FieldNode[];

    fields.forEach((field) => {
      this._parseResponseMetadata(field, data, context, _cacheMetadata);
    });

    this.setOperationCacheability(_cacheMetadata, context.operation);
    return _cacheMetadata;
  }

  private async _updateDataCaches(
    ast: DocumentNode,
    data: ObjectMap,
    cacheMetadata: CacheMetadata,
    { setEntities = true, setPaths = true, tag }: UpdateDataCachesOptions = {},
    context: RequestContext,
  ): Promise<void> {
    const queryNode = getOperationDefinitions(ast, context.operation)[0];
    const fields = getChildFields(queryNode) as FieldNode[];
    const cacheControl = CacheManager.getOperationCacheControl(cacheMetadata, context.operation);

    await Promise.all(
      fields.map((field) => {
        return this._parseData(
          field,
          { entities: cloneDeep(data), paths: cloneDeep(data) },
          cacheMetadata,
          cacheControl,
          undefined,
          { setEntities, setPaths, tag },
          context,
        );
      }),
    );
  }
}
