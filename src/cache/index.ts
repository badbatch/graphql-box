import Cacheability from "cacheability";
import Cachemap from "cachemap";
import { DocumentNode, print } from "graphql";

import {
  cloneDeep,
  get,
  isArray,
  isNumber,
  isObjectLike,
  isPlainObject,
} from "lodash";

import * as md5 from "md5";

import {
  AnalyzeResult,
  CacheArgs,
  PartialData,
  CheckObjectCacheMetadata,
} from "./types";

import { DefaultCacheControls } from "../client/types";
import mergeObjects from "../helpers/merging";

import {
  getChildFields,
  getName,
  unwrapInlineFragments,
} from "../helpers/parsing";

export default class Cache {
  private _dataObjects: Cachemap;
  private _defaultCacheControls: DefaultCacheControls;
  private _partials: Map<string, PartialData>;
  private _responses: Cachemap;

  constructor({ cachemapOptions = {}, defaultCacheControls }: CacheArgs) {
    this._dataObjects = new Cachemap(cachemapOptions.dataObjects);
    this._defaultCacheControls = defaultCacheControls;
    this._partials = new Map();
    this._responses = new Cachemap(cachemapOptions.responses);
  }

  get responses(): Cachemap {
    return this._responses;
  }

  get dataObjects(): Cachemap {
    return this._dataObjects;
  }

  /**
   *
   * @private
   * @param {string} hashKey
   * @return {Promise}
   */
  async _checkCacheEntry(hashKey) {
    const cacheability = await this._obj.has(hashKey);
    let cachedData;
    if (this.isValid(cacheability)) cachedData = await this._obj.get(hashKey);
    return { cacheability, cachedData };
  }

  /**
   *
   * @private
   * @param {Object} field
   * @param {Map} checkList
   * @param {string} queryPath
   * @return {boolean}
   */
  _filterField(field, checkList, queryPath) {
    const childFields = unwrapInlineFragments(getChildFields(field));

    for (let i = childFields.length - 1; i >= 0; i -= 1) {
      const child = childFields[i];
      if (getName(child) === '_metadata') continue; // eslint-disable-line no-continue
      const { queryKey } = this._getKeys(child, { queryPath });
      const check = checkList.get(queryKey);

      if (!isParentField(child) && check) {
        deleteChildField(field, child);
      } else if (check && this._filterField(child, checkList, queryKey)) {
        deleteChildField(field, child);
      }
    }

    return !isParentField(field);
  }

  /**
   *
   * @private
   * @param {Document} ast
   * @param {Object} checkList
   * @return {Promise}
   */
  async _filterQuery(ast, checkList) {
    const rootFields = getRootFields(ast);

    for (let i = rootFields.length - 1; i >= 0; i -= 1) {
      const field = rootFields[i];
      const queryField = getQuery(ast);
      const { queryKey } = this._getKeys(field);
      if (this._filterField(field, checkList, queryKey)) deleteChildField(queryField, field);
    }
  }

  /**
   *
   * @private
   * @param {Object} field
   * @param {Object} [paths]
   * @param {string} [paths.cachePath]
   * @param {string} [paths.dataPath]
   * @param {string} [paths.queryPath]
   * @param {number} [index]
   * @return {Object}
   */
  _getKeys(field, { cachePath, dataPath, queryPath } = {}, index) {
    const name = getName(field);
    const args = parseFieldArguments(getFieldArguments(field));
    const cacheKey = buildCacheKey(name, index, args, cachePath);
    const hashKey = this.hash(cacheKey);
    const aliasKey = getFieldAlias(field);
    const nameKey = aliasKey || name;
    const queryKey = isNumber(index) ? queryPath : buildQueryKey(nameKey, queryPath);
    const propKey = isNumber(index) ? index : nameKey;
    const dataKey = buildDataKey(propKey, dataPath);
    return {
      cacheKey, dataKey, hashKey, name, propKey, queryKey,
    };
  }

  /**
   *
   * @private
   * @param {string} hash
   * @return {Object}
   */
  _getPartial(hash) {
    if (!this._partials.has(hash)) return {};
    const partialData = this._partials.get(hash);
    this._partials.delete(hash);
    return partialData;
  }

