import Cacheability from 'cacheability';

import {
  buildClientSchema,
  execute,
  parse,
  parseValue,
  print,
  TypeInfo,
  validate,
  visit,
} from 'graphql';

import { isFunction, isString } from 'lodash';
import Cache from './cache';

import {
  addChildField,
  deleteFragmentDefinitions,
  deleteVariableDefinitions,
  getChildField,
  getFragmentDefinitions,
  getKind,
  getName,
  getOperationName,
  getOperations,
  getRootField,
  getType,
  getTypeCondition,
  hasChildField,
  hasFragmentDefinitions,
  hasFragmentSpread,
  hasVariableDefinitions,
  mapToObject,
  setFragments,
} from './helpers/parsing';

import logger from './logger';

require('es6-promise').polyfill();
require('isomorphic-fetch');

let instance;

/**
 *
 * The graphql client
 */
export default class Client {
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
    cachemapOptions,
    /**
     * Optional default cache control for queries
     * and mutations.
     *
     * @type {Object}
     */
    defaultCacheControls = {
      mutation: 'max-age=0, s-maxage=0, no-cache, no-store',
      query: 'public, max-age=60, s-maxage=60',
    },
    /**
     * Optional override for client's execute method,
     * which calls graphql's execute method.
     *
     * @type {Function}
     */
    executor,
    /**
     * Optional Graphql default field resolver function.
     *
     * @type {Function}
     */
    fieldResolver,
    /**
     * Any headers to be sent with requests, such as
     * authentication headers.
     *
     * @type {Object}
     */
    headers = {},
    /**
     * Introspection query required for clients
     * running in external mode.
     *
     * @type {Object}
     */
    introspection,
    /**
     * Mode for the client to run in.
     *
     * @type {string}
     */
    mode = 'internal',
    /**
     * Whether to create a new instance of a
     * client or return the existing instance.
     *
     * @type {boolean}
     */
    newInstance = false,
    /**
     * Identifier used as the key for each resource
     * requested from the server.
     *
     * @type {string}
     */
    resourceKey = 'id',
    /**
     * Optional Graphql root value.
     *
     * @type {any}
     */
    rootValue = null,
    /**
     * Graphql schema required for clients
     * running in internal mode.
     *
     * @type {GraphQLSchema}
     */
    schema,
    /**
     * Endpoint required for clients
     * running in external mode.
     *
     * @type {string}
     */
    url,
  } = {}) {
    if (mode === 'internal' && !schema) {
      throw new Error('Schema is a mandatory argument for a client in internal mode.');
    }

    if (mode === 'external' && !introspection && !url) {
      throw new Error(
        'Introspection query and URL are mandatory arguments for a client in external mode.',
      );
    }

    if (instance && !newInstance) return instance;
    let _schema = schema;
    if (!_schema) _schema = buildClientSchema(introspection);

    this._cache = new Cache({
      cachemapOptions, defaultCacheControls, resourceKey, schema: _schema,
    });

    this._defaultCacheControls = defaultCacheControls;
    if (isFunction(executor)) this._execute = executor;
    this._fieldResolver = fieldResolver;
    this._headers = { ...this._headers, ...headers };
    this._mode = mode;
    this._requests = { active: new Map(), pending: new Map() };
    this._resourceKey = resourceKey;
    this._rootValue = rootValue;
    this._schema = _schema;
    if (url) this._url = url;
    instance = this;
    return instance;
  }

  /**
   *
   * @private
   * @type {Object}
   */
  _headers = { 'content-type': 'application/json' };

  /**
   *
   * @private
   * @param {string} hash
   * @return {Promise}
   */
  async _checkResponseCache(hash) {
    const cacheability = await this._cache.res.has(hash);
    let res;
    if (this._cache.cacheValid(cacheability)) res = await this._cache.res.get(hash);
    if (!res) return null;
    return { cacheMetadata: this._parseCacheMetadata(res.cacheMetadata), data: res.data };
  }

  /**
   *
   * @private
   * @param {string} query
   * @param {Object} fragments
   * @return {string}
   */
  _concatFragments(query, fragments) {
    return [query, ...fragments].join('\n\n');
  }

  /**
   *
   * @private
   * @param {Headers} headers
   * @param {Object} cacheMetadata
   * @return {Map}
   */
  _createCacheMetadata(headers, cacheMetadata) {
    if (cacheMetadata) return this._parseCacheMetadata(cacheMetadata);
    const cacheControl = headers && headers.get('cache-control');
    if (!cacheControl) return new Map();
    const cacheability = new Cacheability();
    cacheability.parseCacheControl(cacheControl);
    const _cacheMetadata = new Map();
    _cacheMetadata.set('query', cacheability);
    return _cacheMetadata;
  }

  /**
   *
   * @private
   * @param {GraphQLSchema} schema
   * @param {Document} ast
   * @param {any} rootValue
   * @param {Object} context
   * @param {null} variableValues
   * @param {string} operationName
   * @param {Function} fieldResolver
   * @return {Promise}
   */
  async _execute(schema, ast, rootValue, context, variableValues, operationName, fieldResolver) {
    return execute(schema, ast, rootValue, context, variableValues, operationName, fieldResolver);
  }

  /**
   *
   * @private
   * @param {string} request
   * @param {Document} ast
   * @param {Object} opts
   * @param {Object} context
   * @return {Promise}
   */
  async _fetch(request, ast, opts, context) {
    let res;

    if (this._mode === 'internal') {
      logger.info(`handl executing: ${request}`);

      try {
        res = await this._execute(
          this._schema,
          ast,
          this._rootValue,
          context,
          null,
          opts.operationName,
          this._fieldResolver,
        );
      } catch (err) {
        logger.error(err);
        return { errors: err };
      }

      return res;
    }

    logger.info(`handl fetching: ${request}`);

    try {
      res = await fetch(this._url, {
        body: JSON.stringify({ query: request }),
        headers: new Headers(this._headers),
        method: 'POST',
      });
    } catch (err) {
      logger.error(err);
      return { errors: err };
    }

    const { cacheMetadata, data, errors } = await res.json();
    return { cacheMetadata, data, errors, headers: res.headers };
  }

  /**
   *
   * @private
   * @param {string} mutation
   * @param {Document} ast
   * @param {Object} opts
   * @param {Object} context
   * @return {Promise}
   */
  async _mutation(mutation, ast, opts, context) {
    const { data, errors, headers } = await this._fetch(mutation, ast, opts, context);
    const cacheMetadata = this._createCacheMetadata(headers);
    if (errors) this._resolve('mutation', null, errors, cacheMetadata);
    return this._resolve('mutation', data, null, cacheMetadata);
  }

  /**
   *
   * @private
   * @param {Object} cacheMetadata
   * @return {Map}
   */
  _parseCacheMetadata(cacheMetadata) {
    Object.keys(cacheMetadata).forEach((key) => {
      const cacheability = new Cacheability();
      cacheability.setMetadata(cacheMetadata[key]);
      cacheMetadata[key] = cacheability;
    });

    return new Map(Object.entries(cacheMetadata));
  }

  /**
   *
   * @private
   * @param {string} query
   * @param {Object} opts
   * @param {Object} opts.fragments
   * @param {Object} opts.variables
   * @return {Promise}
   */
  async _updateQuery(query, opts) {
    const _this = this;
    const typeInfo = new TypeInfo(this._schema);
    let fragmentDefinitions;

    const ast = visit(parse(query), {
      enter(node) {
        typeInfo.enter(node);
        const kind = getKind(node);

        if (kind === 'Document') {
          if (!opts.fragments || !hasFragmentDefinitions(node)) return undefined;
          fragmentDefinitions = getFragmentDefinitions(node);
          deleteFragmentDefinitions(node);
          return undefined;
        }

        if (kind === 'Field' || kind === 'InlineFragment') {
          const isField = kind === 'Field';

          if (isField && opts.fragments && hasFragmentSpread(node)) {
            setFragments(fragmentDefinitions, node);
          }

          const name = isField ? getName(node) : getName(getTypeCondition(node));
          const isInlineFragment = kind === 'InlineFragment';
          if (isInlineFragment && name === typeInfo.getParentType().name) return undefined;
          const type = isField ? getType(typeInfo.getFieldDef()) : _this._schema.getType(name);
          if (!type.getFields) return undefined;
          const fields = type.getFields();

          if (fields[_this._resourceKey] && !hasChildField(node, _this._resourceKey)) {
            const mockAST = parse(`{ ${name} {${_this._resourceKey}} }`);
            const fieldAST = getChildField(getRootField(mockAST, name), _this._resourceKey);
            addChildField(node, fieldAST);
          }

          if (fields._metadata && !hasChildField(node, '_metadata')) {
            const mockAST = parse(`{ ${name} { _metadata { cacheControl } } }`);
            const fieldAST = getChildField(getRootField(mockAST, name), '_metadata');
            addChildField(node, fieldAST);
          }

          return undefined;
        }

        if (kind === 'OperationDefinition') {
          if (!opts.variables || !hasVariableDefinitions(node)) return undefined;
          deleteVariableDefinitions(node);
          return undefined;
        }

        if (kind === 'Variable') {
          const name = getName(node);
          const value = opts.variables[name];
          if (!value) return null;
          return parseValue(isString(value) ? `"${value}"` : `${value}`);
        }

        return undefined;
      },
      leave(node) {
        typeInfo.leave(node);
      },
    });

    return { ast, query: print(ast) };
  }

  /**
   *
   * @private
   * @param {string} query
   * @param {Document} ast
   * @param {Object} opts
   * @param {Object} context
   * @return {Promise}
   */
  async _query(query, ast, opts, context) {
    const hash = this._cache.hash(query);

    if (!opts.forceFetch) {
      const res = await this._checkResponseCache(hash);
      if (res) return this._resolve('query', res.data, null, res.cacheMetadata);
    }

    if (this._requests.active.has(hash)) {
      return new Promise((resolve) => {
        this._setPendingRequest(hash, resolve);
      });
    }

    this._requests.active.set(hash, query);

    const {
      cachedData,
      cacheMetadata,
      filtered,
      updatedAST,
      updatedQuery,
    } = await this._cache.analyze(hash, ast);

    if (cachedData) {
      this._cache.res.set(hash, { cacheMetadata: mapToObject(cacheMetadata), data: cachedData }, {
        cacheHeaders: { cacheControl: cacheMetadata.get('query').printCacheControl() },
      });

      return this._resolve('query', cachedData, null, cacheMetadata, hash);
    }

    const res = await this._fetch(updatedQuery, updatedAST, opts, context);
    const _cacheMetadata = this._createCacheMetadata(res.headers, res.cacheMetadata);
    if (res.errors) return this._resolve('query', null, res.errors, _cacheMetadata, hash);

    const resolved = await this._cache.resolve(
      updatedQuery, updatedAST, hash, res.data, _cacheMetadata, { filtered },
    );

    return this._resolve('query', resolved.data, null, resolved.cacheMetadata, hash);
  }

  /**
   *
   * @private
   * @param {string} operation
   * @param {Object} data
   * @param {Object} errors
   * @param {Object} cacheMetadata
   * @param {string} [hash]
   * @return {Object}
   */
  _resolve(operation, data = null, errors = null, cacheMetadata, hash) {
    if (!cacheMetadata.has('query')) {
      const cacheability = new Cacheability();
      cacheability.parseCacheControl(this._defaultCacheControls[operation]);
      cacheMetadata.set('query', cacheability);
    }

    const output = { cacheMetadata, data, errors };

    if (hash) {
      this._resolvePendingRequests(hash, output);
      this._requests.active.delete(hash);
    }

    if (errors) return Promise.reject(output);
    return output;
  }

  /**
   *
   * @private
   * @param {string} hash
   * @param {Object} data
   * @return {void}
   */
  _resolvePendingRequests(hash, data) {
    if (!this._requests.pending.has(hash)) return;

    this._requests.pending.get(hash).forEach(({ resolve }) => {
      resolve(data);
    });

    this._requests.pending.delete(hash);
  }

  /**
   *
   * @private
   * @param {string} query
   * @param {Document} ast
   * @param {Object} opts
   * @param {Object} context
   * @return {Promise}
   */
  _resolveRequestOperation(query, ast, opts, context) {
    const operation = getOperationName(ast);

    if (operation === 'query') {
      return this._query(query, ast, opts, context);
    } else if (operation === 'mutation') {
      return this._mutation(query, ast, opts, context);
    }

    return Promise.reject({ errors: 'The query was not a valid operation' });
  }

  /**
   *
   * @private
   * @param {string} hash
   * @param {Funciton} resolve
   * @return {void}
   */
  _setPendingRequest(hash, resolve) {
    let pending = this._requests.pending.get(hash);
    if (!pending) pending = [];
    pending.push({ resolve });
    this._requests.pending.set(hash, pending);
  }

  /**
   *
   * @return {void}
   */
  clearCache() {
    this._cache.res.clear();
    this._cache.obj.clear();
  }

  /**
   *
   * @param {string} query
   * @param {Object} [opts]
   * @param {Object} [context]
   * @return {Promise}
   */
  async request(query, opts = {}, context = {}) {
    if (!isString(query)) {
      return Promise.reject({ errors: 'The query is not a string.' });
    }

    try {
      let _query = query;
      if (opts.fragments) _query = this._concatFragments(_query, opts.fragments);
      const updated = await this._updateQuery(_query, opts);
      const errors = validate(this._schema, updated.ast);
      if (errors.length) return Promise.reject({ errors });
      const operations = getOperations(updated.ast);
      const multiQuery = operations.length > 1;

      if (!multiQuery) {
        return this._resolveRequestOperation(updated.query, updated.ast, opts, context);
      }

      return Promise.all(
        operations.map((value) => {
          const operationQuery = print(value);

          return this._resolveRequestOperation(
            operationQuery, parse(operationQuery), opts, context,
          );
        }),
      );
    } catch (err) {
      return Promise.reject({ errors: err });
    }
  }
}
