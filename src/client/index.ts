import Cacheability from "cacheability";
import { polyfill } from "es6-promise";

import {
  ASTNode,
  buildClientSchema,
  DocumentNode,
  execute,
  FieldNode,
  GraphQLFieldResolver,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLSchema,
  InlineFragmentNode,
  parse,
  parseValue,
  print,
  TypeInfo,
  validate,
  visit,
} from "graphql";

import "isomorphic-fetch";
import { isArray, isFunction, isObjectLike, isPlainObject, isString } from "lodash";

import {
  ClientArgs,
  ClientRequests,
  DefaultCacheControls,
  RequestOptions,
  RequestResults,
} from "./types";

import Cache from "../cache";

import {
  addChildFields,
  deleteFragmentDefinitions,
  getChildFields,
  getFragmentDefinitions,
  getKind,
  getName,
  getQuery,
  getType,
  hasChildFields,
  hasFragmentDefinitions,
  hasFragmentSpreads,
  setFragmentDefinitions,
} from "../helpers/parsing";

import { FragmentDefinitionNodeMap } from "../helpers/parsing/types";
import logger from "../logger";
import { ObjectMap } from "../types";

polyfill();
let instance: Client;

export default class Client {
  private static _concatFragments(query: string, fragments: string[]): string {
    if (!isArray(fragments) || fragments.some((value) => !isString(value))) {
      logger.info("handl:_concatFragments:The fragments were invalid", { fragments });
      return query;
    }

    return [query, ...fragments].join("\n\n");
  }

  private _cache: Cache;

  private _defaultCacheControls: DefaultCacheControls = {
    mutation: "max-age=0, s-maxage=0, no-cache, no-store",
    query: "public, max-age=60, s-maxage=60",
  };

  private _fieldResolver?: GraphQLFieldResolver<any, any>;
  private _headers: ObjectMap = { "content-type": "application/json" };
  private _mode: "internal" | "external";
  private _requests: ClientRequests = { active: new Map(), pending: new Map() };
  private _resourceKey: string = "id";
  private _rootValue: any;
  private _schema: GraphQLSchema;
  private _url?: string;

  constructor(args: ClientArgs) {
    if (!isPlainObject(args)) {
      const message = "handl:client:constructor:The args were not a plain object.";
      logger.error(message, { args });
      throw new Error(message);
    }

    const {
      cachemapOptions,
      defaultCacheControls,
      executor,
      fieldResolver,
      headers,
      introspection,
      mode,
      newInstance = false,
      resourceKey,
      rootValue,
      schema,
      url,
    } = args;

    if (instance && !newInstance) return instance;

    if (mode !== "internal" && mode !== "external") {
      const message = 'handl:client:constructor:The mode argument was not "internal" or "external".';
      logger.error(message, { mode });
      throw new Error(message);
    }

    if (mode === "internal") {
      if (schema instanceof GraphQLSchema) {
        this._schema = schema;
      } else {
        const message = 'handl:client:constructor:The schema was not an instance of "GraphQLSchema".';
        logger.error(message, { schema });
        throw new Error(message);
      }
    }

    if (mode === "external") {
      if (isPlainObject(introspection) && isString(url)) {
        this._schema = buildClientSchema(introspection);
      } else {
        const message = "handl:client:constructor:The introspection query and url was not strings.";
        logger.error(message, { introspection, url });
        throw new Error(message);
      }
    }

    this._cache = new Cache({
      cachemapOptions,
      defaultCacheControls,
      schema: this._schema,
    });

    if (isPlainObject(defaultCacheControls)) {
      this._defaultCacheControls = { ...this._defaultCacheControls, ...defaultCacheControls };
    }

    if (isFunction(executor)) this._execute = executor;
    if (isFunction(fieldResolver)) this._fieldResolver = fieldResolver;
    if (isPlainObject(headers)) this._headers = { ...this._headers, ...headers };
    this._mode = mode;
    if (isString(resourceKey)) this._resourceKey = resourceKey;
    this._rootValue = rootValue;
    if (isString(url)) this._url = url;
    instance = this;
    return instance;
  }

  /**
   *
   * @private
   * @param {string} hash
   * @return {Promise}
   */
  public async _checkResponseCache(hash) {
    const cacheability = await this._cache.res.has(hash);
    let res;
    if (this._cache.cacheValid(cacheability)) { res = await this._cache.res.get(hash); }
    if (!res) { return null; }
    return { cacheMetadata: this._parseCacheMetadata(res.cacheMetadata), data: res.data };
  }