  /**
   *
   * @private
   * @param {Document} field
   * @param {Object} data
   * @param {Function} callback
   * @return {void}
   */
  _iterateChildFields(field, data, callback) {
    if (!isArray(data)) {
      unwrapInlineFragments(getChildFields(field)).forEach((child) => {
        callback(child);
      });
    } else {
      data.forEach((value, index) => {
        callback(field, index);
      });
    }
  }

  /**
   *
   * @private
   * @param {Document} field
   * @param {Object} metadata
   * @param {Object} [cachedData]
   * @param {string} [cachePath]
   * @param {string} [queryPath]
   * @param {number} [index]
   * @return {Promise}
   */
  async _parseField(field, metadata, cachedData, cachePath, queryPath, index) {
    if (isParentField(field)) {
      await this._parseParentField(field, metadata, cachePath, queryPath, index);
    } else {
      await this._parseSingleField(field, metadata, cachedData, cachePath, queryPath, index);
    }
  }

  /**
   *
   * @private
   * @param {Document} field
   * @param {Object} metadata
   * @param {string} [cachePath]
   * @param {string} [queryPath]
   * @param {number} [index]
   * @return {Promise}
   */
  async _parseParentField(field, metadata, cachePath, queryPath, index) {
    const {
      cacheKey,
      hashKey,
      propKey,
      queryKey,
    } = this._getKeys(field, { cachePath, queryPath }, index);

    const { cacheability, cachedData } = await this._checkCacheEntry(hashKey);
    this._setCacheEntryData(metadata, cachedData, cacheability, { propKey, queryKey });
    if (!isObjectLike(cachedData)) return;
    const {
      cache, checkList, counter, queried,
    } = metadata;
    const promises = [];

    this._iterateChildFields(field, cachedData, (childField, childIndex) => {
      if (getName(childField) === '_metadata') return;

      promises.push(this._parseField(
        childField,
        {
          cache, checkList, counter, queried: queried[propKey],
        },
        cachedData,
        cacheKey,
        queryKey,
        childIndex,
      ));
    });

    await Promise.all(promises);
  }

  /**
   *
   * @private
   * @param {Document} field
   * @param {Object} data
   * @param {Map} cacheMetadata
   * @param {string} [dataPath]
   * @param {string} [queryPath]
   * @param {number} [index]
   * @return {void}
   */
  _parseResponseMetadata(field, data, cacheMetadata, dataPath, queryPath, index) {
    const { dataKey, queryKey } = this._getKeys(field, { dataPath, queryPath }, index);
    const fieldData = get(data, dataKey, null);
    if (!isObjectLike(fieldData)) return;

    if (Object.prototype.hasOwnProperty.call(fieldData, '_metadata')) {
      if (get(fieldData._metadata, ['cacheControl'])) {
        const cacheability = new Cacheability();
        cacheability.parseCacheControl(fieldData._metadata.cacheControl);
        this._setCacheData(cacheMetadata, cacheability, { queryKey });
      }

      delete fieldData._metadata;
    }

    this._iterateChildFields(field, fieldData, (childField, childIndex) => {
      this._parseResponseMetadata(childField, data, cacheMetadata, dataKey, queryKey, childIndex);
    });
  }

  /**
   *
   * @private
   * @param {Document} field
   * @param {Object} metadata
   * @param {any} cachedData
   * @param {string} cachePath
   * @param {string} queryPath
   * @param {number} [index]
   * @return {Promise}
   */
  async _parseSingleField(field, metadata, cachedData, cachePath, queryPath, index) {
    const { name, propKey, queryKey } = this._getKeys(field, { cachePath, queryPath }, index);
    const _cachedData = cachedData[name];
    const { checkList, counter, queried } = metadata;
    this._setCheckList(checkList, _cachedData, { queryKey });
    this._setCounter(counter, _cachedData);
    this._setQueriedData(queried, _cachedData, { propKey });
  }

