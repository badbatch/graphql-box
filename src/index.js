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
  deleteVariableDefinitions,
  getName,
  getOperationName,
  getVariableDefinitions,
  getVariableDefinitionType,
  hasVariableDefinitions,
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
     * Optional default cache control for grpahql queries.
     *
     * @type {string}
     */
    defaultCacheControl = 'public, max-age=300, s-maxage=300',
    /**
     * Optional override for client's execute method,
     * which calls graphql's execute method.
     *
     * @type {Function}
     */
    executor,
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
     * Graphql schema required for clients
     * running in internal mode.
     *
     * @type {Schema}
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
    this._cache = new Cache({ cachemapOptions, resourceKey, schema: _schema });
    this._defaultCacheControl = defaultCacheControl;
    if (isFunction(executor)) this._execute = executor;
    this._headers = { ...this._headers, ...headers };
    this._mode = mode;
    this._requests = { active: new Map(), pending: new Map() };
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
    let value;

    try {
      const cacheability = await this._cache.res.has(hash);

      if (cacheability && !cacheability.noCache && cacheability.check()) {
        value = await this._cache.res.get(hash);
      }
    } catch (err) {
      logger.error(err);
    }

    return value;
  }

  /**
   *
   * @private
   * @param {Document} ast
   * @param {Object} context
   * @return {Promise}
   */
  async _execute(ast, context) {
    return execute(this._schema, ast, null, context);
  }

  /**
   *
   * @private
   * @param {string} request
   * @param {Document} ast
   * @param {Object} context
   * @return {Promise}
   */
  async _fetch(request, ast, context) {
    let res;

    if (this._mode === 'internal') {
      logger.info(`Client executing: ${request}`);

      try {
        res = await this._execute(ast, context);
      } catch (err) {
        logger.error(err);
        res = { errors: err };
      }

      return res;
    }

    logger.info(`Client fetching: ${request}`);

    try {
      res = await fetch(this._url, {
        body: JSON.stringify({ query: request }),
        headers: new Headers(this._headers),
        method: 'POST',
      });
    } catch (err) {
      logger.error(err);
      res = { errors: err };
    }

    const { data, errors } = await res.json();
    return { data, errors, headers: res.headers };
  }

  /**
   *
   * @private
   * @param {string} mutation
   * @param {Document} ast
   * @param {Object} context
   * @return {Promise}
   */
  async _mutation(mutation, ast, context) {
    const { data, errors } = await this._fetch(mutation, ast, context);
    if (errors) return { errors };
    return { data };
  }

  /**
   *
   * @private
   * @param {string} query
   * @param {Object} variables
   * @return {Promise}
   */
  async _populateVariables(query, variables) {
    if (!Object.keys(variables).length) return query;
    let variableDefinitions;

    return print(visit(parse(query), {
      OperationDefinition(node) {
        if (!hasVariableDefinitions(node)) return false;
        variableDefinitions = getVariableDefinitions(node);
        deleteVariableDefinitions(node);
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
      const value = await this._checkResponseCache(hash);
      if (value) return value;
    }

    if (this._requests.active.has(hash)) {
      return new Promise((resolve) => {
        this._setPendingRequest(hash, resolve);
      });
    }

    this._requests.active.set(hash, query);

    const {
      cachedData,
      cacheHeaders,
      filtered,
      updatedAST,
      updatedQuery,
    } = await this._cache.analyze(hash, ast);

    if (cachedData) {
      this._cache.res.set(hash, cachedData, { cacheHeaders });
      return this._resolve(hash, cachedData);
    }

    const res = await this._fetch(updatedQuery, updatedAST, context);
    if (res.errors) return this._resolve(hash, { errors: res.errors });
    const headers = this._setCacheHeaders(res.headers);

    const resolvedData = await this._cache.resolve(
      updatedQuery, updatedAST, hash, res.data, headers, { filtered },
    );

    return this._resolve(hash, resolvedData);
  }

  /**
   *
   * @private
   * @param {string} hash
   * @param {Object} output
   * @return {Promise}
   */
  _resolve(hash, output) {
    this._resolvePendingRequests(hash, output);
    this._requests.active.delete(hash);
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
   * @param {Headers} headers
   * @return {Object}
   */
  _setCacheHeaders(headers) {
    if (!headers) return { cacheControl: this._defaultCacheControl };
    return { cacheControl: headers.get('cache-control') };
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
    if (opts.variables) _query = await this._populateVariables(_query, opts.variables);
    const ast = parse(_query);
    const errors = validate(this._schema, ast);
    if (errors.length) return { errors };
    const operation = getOperationName(ast);

    if (operation === 'query') {
      return this._query(_query, ast, opts, context);
    } else if (operation === 'mutation') {
      return this._mutation(_query, ast, context);
    }

    return { errors: 'The query was not a valid operation' };
  }
}
