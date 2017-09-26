import Cacheability from 'cacheability';

import {
  buildClientSchema,
  execute,
  parse,
  parseValue,
  print,
  validate,
  visit,
} from 'graphql';

import { isFunction, isString } from 'lodash';
import Cache from './cache';

import {
  deleteFragmentDefinitions,
  deleteVariableDefinitions,
  getFragmentDefinitions,
  getName,
  getOperationName,
  getVariableDefinitions,
  getVariableDefinitionType,
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
      logger.info(`Client executing: ${request}`);

      try {
        return this._execute(
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
    }

    logger.info(`Client fetching: ${request}`);

    try {
      res = await fetch(this._url, {
        body: JSON.stringify({ query: request }),
        headers: new Headers(this._headers),
        method: 'POST',
      });

      const { cacheMetadata, data, errors } = await res.json();
      return { cacheMetadata, data, errors, headers: res.headers };
    } catch (err) {
      logger.error(err);
      return { errors: err };
    }
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
    if (errors) this._resolve('mutation', { errors }, cacheMetadata);
    return this._resolve('mutation', data, cacheMetadata);
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
   * @param {Object} variables
   * @return {Promise}
   */
  async _populateVariablesAndFragments(query, variables) {
    let fragmentDefinitions, variableDefinitions;

    return print(visit(parse(query), {
      Document(node) {
        if (!hasFragmentDefinitions(node)) return undefined;
        fragmentDefinitions = getFragmentDefinitions(node);
        deleteFragmentDefinitions(node);
        return undefined;
      },
      OperationDefinition(node) {
        if (!hasVariableDefinitions(node)) return undefined;
        variableDefinitions = getVariableDefinitions(node);
        deleteVariableDefinitions(node);
        return undefined;
      },
      SelectionSet(node) {
        if (!hasFragmentSpread(node)) return undefined;
        setFragments(fragmentDefinitions, node);
        return undefined;
      },
      Variable(node) {
        const name = getName(node);
        const value = variables[name];
        if (!value) return false;
        const type = getVariableDefinitionType(variableDefinitions, name);
        if (!type) return false;
        return parseValue(type === 'String' || type === 'ID' ? `"${value}"` : `${value}`);
      },
    }));
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
      if (res) return this._resolve('query', res.data, res.cacheMetadata);
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

      return this._resolve('query', cachedData, cacheMetadata, hash);
    }

    const res = await this._fetch(updatedQuery, updatedAST, opts, context);
    const _cacheMetadata = this._createCacheMetadata(res.headers, res.cacheMetadata);
    if (res.errors) return this._resolve('query', { errors: res.errors }, _cacheMetadata, hash);

    const resolved = await this._cache.resolve(
      updatedQuery, updatedAST, hash, res.data, _cacheMetadata, { filtered },
    );

    return this._resolve('query', resolved.data, resolved.cacheMetadata, hash);
  }

  /**
   *
   * @private
   * @param {string} operation
   * @param {Object} data
   * @param {Object} cacheMetadata
   * @param {string} [hash]
   * @return {Object}
   */
  _resolve(operation, data, cacheMetadata, hash) {
    if (!cacheMetadata.has('query')) {
      const cacheability = new Cacheability();
      cacheability.parseCacheControl(this._defaultCacheControls[operation]);
      cacheMetadata.set('query', cacheability);
    }

    const output = { data, cacheMetadata };

    if (hash) {
      this._resolvePendingRequests(hash, output);
      this._requests.active.delete(hash);
    }

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
    if (!isString(query)) return { errors: 'The query is not a string.' };
    let _query = query;
    if (opts.fragments) _query = this._concatFragments(_query, opts.fragments);

    if (opts.variables || opts.fragments) {
      _query = await this._populateVariablesAndFragments(_query, opts.variables);
    }

    const ast = parse(_query);
    const errors = validate(this._schema, ast);
    if (errors.length) return { errors };
    const operation = getOperationName(ast);

    if (operation === 'query') {
      return this._query(_query, ast, opts, context);
    } else if (operation === 'mutation') {
      return this._mutation(_query, ast, opts, context);
    }

    return { errors: 'The query was not a valid operation' };
  }
}