  /**
   *
   * @private
   * @param {Object} metadata
   * @param {any} cachedData
   * @param {Object} cacheability
   * @param {Object} keys
   * @param {string} keys.propKey
   * @param {string} keys.queryKey
   * @return {void}
   */
  _setCacheEntryData(metadata, cachedData, cacheability, { propKey, queryKey }) {
    const {
      cache, checkList, counter, queried,
    } = metadata;
    this._setCacheData(cache, cacheability, { queryKey });
    this._setCheckList(checkList, cachedData, { queryKey });
    this._setCounter(counter, cachedData);
    this._setQueriedData(queried, cachedData, { propKey });
  }

  /**
   *
   * @private
   * @param {Map} cacheMetadata
   * @param {Object} cacheability
   * @param {Object} keys
   * @param {string} keys.queryKey
   * @return {void}
   */
  _setCacheData(cacheMetadata, cacheability, { queryKey }) {
    if (cacheMetadata.has(queryKey) || !this.isValid(cacheability)) return;
    cacheMetadata.set(queryKey, cacheability);
    const queryCacheability = cacheMetadata.get('query');

    if (!queryCacheability || queryCacheability.metadata.ttl > cacheability.metadata.ttl) {
      cacheMetadata.set('query', cacheability);
    }
  }

  /**
   *
   * @private
   * @param {Map} checkList
   * @param {any} cachedData
   * @param {Object} keys
   * @param {string} keys.queryKey
   * @return {void}
   */
  _setCheckList(checkList, cachedData, { queryKey }) {
    if (checkList.has(queryKey)) return;
    checkList.set(queryKey, cachedData !== undefined);
  }

  /**
   *
   * @private
   * @param {Object} counter
   * @param {any} cachedData
   * @return {void}
   */
  _setCounter(counter, cachedData) {
    counter.total += 1;
    if (cachedData === undefined) counter.missing += 1;
  }

  /**
   *
   * @private
   * @param {Object} field
   * @param {Object} data
   * @param {Object} cacheMetadata
   * @param {string} cacheControl
   * @param {Object} [paths]
   * @param {number} [index]
   * @return {Promise}
   */
  async _setObject(field, data, cacheMetadata, cacheControl, paths, index) {
    const {
      cacheKey, dataKey, hashKey, queryKey,
    } = this._getKeys(field, paths, index);
    const fieldData = cloneDeep(get(data, dataKey, null));
    if (!isObjectLike(fieldData)) return;
    let _cacheControl = cacheControl;
    const metadata = cacheMetadata.get(queryKey);
    if (metadata) _cacheControl = metadata.printCacheControl();

    this._iterateChildFields(field, fieldData, (childField, childIndex) => {
      this._setObjectHashKey(fieldData, dataKey, cacheKey, childField, childIndex);

      this._setObject(
        childField,
        data,
        cacheMetadata,
        _cacheControl,
        { cachePath: cacheKey, dataPath: dataKey, queryPath: queryKey },
        childIndex,
      );
    });

    this._obj.set(hashKey, fieldData, { cacheHeaders: { cacheControl: _cacheControl } });
  }

  /**
   *
   * @private
   * @param {Object} data
   * @param {string} dataPath
   * @param {string} cachePath
   * @param {Object} field
   * @param {number} index
   * @return {void}
   */
  _setObjectHashKey(data, dataPath, cachePath, field, index) {
    if (!unwrapInlineFragments(getChildFields(field)).length) return;
    const { hashKey, propKey } = this._getKeys(field, { cachePath, dataPath }, index);
    data[propKey] = { _HashKey: hashKey };
  }

  /**
   *
   * @private
   * @param {Object} queriedData
   * @param {any} cachedData
   * @param {Object} keys
   * @param {string} keys.propKey
   * @return {void}
   */
  _setQueriedData(queriedData, cachedData, { propKey }) {
    if (!isObjectLike(cachedData) && cachedData !== undefined) {
      queriedData[propKey] = cachedData;
    } else if (isObjectLike(cachedData)) {
      queriedData[propKey] = isArray(cachedData) ? [] : {};
    }
  }

