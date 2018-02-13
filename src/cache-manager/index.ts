import { Cacheability } from "cacheability";
import { DefaultCachemap } from "cachemap";

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

import {
  AnalyzeResult,
  CachemapArgsGroup,
  CacheMetadata,
  ClientRequests,
  DataCachedResolver,
  DefaultCacheControls,
  ExportCacheResult,
  ExportCachesResult,
  FieldTypeInfo,
  FieldTypeMap,
  ObjectMap,
  ResolveResult,
} from "../types";

import mapToObject from "../helpers/map-to-object";
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

  public static isValid(cacheability: Cacheability): boolean {
    const noCache = get(cacheability, ["metadata", "cacheControl", "noCache"], false);
    return cacheability && !noCache && cacheability.checkTTL();
  }

  private static _buildCacheKey(name: string, cachePath: string, args?: ObjectMap, index?: number): string {
    let key = `${isNumber(index) ? index : name}`;
    if (args) key = `${key}(${JSON.stringify(args)})`;
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

  private static async _filterQuery(ast: DocumentNode, checkList: CheckList): Promise<void> {
    const queryNode = getOperationDefinitions(ast, "query")[0];
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
    const cacheKey = CacheManager._buildCacheKey(name, cachePath, args, index);
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

  private static _parseResponseMetadata(
    field: FieldNode,
    data: ObjectMap,
    cacheMetadata: CacheMetadata,
    dataPath?: string,
    queryPath?: string,
    index?: number,
  ): void {
    const { dataKey, queryKey } = CacheManager._getKeys(field, { dataPath, queryPath }, index);
    const fieldData = get(data, dataKey, null);
    if (!isObjectLike(fieldData)) return;
    const objectLikeFieldData = fieldData as ObjectMap | any[];

    if (Object.prototype.hasOwnProperty.call(objectLikeFieldData, "_metadata")) {
      const objectFieldData = objectLikeFieldData as ObjectMap;

      if (has(objectFieldData, ["_metadata", "cacheControl"]) && isString(objectFieldData._metadata.cacheControl)) {
        const cacheControl: string = objectFieldData._metadata.cacheControl;
        const cacheability = new Cacheability();
        cacheability.parseCacheControl(cacheControl);
        CacheManager._setCacheMetadata(cacheMetadata, cacheability, queryKey);
      }

      delete objectFieldData._metadata;
    }

    CacheManager._iterateChildFields(field, objectLikeFieldData, (childField, childIndex) => {
      CacheManager._parseResponseMetadata(childField, data, cacheMetadata, dataKey, queryKey, childIndex);
    });
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
  ): void {
    const { cacheMetadata, checkList, counter, queriedData } = metadata;
    CacheManager._setCacheMetadata(cacheMetadata, cacheEntryData.cacheability, queryKey);
    CacheManager._setCheckList(checkList, cacheEntryData, queryKey);
    CacheManager._setCounter(counter, cacheEntryData);
    CacheManager._setQueriedData(queriedData, cacheEntryData, propKey);
  }

  private static _setCacheMetadata(
    cacheMetadata: CacheMetadata,
    cacheability: Cacheability | false | undefined,
    queryKey: string,
  ): void {
    if (cacheMetadata.has(queryKey) || !cacheability || !CacheManager.isValid(cacheability)) return;
    cacheMetadata.set(queryKey, cacheability);
    const queryCacheability = cacheMetadata.get("query");

    if (!queryCacheability) {
      cacheMetadata.set("query", cacheability);
      return;
    }

    if (queryCacheability.metadata.ttl > cacheability.metadata.ttl) {
      cacheMetadata.set("query", cacheability);
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
  private _dataEntities: DefaultCachemap;
  private _dataPaths: DefaultCachemap;
  private _defaultCacheControls: DefaultCacheControls;
  private _partials: Map<string, PartialData>;
  private _requests: ClientRequests = { active: new Map(), pending: new Map() };
  private _resourceKey: string;
  private _responses: DefaultCachemap;

  constructor({ cachemapOptions, defaultCacheControls, resourceKey }: CacheArgs) {
    this._cachemapOptions = cachemapOptions;
    this._defaultCacheControls = defaultCacheControls;
    this._partials = new Map();
    this._resourceKey = resourceKey;
  }

  get dataEntities(): DefaultCachemap {
    return this._dataEntities;
  }

  get dataPaths(): DefaultCachemap {
    return this._dataPaths;
  }

  get requests(): ClientRequests {
    return this._requests;
  }

  get responses(): DefaultCachemap {
    return this._responses;
  }

  public async analyze(
    queryHash: string,
    ast: DocumentNode,
    fieldTypeMap: FieldTypeMap,
  ): Promise<AnalyzeResult> {
    const checkDataCachesResult = await this._checkDataCaches(ast, fieldTypeMap);
    const { cacheMetadata, checkList, counter, queriedData } = checkDataCachesResult;

    if (counter.missing === counter.total) {
      return { filtered: false, updatedAST: ast, updatedQuery: print(ast) };
    }

    if (!counter.missing) return { cachedData: queriedData, cacheMetadata };
    this._partials.set(queryHash, { cacheMetadata, cachedData: queriedData });
    await CacheManager._filterQuery(ast, checkList);
    return { filtered: true, updatedAST: ast, updatedQuery: print(ast) };
  }

  public async export(tag: any): Promise<ExportCachesResult> {
    const caches: Array<[string, DefaultCachemap]> = [
      ["dataEntities", this._dataEntities],
      ["dataPaths", this._dataPaths],
      ["responses", this._responses],
    ];

    try {
      const result: ExportCachesResult = {};

      await Promise.all(caches.map(([key, cache]) => {
        const promise = cache.export({ tag });
        const _key = key as "dataEntities" | "dataPaths" | "responses";
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
      dataPaths: this._dataPaths,
      responses: this._responses,
    };

    try {
      await Promise.all(Object.keys(args).map((key: "dataEntities" | "dataPaths" | "responses") => {
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
    fieldTypeMap: FieldTypeMap,
    data: ObjectMap,
    cacheMetadata: CacheMetadata,
    opts: { cacheResolve: DataCachedResolver, tag?: any },
  ): Promise<ResolveResult> {
    const updatedCacheMetadata = this._updateCacheMetadata(ast, data, cacheMetadata, "mutation");

    (async () => {
      await this._updateDataCaches(
        ast,
        data,
        updatedCacheMetadata,
        fieldTypeMap,
        "mutation",
        { setPaths: false, tag: opts.tag },
      );

      opts.cacheResolve();
    })();

    return { cacheMetadata: updatedCacheMetadata, data };
  }

  public async resolveQuery(
    query: string,
    ast: DocumentNode,
    queryHash: string,
    fieldTypeMap: FieldTypeMap,
    data: ObjectMap,
    cacheMetadata: CacheMetadata,
    opts: { cacheResolve: DataCachedResolver, filtered: boolean, tag?: any },
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

    const defaultCacheControl = this._defaultCacheControls.query;

    const updatedCacheMetadata = this._updateCacheMetadata(
      ast,
      updatedData,
      cacheMetadata,
      "query",
      partial && partial.cacheMetadata,
    );

    const updatedCacheability = updatedCacheMetadata.get("query");

    const updatedCacheControl = updatedCacheability
      && updatedCacheability.printCacheControl()
      || defaultCacheControl;

    const filterCacheMetadata = opts.filtered && this._updateCacheMetadata(ast, data, cacheMetadata, "query");
    const filterCacheability = filterCacheMetadata && filterCacheMetadata.get("query");

    const filterCacheControl = filterCacheability
      && filterCacheability.printCacheControl()
      || defaultCacheControl;

    (async () => {
      const promises: Array<Promise<void>> = [];

      try {
        promises.push(this._responses.set(
          queryHash,
          { cacheMetadata: mapToObject(updatedCacheMetadata), data: updatedData },
          { cacheHeaders: { cacheControl: updatedCacheControl }, tag: opts.tag },
        ));

        if (filterCacheMetadata) {
          promises.push(this._responses.set(
            hashRequest(query),
            { cacheMetadata: mapToObject(filterCacheMetadata), data },
            { cacheHeaders: { cacheControl: filterCacheControl }, tag: opts.tag },
          ));
        }
      } catch (error) {
        // no catch
      }

      promises.push(this._updateDataCaches(
        ast,
        updatedData,
        updatedCacheMetadata,
        fieldTypeMap,
        "query",
        { tag: opts.tag },
      ));

      await Promise.all(promises);
      opts.cacheResolve();
    })();

    return { cacheMetadata: updatedCacheMetadata, data: updatedData };
  }

  public async resolveSubscription(
    ast: DocumentNode,
    fieldTypeMap: FieldTypeMap,
    data: ObjectMap,
    cacheMetadata: CacheMetadata,
    opts: { cacheResolve: DataCachedResolver, tag?: any },
  ): Promise<ResolveResult> {
    const updatedCacheMetadata = this._updateCacheMetadata(ast, data, cacheMetadata, "subscription");

    (async () => {
      await this._updateDataCaches(
        ast,
        data,
        updatedCacheMetadata,
        fieldTypeMap,
        "subscription",
        { setPaths: false, tag: opts.tag },
      );

      opts.cacheResolve();
    })();

    return { cacheMetadata: updatedCacheMetadata, data };
  }

  private async _checkDataCaches(
    ast: DocumentNode,
    fieldTypeMap: FieldTypeMap,
  ): Promise<CachesCheckMetadata> {
    const metadata: CachesCheckMetadata = {
      cacheMetadata: new Map(),
      checkList: new Map(),
      counter: { missing: 0, total: 0 },
      queriedData: {},
    };

    const queryNode = getOperationDefinitions(ast, "query")[0];
    const fields = getChildFields(queryNode) as FieldNode[];
    await Promise.all(fields.map((field) => this._parseField(field, metadata, fieldTypeMap)));
    return metadata;
  }

  private async _checkDataEntityCacheEntry(
    fieldTypeInfo: FieldTypeInfo,
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
      if (cacheability && CacheManager.isValid(cacheability)) cachedData = await this._dataEntities.get(key);
      return { cacheability, cachedData };
    } catch (error) {
      return { cacheability, cachedData };
    }
  }

  private async _checkDataPathCacheEntry(hashKey: string): Promise<CacheEntryResult> {
    let cacheability: Cacheability | false = false;
    let cachedData: any;

    try {
      cacheability = await this._dataPaths.has(hashKey);
      if (cacheability && CacheManager.isValid(cacheability)) cachedData = await this._dataPaths.get(hashKey);
      return { cacheability, cachedData };
    } catch (error) {
      return { cacheability, cachedData };
    }
  }

  private async _createCachemaps(): Promise<void> {
    try {
      this._dataEntities = await DefaultCachemap.create(this._cachemapOptions.dataEntities);
      this._dataPaths = await DefaultCachemap.create(this._cachemapOptions.dataPaths);
      this._responses = await DefaultCachemap.create(this._cachemapOptions.responses);
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
    fieldTypeMap: FieldTypeMap,
    dataTypes: CacheUpdateDataTypes,
    cacheMetadata: CacheMetadata,
    cacheControl: string,
    { keyPaths, index }: { keyPaths?: KeyPaths, index?: number } = {},
    opts: UpdateDataCachesOptions,
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
        fieldTypeMap,
        dataTypes,
        cacheMetadata,
        _cacheControl,
        { keyPaths: _keyPaths, index: childIndex },
        opts,
      ));
    });

    await Promise.all(promises);

    await this._setData(
      field,
      fieldTypeMap,
      { entityfieldData, pathfieldData },
      dataTypes,
      _cacheControl,
      { dataKey, hashKey, queryKey },
      opts,
    );
  }

  private async _parseField(
    field: FieldNode,
    metadata: CachesCheckMetadata,
    fieldTypeMap: FieldTypeMap,
    cacheEntryData?: CacheEntryData,
    cachePath?: string,
    queryPath?: string,
    index?: number,
  ): Promise<void> {
    if (hasChildFields(field)) {
      await this._parseParentField(
        field,
        metadata,
        fieldTypeMap,
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
    fieldTypeMap: FieldTypeMap,
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

    const fieldTypeInfo = fieldTypeMap.get(queryKey);

    const cacheEntryData: CacheEntryData = {
      primary: isObjectLike(primary) ? primary[propKey] : undefined,
      secondary: isObjectLike(secondary) ? secondary[propKey] : undefined,
    };

    if (fieldTypeInfo && (fieldTypeInfo.isEntity || fieldTypeInfo.hasArguments)) {
      const { cacheability, cachedData } = await this._checkDataPathCacheEntry(hashKey);

      if (cacheability && cachedData) {
        cacheEntryData.primary = cachedData;
        cacheEntryData.cacheability = cacheability;
      }
    }

    if (fieldTypeInfo && fieldTypeInfo.isEntity) {
      const dataEntityResult = await this._checkDataEntityCacheEntry(
        fieldTypeInfo,
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
        fieldTypeMap,
        cacheEntryData,
        cacheKey,
        queryKey,
        childIndex,
      ));
    });

    await Promise.all(promises);
  }

  private async _setData(
    field: FieldNode,
    fieldTypeMap: FieldTypeMap,
    { entityfieldData, pathfieldData }: { entityfieldData: ObjectMap | any[], pathfieldData: ObjectMap | any[] },
    dataTypes: CacheUpdateDataTypes,
    cacheControl: string,
    { dataKey, hashKey, queryKey }: { dataKey: string, hashKey: string, queryKey: string },
    { setEntities, setPaths, tag }: UpdateDataCachesOptions,
  ): Promise<void> {
    const fieldTypeInfo = fieldTypeMap.get(queryKey);
    if (!fieldTypeInfo) return;

    if (!fieldTypeInfo.isEntity && fieldTypeInfo.hasArguments) {
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
        ));

        set(dataTypes.entities, dataKey, { _EntityKey: entityDataKey });
      }

      if (setPaths && ((fieldTypeInfo.isEntity && isPlainObject(pathfieldData)) || fieldTypeInfo.hasArguments)) {
        promises.push(this._dataPaths.set(
          hashKey,
          cloneDeep(pathfieldData),
          { cacheHeaders: { cacheControl }, tag },
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

  private _updateCacheMetadata(
    ast: DocumentNode,
    data: ObjectMap,
    cacheMetadata: CacheMetadata,
    operationName: string,
    partialCacheMetadata?: CacheMetadata,
  ): CacheMetadata {
    let _cacheMetadata: CacheMetadata = new Map([...cacheMetadata]);

    if (partialCacheMetadata) {
      const queryCacheability = cacheMetadata.get("query");
      const partialCacheability = partialCacheMetadata.get("query");

      if (queryCacheability && partialCacheability
        && queryCacheability.metadata.ttl < partialCacheability.metadata.ttl) {
        _cacheMetadata = new Map([...partialCacheMetadata, ...cacheMetadata]);
      } else {
        _cacheMetadata = new Map([...cacheMetadata, ...partialCacheMetadata]);
      }
    }

    const operationNode = getOperationDefinitions(ast, operationName)[0];
    const fields = getChildFields(operationNode) as FieldNode[];

    fields.forEach((field) => {
      CacheManager._parseResponseMetadata(field, data, _cacheMetadata);
    });

    if (!_cacheMetadata.has("query")) {
      const cacheability = new Cacheability();
      cacheability.parseCacheControl(this._defaultCacheControls[operationName]);
      _cacheMetadata.set("query", cacheability);
    }

    return _cacheMetadata;
  }

  private async _updateDataCaches(
    ast: DocumentNode,
    data: ObjectMap,
    cacheMetadata: CacheMetadata,
    fieldTypeMap: FieldTypeMap,
    operationName: string,
    { setEntities = true, setPaths = true, tag }: UpdateDataCachesOptions = {},
  ): Promise<void> {
    const queryNode = getOperationDefinitions(ast, operationName)[0];
    const fields = getChildFields(queryNode) as FieldNode[];
    const queryCacheability = cacheMetadata.get("query");

    await Promise.all(
      fields.map((field) => {
        const cacheControl = queryCacheability
          && queryCacheability.printCacheControl()
          || this._defaultCacheControls.query;

        return this._parseData(
          field,
          fieldTypeMap,
          { entities: cloneDeep(data), paths: cloneDeep(data) },
          cacheMetadata,
          cacheControl,
          undefined,
          { setEntities, setPaths, tag },
        );
      }),
    );
  }
}