  /**
   *
   * @private
   * @param {Headers} headers
   * @param {Object} cacheMetadata
   * @return {Map}
   */
  public _createCacheMetadata(headers, cacheMetadata) {
    if (cacheMetadata) { return this._parseCacheMetadata(cacheMetadata); }
    const cacheControl = headers && headers.get("cache-control");
    if (!cacheControl) { return new Map(); }
    const cacheability = new Cacheability();
    cacheability.parseCacheControl(cacheControl);
    const _cacheMetadata = new Map();
    _cacheMetadata.set("query", cacheability);
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
  public async _execute(schema, ast, rootValue, context, variableValues, operationName, fieldResolver) {
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
  public async _fetch(request, ast, opts, context) {
    let res;

    if (this._mode === "internal") {
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
        method: "POST",
      });
    } catch (err) {
      logger.error(err);
      return { errors: err };
    }

    const { cacheMetadata, data, errors } = await res.json();
    return {
      cacheMetadata, data, errors, headers: res.headers,
    };
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
  public async _mutation(mutation, ast, opts, context) {
    const { data, errors, headers } = await this._fetch(mutation, ast, opts, context);
    const cacheMetadata = this._createCacheMetadata(headers);
    if (errors) { this._resolve("mutation", null, errors, cacheMetadata); }
    return this._resolve("mutation", data, null, cacheMetadata);
  }

  /**
   *
   * @private
   * @param {Array<any>} values
   * @return {string}
   */
  public _parseArrayToInputString(values) {
    let inputString = "[";

    values.forEach((value, index, arr) => {
      if (!isPlainObject(value)) {
        inputString += isString(value) ? `"${value}"` : `${value}`;
      } else {
        inputString += this._parseToInputString(value);
      }

      if (index < arr.length - 1) { inputString += ","; }
    });

    inputString += "]";
    return inputString;
  }

  /**
   *
   * @private
   * @param {Object} cacheMetadata
   * @return {Map}
   */
  public _parseCacheMetadata(cacheMetadata) {
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
   * @param {Object} obj
   * @return {stirng}
   */
  public _parseObjectToInputString(obj) {
    let inputString = "{";

    Object.keys(obj).forEach((key, index, arr) => {
      inputString += `${key}:`;

      if (!isPlainObject(obj[key])) {
        inputString += isString(obj[key]) ? `"${obj[key]}"` : `${obj[key]}`;
      } else {
        inputString += this._parseToInputString(obj[key]);
      }

      if (index < arr.length - 1) { inputString += ","; }
    });

    inputString += "}";
    return inputString;
  }

  /**
   *
   * @private
   * @param {Array<any>|Object} value
   * @return {string}
   */
  public _parseToInputString(value) {
    if (isPlainObject(value)) { return this._parseObjectToInputString(value); }
    return this._parseArrayToInputString(value);
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
  public async _query(query, ast, opts, context) {
    const hash = this._cache.hash(query);

    if (!opts.forceFetch) {
      const res = await this._checkResponseCache(hash);
      if (res) { return this._resolve("query", res.data, null, res.cacheMetadata); }
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
        cacheHeaders: { cacheControl: cacheMetadata.get("query").printCacheControl() },
      });

      return this._resolve("query", cachedData, null, cacheMetadata, hash);
    }

    const res = await this._fetch(updatedQuery, updatedAST, opts, context);
    const _cacheMetadata = this._createCacheMetadata(res.headers, res.cacheMetadata);
    if (res.errors) { return this._resolve("query", null, res.errors, _cacheMetadata, hash); }

    const resolved = await this._cache.resolve(
      updatedQuery,
      updatedAST,
      hash,
      res.data,
      _cacheMetadata,
      { filtered },
    );

    return this._resolve("query", resolved.data, null, resolved.cacheMetadata, hash);
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
  public _resolve(operation, data = null, errors = null, cacheMetadata, hash) {
    if (!cacheMetadata.has("query")) {
      const cacheability = new Cacheability();
      cacheability.parseCacheControl(this._defaultCacheControls[operation]);
      cacheMetadata.set("query", cacheability);
    }

    const output = { cacheMetadata, data, errors };

    if (hash) {
      this._resolvePendingRequests(hash, output);
      this._requests.active.delete(hash);
    }

    if (errors) { return Promise.reject(output); }
    return output;
  }

  /**
   *
   * @private
   * @param {string} hash
   * @param {Object} data
   * @return {void}
   */
  public _resolvePendingRequests(hash, data) {
    if (!this._requests.pending.has(hash)) { return; }

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
  public _resolveRequestOperation(query, ast, opts, context) {
    const operation = getOperationName(ast);

    if (operation === "query") {
      return this._query(query, ast, opts, context);
    } else if (operation === "mutation") {
      return this._mutation(query, ast, opts, context);
    }

    return Promise.reject({ errors: "The query was not a valid operation" });
  }

  /**
   *
   * @private
   * @param {string} hash
   * @param {Funciton} resolve
   * @return {void}
   */
  public _setPendingRequest(hash, resolve) {
    let pending = this._requests.pending.get(hash);
    if (!pending) { pending = []; }
    pending.push({ resolve });
    this._requests.pending.set(hash, pending);
  }

  /**
   *
   * @return {void}
   */
  public clearCache() {
    this._cache.res.clear();
    this._cache.obj.clear();
  }

  public async request(query: string, opts?: RequestOptions, context?: ObjectMap): Promise<RequestResults | Error> {
    if (!isString(query)) {
      const message = "handl:client:request:The query is not a string";
      logger.error(message, { query });
      return Promise.reject(new Error(message));
    }

    try {
      const _opts = isPlainObject(opts) ? opts : {};
      const _query = _opts.fragments ? Client._concatFragments(query, _opts.fragments) : query;
      const updated = await this._updateQuery(_query, _opts);
      const errors = validate(this._schema, updated.ast);
      if (errors.length) { return Promise.reject({ errors }); }
      const operations = getOperations(updated.ast);
      const multiQuery = operations.length > 1;
      const _context = isPlainObject(context) ? context : {};

      if (!multiQuery) {
        return this._resolveRequestOperation(updated.query, updated.ast, opts, _context);
      }

      return Promise.all(operations.map((value) => {
        const operationQuery = print(value);

        return this._resolveRequestOperation(operationQuery, parse(operationQuery), opts, _context);
      }));
    } catch (err) {
      return Promise.reject({ errors: err });
    }
  }

  private async _updateQuery(query: string, opts: RequestOptions): Promise<{ ast: DocumentNode, query: string }> {
    const _this = this;
    const typeInfo = new TypeInfo(this._schema);
    let fragmentDefinitions: FragmentDefinitionNodeMap | void;

    const ast = visit(parse(query), {
      enter(node: ASTNode): any {
        typeInfo.enter(node);
        const kind = getKind(node);

        if (kind === "Document") {
          const documentNode = node as DocumentNode;
          if (!opts.fragments || !hasFragmentDefinitions(documentNode)) return;
          fragmentDefinitions = getFragmentDefinitions(documentNode);
          deleteFragmentDefinitions(documentNode);
          return;
        }

        if (kind === "Field" || kind === "InlineFragment") {
          let type: GraphQLOutputType | GraphQLNamedType;

          if (kind === "Field") {
            const fieldNode = node as FieldNode;

            if (fragmentDefinitions && hasFragmentSpreads(fieldNode)) {
              setFragmentDefinitions(fragmentDefinitions, fieldNode);
            }

            type = getType(typeInfo.getFieldDef());
          }

          if (kind  === "InlineFragment") {
            const inlineFragmentNode = node as InlineFragmentNode;
            if (!inlineFragmentNode.typeCondition) return;
            const name = getName(inlineFragmentNode.typeCondition);
            if (!name || name === typeInfo.getParentType().name) return;
            type = _this._schema.getType(name);
          }

          if (!type.hasOwnProperty("getFields")) return;
          const objectOrInterfaceType = type as GraphQLObjectType | GraphQLInterfaceType;
          const fields = objectOrInterfaceType.getFields();
          const fieldOrInlineFragmentNode = node as FieldNode | InlineFragmentNode;

          if (fields[_this._resourceKey] && !hasChildFields(fieldOrInlineFragmentNode, _this._resourceKey)) {
            const mockAST = parse(`{ ${name} {${_this._resourceKey}} }`);
            const queryNode = getQuery(mockAST);
            if (!queryNode) return;
            const field = getChildFields(queryNode, _this._resourceKey);
            if (!field) return;
            addChildFields(fieldOrInlineFragmentNode, field as FieldNode);
          }

          if (fields._metadata && !hasChildFields(fieldOrInlineFragmentNode, "_metadata")) {
            const mockAST = parse(`{ ${name} { _metadata { cacheControl } } }`);
            const queryNode = getQuery(mockAST);
            if (!queryNode) return;
            const field = getChildFields(queryNode, _this._resourceKey);
            if (!field) return;
            addChildFields(fieldOrInlineFragmentNode, field as FieldNode);
          }

          return;
        }

        if (kind === "OperationDefinition") {
          if (!opts.variables || !hasVariableDefinitions(node)) { return; }
          deleteVariableDefinitions(node);
          return;
        }

        if (kind === "Variable") {
          const name = getName(node);
          const value = opts.variables[name];
          if (!value) { return parseValue(`${null}`); }
          if (isObjectLike(value)) { return parseValue(_this._parseToInputString(value)); }
          return parseValue(isString(value) ? `"${value}"` : `${value}`);
        }

        return;
      },
      leave(node: ASTNode): any {
        typeInfo.leave(node);
      },
    });

    return { ast, query: print(ast) };
  }
}