  /**
   *
   * @private
   * @param {Document} ast
   * @param {Object} data
   * @param {Map} cacheMetadata
   * @param {Map} [partialCacheMetadata]
   * @return {Map}
   */
  _updateCacheMetadata(ast, data, cacheMetadata, partialCacheMetadata) {
    let _cacheMetadata = new Map([...cacheMetadata]);

    if (partialCacheMetadata) {
      const cacheCacheability = cacheMetadata.get('query');
      const partialCacheability = partialCacheMetadata.get('query');

      if (cacheCacheability && cacheCacheability.metadata.ttl < partialCacheability.metadata.ttl) {
        _cacheMetadata = new Map([...partialCacheMetadata, ...cacheMetadata]);
      } else {
        _cacheMetadata = new Map([...cacheMetadata, ...partialCacheMetadata]);
      }
    }

    getRootFields(ast, (field) => {
      this._parseResponseMetadata(field, data, _cacheMetadata);
    });

    if (!_cacheMetadata.has('query')) {
      const cacheability = new Cacheability();
      cacheability.parseCacheControl(this._defaultCacheControls.query);
      _cacheMetadata.set('query', cacheability);
    }

    return _cacheMetadata;
  }

  /**
   *
   * @private
   * @param {Document} ast
   * @param {Object} data
   * @param {Map} cacheMetadata
   * @return {Promise}
   */
  async _updateObjectCache(ast, data, cacheMetadata) {
    const queryCache = cacheMetadata.get('query');

    getRootFields(ast, (field) => {
      this._setObject(field, data, cacheMetadata, queryCache.printCacheControl());
    });
  }

  public async analyze(hash: string, ast: DocumentNode): Promise<AnalyzeResult> {
    const {
      cachedData,
      cacheMetadata,
      checkList,
      counter,
    } = await this._checkObjectCache(ast);

    if (counter.missing === counter.total) {
      return { updatedAST: ast, updatedQuery: print(ast) };
    }

    if (!counter.missing) return { cachedData, cacheMetadata };
    this._partials.set(hash, { cacheMetadata, cachedData });
    await this._filterQuery(ast, checkList);
    return { filtered: true, updatedAST: ast, updatedQuery: print(ast) };
  }

  private async _checkObjectCache(ast: DocumentNode): Promise<CheckObjectCacheMetadata> {
    const metadata: CheckObjectCacheMetadata = {
      cachedData: {},
      cacheMetadata: new Map(),
      checkList: new Map(),
      counter: { missing: 0, total: 0 },
    };

    const promises = [];

    getRootFields(ast, (field) => {
      promises.push(this._parseField(field, metadata));
    });

    await Promise.all(promises);
    return metadata;
  }

  /**
   *
   * @param {Object} cacheability
   * @return {boolean}
   */
  isValid(cacheability) {
    const noCache = get(cacheability, ['metadata', 'cacheControl', 'noCache'], false);
    return cacheability && !noCache && cacheability.checkTTL();
  }

  /**
   *
   * @param {string} value
   * @return {string}
   */
  hash(value) {
    return md5(value.replace(/\s/g, ''));
  }

  /**
   *
   * @param {string} query
   * @param {Document} ast
   * @param {string} hash
   * @param {Object} data
   * @param {Object} cacheMetadata
   * @param {Object} opts
   * @return {Promise}
   */
  async resolve(query, ast, hash, data, cacheMetadata, opts) {
    if (opts.filtered) {
      const filteredHash = this.hash(query);
      const _cacheMetadata = this._updateCacheMetadata(ast, data, cacheMetadata);

      this._res.set(filteredHash, { cacheMetadata: mapToObject(_cacheMetadata), data }, {
        cacheHeaders: { cacheControl: _cacheMetadata.get('query').printCacheControl() },
      });
    }

    const partial = this._getPartial(hash);
    let _data = data;

    if (partial.cachedData) {
      _data = mergeObjects(partial.cachedData, data, (key, val) => {
        if (isPlainObject(val) && val.id) return val.id;
        return false;
      });
    }

    const _cacheMetadata = this._updateCacheMetadata(
      ast,
      data,
      cacheMetadata,
      partial.cacheMetadata,
    );

    this._res.set(hash, { cacheMetadata: mapToObject(_cacheMetadata), data: _data }, {
      cacheHeaders: { cacheControl: _cacheMetadata.get('query').printCacheControl() },
    });

    this._updateObjectCache(ast, _data, _cacheMetadata);
    return { cacheMetadata: _cacheMetadata, data: _data };
  }
}
