import Cacheability from "cacheability";
import { polyfill } from "es6-promise";

import {
  ASTNode,
  buildClientSchema,
  DocumentNode,
  execute,
  ExecutionResult,
  FieldNode,
  GraphQLFieldResolver,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLSchema,
  InlineFragmentNode,
  OperationDefinitionNode,
  parse,
  parseValue,
  print,
  TypeInfo,
  validate,
  VariableNode,
  visit,
} from "graphql";

import "isomorphic-fetch";
import { isArray, isFunction, isObjectLike, isPlainObject, isString } from "lodash";

import {
  ClientArgs,
  ClientRequests,
  ClientResult,
  CreateCacheMetadataArgs,
  DefaultCacheControls,
  FetchResult,
  PendingRequestActions,
  PendingRequestRejection,
  PendingRequestResolver,
  RequestOptions,
  RequestResult,
  ResolveArgs,
} from "./types";

import Cache from "../cache";

import {
  addChildFields,
  deleteFragmentDefinitions,
  deleteVariableDefinitions,
  getChildFields,
  getFragmentDefinitions,
  getKind,
  getName,
  getOperationDefinitions,
  getType,
  hasChildFields,
  hasFragmentDefinitions,
  hasFragmentSpreads,
  hasVariableDefinitions,
  setFragmentDefinitions,
} from "../helpers/parsing";

import mapToObject from "../helpers/map-to-object";
import { FragmentDefinitionNodeMap } from "../helpers/parsing/types";
import logger from "../logger";
import { CacheMetadata, ObjectMap } from "../types";

polyfill();
let instance: Client;

export default class Client {
  private static _concatFragments(query: string, fragments: string[]): string {
    if (!isArray(fragments) || fragments.some((value) => !isString(value))) {
      logger.info("handl:client:_concatFragments:The fragments were invalid", { fragments });
      return query;
    }

    return [query, ...fragments].join("\n\n");
  }

  private static _createCacheMetadata(args?: CreateCacheMetadataArgs): Map<any, any> {
    const _args = args || {};
    if (_args.cacheMetadata) return Client._parseCacheMetadata(_args.cacheMetadata);
    const cacheControl = _args.headers && _args.headers.get("cache-control");
    if (!cacheControl) return new Map();
    const cacheability = new Cacheability();
    cacheability.parseCacheControl(cacheControl);
    const _cacheMetadata = new Map();
    _cacheMetadata.set("query", cacheability);
    return _cacheMetadata;
  }

  private static _parseCacheMetadata(cacheMetadata: ObjectMap): CacheMetadata {
    Object.keys(cacheMetadata).forEach((key) => {
      const cacheability = new Cacheability();
      cacheability.setMetadata(cacheMetadata[key]);
      cacheMetadata[key] = cacheability;
    });

    return new Map(Object.entries(cacheMetadata));
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

    this._cache = new Cache({
      cachemapOptions,
      defaultCacheControls,
    });

    if (isPlainObject(defaultCacheControls)) {
      this._defaultCacheControls = { ...this._defaultCacheControls, ...defaultCacheControls };
    }

    if (isFunction(fieldResolver)) this._fieldResolver = fieldResolver;
    if (isPlainObject(headers)) this._headers = { ...this._headers, ...headers };
    this._mode = mode;
    if (isString(resourceKey)) this._resourceKey = resourceKey;
    this._rootValue = rootValue;

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

    if (isString(url)) this._url = url;
    instance = this;
    return instance;
  }

  public clearCache(): void {
    this._cache.responses.clear();
    this._cache.dataObjects.clear();
  }

