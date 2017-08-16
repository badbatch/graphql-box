import Cachemap from 'cachemap';
import { parse, print, TypeInfo, visit } from 'graphql';

import {
  cloneDeep,
  get,
  has,
  isArray,
  isBoolean,
  isNumber,
  isObjectLike,
  isPlainObject,
  isString,
} from 'lodash';

import md5 from 'md5';
import mergeObjects from '../helpers/merging';

import {
  addChildField,
  buildCacheKey,
  buildDataKey,
  deleteChildField,
  getChildField,
  getChildFields,
  getFieldAlias,
  getFieldArguments,
  getKind,
  getName,
  getQuery,
  getRootField,
  getRootFields,
  getType,
  hasChildField,
  isParentField,
} from '../helpers/parsing';

import logger from '../logger';

/**
 *
 * The cache
 */
export default class Cache {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {void}
   */
  constructor({
    /**
     * Optional configuration to be passed to the
     * cachemap modules.
     *
     * @type {Object}
     */
    cachemapOptions = { obj: {}, res: {} },
    /**
     * Identifier used as the key for each resource
     * requested from the server.
     *
     * @type {string}
     */
    resourceKey,
    /**
     * Graphql schema.
     *
     * @type {Schema}
     */
    schema,
  } = {}) {
    this._partials = new Map();
    this._res = new Cachemap(cachemapOptions.res);
    this._resourceKey = resourceKey;
    this._obj = new Cachemap(cachemapOptions.obj);
    this._schema = schema;
  }

  /**
   *
   * @return {Object}
   */
  get res() {
    return this._res;
  }

  /**
   *
   * @return {Object}
   */
  get obj() {
    return this._obj;
  }

  /**
   *
   * @private
   * @param {Object} cacheability
   * @return {boolean}
   */
  _cacheValid(cacheability) {
    return cacheability && !cacheability.noCache && cacheability.check();
  }

  /**
   *
   * @private
   * @param {string} hashKey
   * @return {Promise}
   */
  async _checkCacheEntry(hashKey) {
    let cachedData, cacheability;

    try {
      cacheability = await this._obj.has(hashKey);
      if (this._cacheValid(cacheability)) cachedData = await this._obj.get(hashKey);
    } catch (err) {
      logger.error(err);
    }

    return { cacheability, cachedData };
  }

  /**
   *
   * @private
   * @param {Document} ast
   * @return {Promise}
   */
  async _checkObjectCache(ast) {
    const checkList = {};
    const metadata = { missing: 0, total: 0 };
    const queriedData = {};
    const promises = [];

    getRootFields(ast, (field) => {
      promises.push(this._parseField(field, queriedData, checkList, metadata));
    });

    await Promise.all(promises);
    return { checkList, metadata, queriedData };
  }

