import Cacheability from "cacheability";
import createCachemap, { Cachemap } from "cachemap";

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

import * as md5 from "md5";

import {
  AnalyzeResult,
  CacheArgs,
  CacheEntryData,
  CacheEntryResult,
  CachesCheckMetadata,
  CheckList,
  GetKeysResult,
  IterateChildFieldsCallback,
  KeyPaths,
  PartialData,
} from "./types";

import {
  CachemapArgsGroup,
  CacheMetadata,
  DataCachedResolver,
  DefaultCacheControls,
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

export default class Cache {
  public static async create(args: CacheArgs): Promise<Cache> {
    const cache = new Cache(args);
    await cache._createCachemaps();
    return cache;
  }

  public static hash(value: string): string {
    return md5(value.replace(/\s/g, ""));
  }

  public static isValid(cacheability: Cacheability): boolean {
    const noCache = get(cacheability, ["metadata", "cacheControl", "noCache"], false);
    return cacheability && !noCache && cacheability.checkTTL();
  }

  private static _buildCacheKey(name: string, cachePath: string, args?: ObjectMap, index?: number): string {
    let key = `${isNumber(index) ? index : name}`;
    if (args) key = `${key}(${JSON.stringify(args)})`;
    return Cache._buildKey(key, cachePath);
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
      } else if (check && Cache._filterField(childField, checkList, queryKey)) {
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
      const { queryKey } = Cache._getKeys(field);
      if (Cache._filterField(field, checkList, queryKey)) deleteChildFields(queryNode, field);
    }
  }

  private static _getKeys(field: FieldNode, paths: KeyPaths = {}, index?: number): GetKeysResult {
    const { cachePath = "", dataPath = "", queryPath = "" } = paths;
    const name = getName(field) as string;
    const args = getArguments(field);
    const cacheKey = Cache._buildCacheKey(name, cachePath, args, index);
    const hashKey = Cache.hash(cacheKey);
    const nameKey = getAlias(field) || name;
    const queryKey = isNumber(index) ? queryPath : Cache._buildKey(nameKey, queryPath);
    const propKey = isNumber(index) ? index : nameKey;
    const dataKey = Cache._buildKey(propKey, dataPath);
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
    const { dataKey, queryKey } = Cache._getKeys(field, { dataPath, queryPath }, index);
    const fieldData = get(data, dataKey, null);
    if (!isObjectLike(fieldData)) return;
    const objectLikeFieldData = fieldData as ObjectMap | any[];

    if (Object.prototype.hasOwnProperty.call(objectLikeFieldData, "_metadata")) {
      const objectFieldData = objectLikeFieldData as ObjectMap;

      if (has(objectFieldData, ["_metadata", "cacheControl"]) && isString(objectFieldData._metadata.cacheControl)) {
        const cacheControl: string = objectFieldData._metadata.cacheControl;
        const cacheability = new Cacheability();
        cacheability.parseCacheControl(cacheControl);
        Cache._setCacheMetadata(cacheMetadata, cacheability, queryKey);
      }

      delete objectFieldData._metadata;
    }

    Cache._iterateChildFields(field, objectLikeFieldData, (childField, childIndex) => {
      Cache._parseResponseMetadata(childField, data, cacheMetadata, dataKey, queryKey, childIndex);
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
    const { name, propKey, queryKey } = Cache._getKeys(field, { cachePath, queryPath }, index);
    let cacheDataValue: string | number | boolean | null | undefined;

    if (isPlainObject(cacheEntryData.primary) && !isUndefined(cacheEntryData.primary[name])) {
      cacheDataValue = cacheEntryData.primary[name];
    } else if (isPlainObject(cacheEntryData.secondary) && !isUndefined(cacheEntryData.secondary[name])) {
      cacheDataValue = cacheEntryData.secondary[name];
    }

    const { checkList, counter, queriedData } = metadata;
    Cache._setCheckList(checkList, { primary: cacheDataValue }, queryKey);
    Cache._setCounter(counter, { primary: cacheDataValue });
    Cache._setQueriedData(queriedData, { primary: cacheDataValue }, propKey);
  }

  private static _setCacheEntryMetadata(
    metadata: CachesCheckMetadata,
    cacheEntryData: CacheEntryData,
    { propKey, queryKey }: { propKey: string | number, queryKey: string },
  ): void {
    const { cacheMetadata, checkList, counter, queriedData } = metadata;
    Cache._setCacheMetadata(cacheMetadata, cacheEntryData.cacheability, queryKey);
    Cache._setCheckList(checkList, cacheEntryData, queryKey);
    Cache._setCounter(counter, cacheEntryData);
    Cache._setQueriedData(queriedData, cacheEntryData, propKey);
  }

  private static _setCacheMetadata(
    cacheMetadata: CacheMetadata,
    cacheability: Cacheability | false | undefined,
    queryKey: string,
  ): void {
    if (cacheMetadata.has(queryKey) || !cacheability || !Cache.isValid(cacheability)) return;
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
  private _dataEntities: Cachemap;
  private _dataPaths: Cachemap;
  private _defaultCacheControls: DefaultCacheControls;
  private _partials: Map<string, PartialData>;
  private _resourceKey: string;
  private _responses: Cachemap;

  constructor({ cachemapOptions, defaultCacheControls, resourceKey }: CacheArgs) {
    this._cachemapOptions = cachemapOptions;
    this._defaultCacheControls = defaultCacheControls;
    this._partials = new Map();
    this._resourceKey = resourceKey;
  }

  get responses(): Cachemap {
    return this._responses;
  }

  get dataEntities(): Cachemap {
    return this._dataEntities;
  }

  get dataPaths(): Cachemap {
    return this._dataPaths;
  }

  public async analyze(
    queryHash: string,
    ast: DocumentNode,
    fieldTypeMap: FieldTypeMap,
  ): Promise<AnalyzeResult> {
    const {
      cacheMetadata,
      checkList,
      counter,
      queriedData,
    } = await this._checkDataCaches(ast, fieldTypeMap);

    if (counter.missing === counter.total) {
      return { filtered: false, updatedAST: ast, updatedQuery: print(ast) };
    }

    if (!counter.missing) return { cachedData: queriedData, cacheMetadata };
    this._partials.set(queryHash, { cacheMetadata, cachedData: queriedData });
    await Cache._filterQuery(ast, checkList);
    return { filtered: true, updatedAST: ast, updatedQuery: print(ast) };
  }

  public async resolve(
    query: string,
    ast: DocumentNode,
    queryHash: string,
    fieldTypeMap: FieldTypeMap,
    data: ObjectMap,
    cacheMetadata: CacheMetadata,
    opts: { cacheResolve: DataCachedResolver, filtered: boolean },
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
      partial && partial.cacheMetadata,
    );

    const updatedCacheability = updatedCacheMetadata.get("query");

    const updatedCacheControl = updatedCacheability
      && updatedCacheability.printCacheControl()
      || defaultCacheControl;

    const filterCacheMetadata = opts.filtered && this._updateCacheMetadata(ast, data, cacheMetadata);
    const filterCacheability = filterCacheMetadata && filterCacheMetadata.get("query");

    const filterCacheControl = filterCacheability
      && filterCacheability.printCacheControl()
      || defaultCacheControl;

    (async () => {
      const promises: Array<Promise<void>> = [];

      promises.push(this._responses.set(
        queryHash,
        { cacheMetadata: mapToObject(updatedCacheMetadata), data: updatedData },
        { cacheHeaders: { cacheControl: updatedCacheControl },
      }));

      promises.push(this._updateDataCaches(ast, updatedData, updatedCacheMetadata, fieldTypeMap));

      if (filterCacheMetadata) {
        promises.push(this._responses.set(
          Cache.hash(query),
          { cacheMetadata: mapToObject(filterCacheMetadata), data },
          { cacheHeaders: { cacheControl: filterCacheControl },
        }));
      }

      await Promise.all(promises);
      opts.cacheResolve();
    })();

    return { cacheMetadata: updatedCacheMetadata, data: updatedData };
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

    const cacheability = await this._dataEntities.has(key);
    let cachedData: ObjectMap | undefined;
    if (cacheability && Cache.isValid(cacheability)) cachedData = await this._dataEntities.get(key);
    return { cacheability, cachedData };
  }

  private async _checkDataPathCacheEntry(hashKey: string): Promise<CacheEntryResult> {
    const cacheability = await this._dataPaths.has(hashKey);
    let cachedData;
    if (cacheability && Cache.isValid(cacheability)) cachedData = await this._dataPaths.get(hashKey);
    return { cacheability, cachedData };
  }

  private async _createCachemaps(): Promise<void> {
    this._dataEntities = await createCachemap(this._cachemapOptions.dataEntities);
    this._dataPaths = await createCachemap(this._cachemapOptions.dataPaths);
    this._responses = await createCachemap(this._cachemapOptions.responses);
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
    data: { entities: ObjectMap | any[], paths: ObjectMap | any[] },
    cacheMetadata: CacheMetadata,
    cacheControl: string,
    paths?: KeyPaths,
    index?: number,
  ): Promise<void> {
    const {
      cacheKey,
      dataKey,
      hashKey,
      queryKey,
    } = Cache._getKeys(field, paths, index);

    const entityfieldData = get(data.entities, dataKey, null);
    const pathfieldData = get(data.paths, dataKey, null);
    if (!isObjectLike(entityfieldData) && !isObjectLike(pathfieldData)) return;
    const metadata = cacheMetadata.get(queryKey);
    const _cacheControl = metadata && metadata.printCacheControl() || cacheControl;
    const promises: Array<Promise<void>> = [];

    Cache._iterateChildFields(field, pathfieldData, (childField, childIndex) => {
      promises.push(this._parseData(
        childField,
        fieldTypeMap,
        data,
        cacheMetadata,
        _cacheControl,
        { cachePath: cacheKey, dataPath: dataKey, queryPath: queryKey },
        childIndex,
      ));
    });

    await Promise.all(promises);

    await this._setData(
      field,
      fieldTypeMap,
      data,
      entityfieldData,
      pathfieldData,
      _cacheControl,
      { dataKey, hashKey, queryKey },
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
      await Cache._parseSingleField(
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
    } = Cache._getKeys(field, { cachePath, queryPath }, index);

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

    Cache._setCacheEntryMetadata(
      metadata,
      cacheEntryData,
      { propKey, queryKey },
    );

    if (!isObjectLike(cacheEntryData.primary) && !isObjectLike(cacheEntryData.secondary)) return;
    const objectLikeData = cacheEntryData.primary || cacheEntryData.secondary as ObjectMap | any[];
    const { cacheMetadata, checkList, counter, queriedData } = metadata;
    const promises: Array<Promise<void>> = [];

    Cache._iterateChildFields(field, objectLikeData, (childField, childIndex) => {
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
    data: { entities: ObjectMap | any[], paths: ObjectMap | any[] },
    entityfieldData: ObjectMap | any[],
    pathfieldData: ObjectMap | any[],
    cacheControl: string,
    { dataKey, hashKey, queryKey }: { dataKey: string, hashKey: string, queryKey: string },
  ): Promise<void> {
    const fieldTypeInfo = fieldTypeMap.get(queryKey);
    if (!fieldTypeInfo) return;

    if (!fieldTypeInfo.isEntity && fieldTypeInfo.hasArguments) {
      unset(data.entities, dataKey);
    }

    const promises: Array<Promise<void>> = [];

    if (fieldTypeInfo.isEntity) {
      const objectMapEntityfieldData = entityfieldData as ObjectMap;
      const entityDataKey = `${fieldTypeInfo.typeName}:${objectMapEntityfieldData[this._resourceKey]}`;

      promises.push(this._dataEntities.set(
        entityDataKey,
        cloneDeep(objectMapEntityfieldData),
        { cacheHeaders: { cacheControl } },
      ));

      set(data.entities, dataKey, { _EntityKey: entityDataKey });
    }

    if (fieldTypeInfo.isEntity || fieldTypeInfo.hasArguments) {
      promises.push(this._dataPaths.set(
        hashKey,
        cloneDeep(pathfieldData),
        { cacheHeaders: { cacheControl } },
      ));

      if (hasChildFields(field)) {
        if (fieldTypeInfo.isEntity) {
          set(data.paths, dataKey, { _HashKey: hashKey });
        } else {
          unset(data.paths, dataKey);
        }
      }
    }

    await Promise.all(promises);
  }

  private _updateCacheMetadata(
    ast: DocumentNode,
    data: ObjectMap,
    cacheMetadata: CacheMetadata,
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

    const queryNode = getOperationDefinitions(ast, "query")[0];
    const fields = getChildFields(queryNode) as FieldNode[];

    fields.forEach((field) => {
      Cache._parseResponseMetadata(field, data, _cacheMetadata);
    });

    if (!_cacheMetadata.has("query")) {
      const cacheability = new Cacheability();
      cacheability.parseCacheControl(this._defaultCacheControls.query);
      _cacheMetadata.set("query", cacheability);
    }

    return _cacheMetadata;
  }

  private async _updateDataCaches(
    ast: DocumentNode,
    data: ObjectMap,
    cacheMetadata: CacheMetadata,
    fieldTypeMap: FieldTypeMap,
  ): Promise<void> {
    const queryNode = getOperationDefinitions(ast, "query")[0];
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
        );
      }),
    );
  }
}