  public async request(query: string, opts?: RequestOptions): Promise<RequestResult | RequestResult[]> {
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
      if (errors.length) return Promise.reject(errors);
      const operations = getOperationDefinitions(updated.ast);
      const multiQuery = operations.length > 1;

      if (!multiQuery) {
        return this._resolveRequestOperation(updated.query, updated.ast, _opts);
      }

      return Promise.all(operations.map((operation) => {
        const operationQuery = print(operation);
        return this._resolveRequestOperation(operationQuery, parse(operationQuery), _opts);
      }));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _checkResponseCache(hash: string): Promise<ClientResult | void> {
    const cacheability = await this._cache.responses.has(hash);
    const res = Cache.isValid(cacheability) ? await this._cache.responses.get(hash) : null;
    if (!res) return;
    return { cacheMetadata: Client._parseCacheMetadata(res.cacheMetadata), data: res.data };
  }

  private async _fetch(
    request: string,
    ast: DocumentNode,
    opts: RequestOptions,
  ): Promise<FetchResult | Error | Error[]> {
    if (this._mode === "internal") {
      logger.info("handl:client:_fetch:Executing internal request", { request });
      let executeResult: ExecutionResult;

      try {
        executeResult = await execute({
          schema: this._schema,
          document: ast,
          rootValue: opts.rootValue || this._rootValue,
          contextValue: opts.context,
          operationName: opts.operationName,
          fieldResolver: opts.fieldResolver || this._fieldResolver,
        });
      } catch (error) {
        const message = "handl:client:_fetch:The graphql execution failed.";
        logger.error(message, { error });
        return Promise.reject(error);
      }

      if (executeResult.errors) return Promise.reject(executeResult.errors);
      return { data: executeResult.data };
    }

    const url = `${this._url}?requestId=${Cache.hash(request)}`;
    logger.info("handl:client:_fetch:Executing external request", { request, url });
    const headers = opts.headers ? { ...this._headers, ...opts.headers } : this._headers;
    let fetchResult: Response;

    try {
      fetchResult = await fetch(url, {
        body: JSON.stringify({ query: request }),
        headers: new Headers(headers),
        method: "POST",
      });
    } catch (error) {
      const message = "handl:client:_fetch:The fetch http request failed.";
      logger.error(message, { error });
      return Promise.reject(error);
    }

    const jsonResult = await fetchResult.json();

    if (isArray(jsonResult.errors) && jsonResult.errors[0] instanceof Error) {
      return Promise.reject(jsonResult.errors);
    }

    return {
      cacheMetadata: jsonResult.cacheMetadata,
      data: jsonResult.data,
      headers: fetchResult.headers,
    };
  }

  private async _mutation(
    mutation: string,
    ast: DocumentNode,
    opts: RequestOptions,
  ): Promise<ClientResult | Error | Error[]> {
    let fetchResult: FetchResult;

    try {
      fetchResult = await this._fetch(mutation, ast, opts) as FetchResult;
    } catch (error) {
      return this._resolve({
        cacheMetadata: Client._createCacheMetadata(),
        error,
        operation: "mutation",
      });
    }

    return this._resolve({
      cacheMetadata: Client._createCacheMetadata({
        cacheMetadata: fetchResult.cacheMetadata,
        headers: fetchResult.headers,
      }),
      data: fetchResult.data,
      operation: "mutation",
    });
  }

  private _parseArrayToInputString(values: any[]): string {
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

  private _parseObjectToInputString(obj: ObjectMap): string {
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

  private _parseToInputString(value: ObjectMap | any[]): string {
    if (isPlainObject(value)) return this._parseObjectToInputString(value as ObjectMap);
    return this._parseArrayToInputString(value as any[]);
  }

  private async _query(
    query: string,
    ast: DocumentNode,
    opts: RequestOptions,
  ): Promise<ClientResult | Error | Error[]> {
    const hash = Cache.hash(query);

    if (!opts.forceFetch) {
      const cachedResponse = await this._checkResponseCache(hash);

      if (cachedResponse) {
        return this._resolve({
          cacheMetadata: cachedResponse.cacheMetadata,
          data: cachedResponse.data,
          operation: "query",
        });
      }
    }

    if (this._requests.active.has(hash)) {
      return new Promise((resolve: PendingRequestResolver, reject: PendingRequestRejection) => {
        this._setPendingRequest(hash, { reject, resolve });
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
      this._cache.responses.set(hash, { cacheMetadata: mapToObject(cacheMetadata), data: cachedData }, {
        cacheHeaders: { cacheControl: cacheMetadata.get("query").printCacheControl() },
      });

      return this._resolve({
        cacheMetadata,
        data: cachedData,
        hash,
        operation: "query",
      });
    }

    let fetchResult: FetchResult;

    try {
      fetchResult = await this._fetch(updatedQuery, updatedAST, opts) as FetchResult;
    } catch (error) {
      return this._resolve({
        cacheMetadata: Client._createCacheMetadata(),
        error,
        operation: "query",
      });
    }

    const _cacheMetadata = Client._createCacheMetadata({
      cacheMetadata: fetchResult.cacheMetadata,
      headers: fetchResult.headers,
    });

    const resolveResult = await this._cache.resolve(
      updatedQuery,
      updatedAST,
      hash,
      fetchResult.data,
      _cacheMetadata,
      { filtered },
    );

    return this._resolve({
      cacheMetadata: resolveResult.cacheMetadata,
      data: resolveResult.data,
      hash,
      operation: "query",
    });
  }

  private async _resolve(args: ResolveArgs): Promise<ClientResult | Error | Error[]> {
    const { cacheMetadata, data, hash, error, operation } = args;
    if (!cacheMetadata.has("query")) {
      const cacheability = new Cacheability();
      cacheability.parseCacheControl(this._defaultCacheControls[operation]);
      cacheMetadata.set("query", cacheability);
    }

    if (hash) {
      this._resolvePendingRequests(hash, cacheMetadata, data, error);
      this._requests.active.delete(hash);
    }

    if (error) return Promise.reject(error);
    return { cacheMetadata, data };
  }

  private _resolvePendingRequests(
    hash: string,
    cacheMetadata: CacheMetadata,
    data?: ObjectMap,
    error?: Error | Error[],
  ): void {
    if (!this._requests.pending.has(hash)) return;

    this._requests.pending.get(hash).forEach(({ reject, resolve }) => {
      if (error) {
        reject(error);
      } else {
        resolve({ cacheMetadata, data });
      }
    });

    this._requests.pending.delete(hash);
  }

  private _resolveRequestOperation(
    query: string,
    ast: DocumentNode,
    opts: RequestOptions,
  ): Promise<ClientResult | Error | Error[]> {
    const operationDefinition = getOperationDefinitions(ast)[0];

    if (operationDefinition.operation === "query") {
      return this._query(query, ast, opts);
    } else if (operationDefinition.operation === "mutation") {
      return this._mutation(query, ast, opts);
    }

    const message = "handl:client:_resolveRequestOperation:The query was not a supported operation";
    logger.error(message, { query });
    return Promise.reject(new Error(message));
  }

  private _setPendingRequest(hash: string, { reject, resolve }: PendingRequestActions): void {
    let pending = this._requests.pending.get(hash);
    if (!pending) pending = [];
    pending.push({ reject, resolve });
    this._requests.pending.set(hash, pending);
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
            const name = getName(inlineFragmentNode.typeCondition) as string;
            if (name === typeInfo.getParentType().name) return;
            type = _this._schema.getType(name);
          }

          if (!type.hasOwnProperty("getFields")) return;
          const objectOrInterfaceType = type as GraphQLObjectType | GraphQLInterfaceType;
          const fields = objectOrInterfaceType.getFields();
          const fieldOrInlineFragmentNode = node as FieldNode | InlineFragmentNode;

          if (fields[_this._resourceKey] && !hasChildFields(fieldOrInlineFragmentNode, _this._resourceKey)) {
            const mockAST = parse(`{ ${name} {${_this._resourceKey}} }`);
            const queryNode = getOperationDefinitions(mockAST, "query")[0];
            const field = getChildFields(queryNode, _this._resourceKey) as FieldNode;
            addChildFields(fieldOrInlineFragmentNode, field);
          }

          if (fields._metadata && !hasChildFields(fieldOrInlineFragmentNode, "_metadata")) {
            const mockAST = parse(`{ ${name} { _metadata { cacheControl } } }`);
            const queryNode = getOperationDefinitions(mockAST, "query")[0];
            const field = getChildFields(queryNode, "_metadata") as FieldNode;
            addChildFields(fieldOrInlineFragmentNode, field);
          }

          return;
        }

        if (kind === "OperationDefinition") {
          const operationDefinitionNode = node as OperationDefinitionNode;
          if (!opts.variables || !hasVariableDefinitions(operationDefinitionNode)) return;
          deleteVariableDefinitions(operationDefinitionNode);
          return;
        }

        if (kind === "Variable") {
          if (!opts.variables) return parseValue(`${null}`);
          const variableNode = node as VariableNode;
          const name = getName(variableNode) as string;
          const value = opts.variables[name];
          if (!value) return parseValue(`${null}`);
          if (isObjectLike(value)) return parseValue(_this._parseToInputString(value));
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