  /**
   *
   * @private
   * @param {Object} field
   * @param {Object} checkList
   * @return {boolean}
   */
  _filterField(field, checkList) {
    let _checkList = checkList;

    if (isArray(checkList)) {
      if (!checkList.length) return true;
      _checkList = checkList[0];
    }

    const childFields = getChildFields(field);

    for (let i = childFields.length - 1; i >= 0; i -= 1) {
      const child = childFields[i];
      const { propKey } = this._getKeys(child);

      if (!isParentField(child)) {
        if (_checkList[propKey]) deleteChildField(field, child);
      } else if (isBoolean(_checkList[propKey]) && _checkList[propKey]) {
        deleteChildField(field, child);
      } else if (_checkList[propKey] && this._filterField(child, _checkList[propKey])) {
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
      const { propKey } = this._getKeys(field);
      const queryField = getQuery(ast);
      if (this._filterField(field, checkList[propKey])) deleteChildField(queryField, field);
    }
  }

  /**
   *
   * @private
   * @param {Object} field
   * @param {Object} [paths]
   * @param {string} [paths.cachePath]
   * @param {string} [paths.dataPath]
   * @param {number} [index]
   * @return {Object}
   */
  _getKeys(field, { cachePath, dataPath } = {}, index) {
    const name = getName(field);
    const args = getFieldArguments(field);
    const nameKey = isNumber(index) ? index : name;
    const _cachePath = isString(cachePath) ? [cachePath] : [];
    const cacheKey = buildCacheKey(nameKey, args, _cachePath);
    const hashKey = this.hash(cacheKey);
    const aliasKey = getFieldAlias(field);
    const propKey = isNumber(index) ? index : aliasKey || name;
    const _dataPath = isString(dataPath) ? [dataPath] : [];
    const dataKey = buildDataKey(propKey, _dataPath);
    return { cacheKey, dataKey, hashKey, name, propKey };
  }

  /**
   *
   * @private
   * @param {string} hash
   * @return {any}
   */
  _getPartial(hash) {
    if (!this._partials.has(hash)) return null;
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
      getChildFields(field).forEach((child) => {
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
   * @param {Object} queriedData
   * @param {Object} checkList
   * @param {Object} metadata
   * @param {Object} [cachedData]
   * @param {string} [cachePath]
   * @param {number} [index]
   * @return {Promise}
   */
  async _parseField(field, queriedData, checkList, metadata, cachedData, cachePath, index) {
    if (isParentField(field)) {
      await this._parseParentField(
        field, queriedData, checkList, metadata, cachePath, index,
      );
    } else {
      await this._parseSingleField(
        field, queriedData, checkList, metadata, cachedData, cachePath, index,
      );
    }
  }

  /**
   *
   * @private
   * @param {Document} field
   * @param {Object} queriedData
   * @param {Object} checkList
   * @param {Object} metadata
   * @param {string} [cachePath]
   * @param {number} [index]
   * @return {Promise}
   */
  async _parseParentField(field, queriedData, checkList, metadata, cachePath, index) {
    const { cacheKey, hashKey, propKey } = this._getKeys(field, { cachePath }, index);
    const { cacheability, cachedData } = await this._checkCacheEntry(hashKey);

    this._setCacheEntryData(
      queriedData, checkList, metadata, cachedData, cacheability, propKey,
    );

    if (!isObjectLike(cachedData)) return;
    const promises = [];

    this._iterateChildFields(field, cachedData, (childField, childIndex) => {
      promises.push(this._parseField(
        childField,
        queriedData[propKey],
        checkList[propKey],
        metadata,
        cachedData,
        cacheKey,
        childIndex,
      ));
    });

    await Promise.all(promises);
  }

  /**
   *
   * @private
   * @param {Document} field
   * @param {Object} queriedData
   * @param {Object} checkList
   * @param {Object} metadata
   * @param {any} cachedData
   * @param {string} cachePath
   * @param {number} [index]
   * @return {Promise}
   */
  async _parseSingleField(field, queriedData, checkList, metadata, cachedData, cachePath, index) {
    const { name, propKey } = this._getKeys(field, { cachePath }, index);
    const _cachedData = cachedData[name];
    this._setCheckList(checkList, _cachedData, propKey);
    this._setMetadata(metadata, _cachedData);
    this._setQueriedData(queriedData, _cachedData, propKey);
  }

  /**
   *
   * @private
   * @param {Object} queriedData
   * @param {Object} checkList
   * @param {Object} metadata
   * @param {any} cachedData
   * @param {Object} cacheability
   * @param {string} propKey
   * @return {void}
   */
  _setCacheEntryData(queriedData, checkList, metadata, cachedData, cacheability, propKey) {
    this._setCheckList(checkList, cachedData, propKey);
    this._setMetadata(metadata, cachedData, cacheability);
    this._setQueriedData(queriedData, cachedData, propKey, cacheability);
  }

  /**
   *
   * @private
   * @param {Object} checkList
   * @param {any} cachedData
   * @param {string} propKey
   * @return {void}
   */
  _setCheckList(checkList, cachedData, propKey) {
    if (!isObjectLike(cachedData)) {
      checkList[propKey] = cachedData !== undefined;
    } else {
      checkList[propKey] = isArray(cachedData) ? [] : {};
    }
  }

  /**
   *
   * @private
   * @param {Object} metadata
   * @param {any} cachedData
   * @param {Object} cacheability
   * @return {void}
   */
  _setMetadata(metadata, cachedData, cacheability) {
    metadata.total += 1;
    if (cachedData === undefined) metadata.missing += 1;
    const cacheValid = this._cacheValid(cacheability);
    if (!cacheValid) return;
    const cacheTTL = cacheability.ttl || 0;
    const metaTTL = metadata.ttl || 0;
    const metaCacheControl = metadata.cacheControl;

    if (!metaCacheControl || cacheTTL > metaTTL) {
      metadata.cacheControl = cacheability.printCacheControl();
      metadata.ttl = cacheTTL;
    }
  }

  /**
   *
   * @private
   * @param {Object} field
   * @param {Object} data
   * @param {Object} headers
   * @param {string} [dataPath]
   * @param {string} [cachePath]
   * @param {number} [index]
   * @return {Promise}
   */
  async _setObject(field, data, headers, dataPath, cachePath, index) {
    const { cacheKey, dataKey, hashKey } = this._getKeys(field, { cachePath, dataPath }, index);
    const fieldData = cloneDeep(get(data, dataKey));
    if (!isObjectLike(fieldData)) return;
    let fieldHeaders = headers;

    if (has(fieldData, '_Headers')) {
      fieldHeaders = fieldData._Headers;
      delete fieldData._Headers;
    }

    this._iterateChildFields(field, fieldData, (childField, childIndex) => {
      this._setObjectHashKey(fieldData, dataKey, cacheKey, childField, childIndex);
      this._setObject(childField, data, fieldHeaders, dataKey, cacheKey, childIndex);
    });

    this._obj.set(hashKey, fieldData, { cacheHeaders: fieldHeaders });
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
    if (!getChildFields(field).length) return;
    const { hashKey, propKey } = this._getKeys(field, { cachePath, dataPath }, index);
    data[propKey] = { _HashKey: hashKey };
  }

  /**
   *
   * @private
   * @param {Object} queriedData
   * @param {any} cachedData
   * @param {string} propKey
   * @param {Object} cacheability
   * @return {void}
   */
  _setQueriedData(queriedData, cachedData, propKey, cacheability) {
    if (!isObjectLike(cachedData) && cachedData !== undefined) queriedData[propKey] = cachedData;
    if (isObjectLike(cachedData)) queriedData[propKey] = isArray(cachedData) ? [] : {};

    if (isPlainObject(queriedData[propKey]) && this._cacheValid(cacheability)) {
      queriedData[propKey]._Headers = { cacheControl: cacheability.printCacheControl() };
    }
  }

  /**
   *
   * @private
   * @param {Document} ast
   * @param {Object} data
   * @param {Object} headers
   * @return {Promise}
   */
  async _updateObjectCache(ast, data, headers) {
    getRootFields(ast, (field) => {
      this._setObject(field, data, headers);
    });
  }

  /**
   *
   * @private
   * @param {Document} ast
   * @return {Promise}
   */
  async _updateQuery(ast) {
    const _this = this;
    const typeInfo = new TypeInfo(this._schema);

    return visit(ast, {
      enter(node) {
        typeInfo.enter(node);
        if (getKind(node) !== 'Field') return;
        const type = getType(typeInfo.getFieldDef());
        if (!type.getFields) return;
        const fields = type.getFields();
        const name = getName(node);

        if (fields[_this._resourceKey] && !hasChildField(node, _this._resourceKey)) {
          const mockAST = parse(`{ ${name} {${_this._resourceKey}} }`);
          const fieldAST = getChildField(getRootField(mockAST, name), _this._resourceKey);
          addChildField(node, fieldAST);
        }

        if (fields._Headers && !hasChildField(node, '_Headers')) {
          const mockAST = parse(`{ ${name} { _Headers } }`);
          const fieldAST = getChildField(getRootField(mockAST, name), '_Headers');
          addChildField(node, fieldAST);
        }
      },
      leave(node) {
        typeInfo.leave(node);
      },
    });
  }

  /**
   *
   * @param {string} hash
   * @param {Document} ast
   * @return {Promise}
   */
  async analyze(hash, ast) {
    const { checkList, metadata, queriedData } = await this._checkObjectCache(ast);

    if (metadata.missing === metadata.total) {
      const updatedAST = await this._updateQuery(ast);
      return { updatedAST, updatedQuery: print(updatedAST) };
    }

    if (!metadata.missing) return { cachedData: queriedData, cacheHeaders: metadata.headers };
    this._partials.set(hash, queriedData);
    await this._filterQuery(ast, checkList);
    const updatedAST = await this._updateQuery(ast);
    return { filtered: true, updatedAST, updatedQuery: print(updatedAST) };
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
   * @param {Object} cacheHeaders
   * @param {Object} opts
   * @return {Promise}
   */
  async resolve(query, ast, hash, data, cacheHeaders, opts) {
    if (opts.filtered) {
      const filteredHash = this.hash(query);
      this._res.set(filteredHash, data, { cacheHeaders });
    }

    const partialData = this._getPartial(hash);
    let _data = data;

    if (partialData) {
      _data = mergeObjects(partialData, data, (key, val) => {
        if (isPlainObject(val) && val.id) return val.id;
        return false;
      });
    }

    this._res.set(hash, _data, { cacheHeaders });
    this._updateObjectCache(ast, _data, cacheHeaders);
    return _data;
  }
}
