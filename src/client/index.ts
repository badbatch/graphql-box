import Cacheability from "cacheability";

import {
  ASTNode,
  buildClientSchema,
  DocumentNode,
  execute,
  ExecutionResult,
  FieldNode,
  GraphQLError,
  GraphQLFieldResolver,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLSchema,
  InlineFragmentNode,
  IntrospectionQuery,
  OperationDefinitionNode,
  parse,
  parseValue,
  print,
  TypeInfo,
  validate,
  ValueNode,
  VariableNode,
  visit,
} from "graphql";

import "isomorphic-fetch";

import {
  isArray,
  isFunction,
  isObjectLike,
  isPlainObject,
  isString,
  merge,
} from "lodash";

import {
  ClientRequests,
  CreateCacheMetadataArgs,
  FetchResult,
  PendingRequestActions,
  PendingRequestRejection,
  PendingRequestResolver,
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

import {
  CacheabilityObjectMap,
  CachemapArgsGroup,
  CacheMetadata,
  ClientArgs,
  ClientResult,
  DefaultCacheControls,
  ObjectMap,
  RequestOptions,
  RequestResult,
} from "../types";

let instance: Client;

export default class Client {
  public static async create(args: ClientArgs): Promise<Client> {
    const client = new Client(args);
    await client._createCache();
    return client;
  }

  private static _concatFragments(query: string, fragments: string[]): string {
    return [query, ...fragments].join("\n\n");
  }

  private static _createCacheMetadata(args?: CreateCacheMetadataArgs): CacheMetadata {
    const _args = args || {};
    if (_args.cacheMetadata) return Client._parseCacheabilityObjectMap(_args.cacheMetadata);
    const cacheControl = _args.headers && _args.headers.get("cache-control");
    if (!cacheControl) return new Map();
    const cacheability = new Cacheability();
    cacheability.parseCacheControl(cacheControl);
    const _cacheMetadata = new Map();
    _cacheMetadata.set("query", cacheability);
    return _cacheMetadata;
  }

  private static _parseCacheabilityObjectMap(cacheabilityObjectMap: CacheabilityObjectMap): CacheMetadata {
    const cacheMetadata: CacheMetadata = new Map();

    Object.keys(cacheabilityObjectMap).forEach((key) => {
      const cacheability = new Cacheability();
      cacheability.metadata = cacheabilityObjectMap[key];
      cacheMetadata.set(key, cacheability);
    });

    return cacheMetadata;
  }

  private _cache: Cache;

  private _cachemapOptions: CachemapArgsGroup = {
    dataObjects: {
      name: "handl-dataObjects",
      redisOptions: { db: 0 },
      use: { client: "indexedDB", server: "redis" },
    },
    responses: {
      name: "handl-responses",
      redisOptions: { db: 1 },
      use: { client: "indexedDB", server: "redis" },
    },
  };

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
      throw new TypeError("constructor expected args to be a plain object.");
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
      throw new TypeError("constructor expected mode to be 'internal' or 'external'.");
    }

    if (mode === "internal" && process.env.WEB_ENV) {
      throw new TypeError("constructor expected mode to be 'external' for browser client.");
    }

    if (cachemapOptions && isPlainObject(cachemapOptions)) {
      this._cachemapOptions = merge(this._cachemapOptions, cachemapOptions);
    }

    if (defaultCacheControls && isPlainObject(defaultCacheControls)) {
      this._defaultCacheControls = { ...this._defaultCacheControls, ...defaultCacheControls };
    }

    if (isFunction(fieldResolver)) this._fieldResolver = fieldResolver;
    if (headers && isPlainObject(headers)) this._headers = { ...this._headers, ...headers };
    this._mode = mode;
    if (isString(resourceKey)) this._resourceKey = resourceKey;
    this._rootValue = rootValue;

    if (mode === "internal") {
      if (schema instanceof GraphQLSchema) {
        this._schema = schema;
      } else {
        throw new TypeError("constructor expected schema to be an instance of GraphQLSchema.");
      }
    }

    if (mode === "external") {
      if (isPlainObject(introspection) && isString(url)) {
        const introspectionQuery = introspection as IntrospectionQuery;
        this._schema = buildClientSchema(introspectionQuery);
      } else {
        throw new TypeError("constructor expected introspection to be a plain object and url to be a string.");
      }
    }

    if (isString(url)) this._url = url;
    instance = this;
    return instance;
  }

  public async clearCache(): Promise<void> {
    await Promise.all([
      this._cache.responses.clear(),
      this._cache.dataObjects.clear(),
    ]);
  }

  public async request(query: string, opts: RequestOptions = {}): Promise<RequestResult | RequestResult[]> {
    let errors: Error[] = [];

    if (!isString(query)) {
      errors.push(new TypeError("Request expected query to be a string."));
    }

    if (!isPlainObject(opts)) {
      errors.push(new TypeError("Request expected opts to be a plain object."));
    }

    if (errors.length) return Promise.reject(errors);

    if (opts.fragments && (!isArray(opts.fragments) || opts.fragments.some((value) => !isString(value)))) {
      return Promise.reject(new TypeError("request expected opts.fragments to be an array of strings."));
    }

    try {
      const _query = opts.fragments ? Client._concatFragments(query, opts.fragments) : query;
      const updated = await this._updateQuery(_query, opts);
      errors = validate(this._schema, updated.ast) as GraphQLError[];
      if (errors.length) return Promise.reject(errors);
      const operations = getOperationDefinitions(updated.ast);
      const multiQuery = operations.length > 1;

      if (!multiQuery) {
        return this._resolveRequestOperation(updated.query, updated.ast, opts);
      }

      return Promise.all(operations.map((operation) => {
        const operationQuery = print(operation);
        return this._resolveRequestOperation(operationQuery, parse(operationQuery), opts);
      }));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _checkResponseCache(hash: string): Promise<ClientResult | undefined> {
    const cacheability: Cacheability | false = await this._cache.responses.has(hash);
    if (!cacheability || !Cache.isValid(cacheability)) return;
    const res = await this._cache.responses.get(hash);
    return { cacheMetadata: Client._parseCacheabilityObjectMap(res.cacheMetadata), data: res.data };
  }

  private async _createCache(): Promise<void> {
    this._cache = await Cache.create({
      cachemapOptions: this._cachemapOptions,
      defaultCacheControls: this._defaultCacheControls,
    });
  }

  private async _fetch(
    request: string,
    ast: DocumentNode,
    opts: RequestOptions,
  ): Promise<FetchResult | Error | Error[]> {
    if (this._mode === "internal") {
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
        return Promise.reject(error);
      }

      if (executeResult.errors) return Promise.reject(executeResult.errors);
      const data = executeResult.data as ObjectMap;
      return { data };
    }

    const url = `${this._url}?requestId=${Cache.hash(request)}`;
    const headers = opts.headers ? { ...this._headers, ...opts.headers } : this._headers;
    let fetchResult: Response;

    try {
      fetchResult = await fetch(url, {
        body: JSON.stringify({ query: request }),
        headers: new Headers(headers),
        method: "POST",
      });
    } catch (error) {
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

  private _getFieldOrInlineFragmentType(
    kind: "Field" | "InlineFragment",
    node: FieldNode | InlineFragmentNode,
    typeInfo: TypeInfo,
  ): GraphQLOutputType | GraphQLNamedType | undefined {
    if (kind === "Field") {
      return getType(typeInfo.getFieldDef());
    }

    if (kind  === "InlineFragment") {
      const inlineFragmentNode = node as InlineFragmentNode;
      if (!inlineFragmentNode.typeCondition) return undefined;
      const name = getName(inlineFragmentNode.typeCondition) as string;
      if (name === typeInfo.getParentType().name) return undefined;
      return this._schema.getType(name);
    }

    return undefined;
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

    if (cachedData && cacheMetadata) {
      const queryCacheability = cacheMetadata.get("query");

      const cacheControl = queryCacheability && queryCacheability.printCacheControl()
        || this._defaultCacheControls.query;

      this._cache.responses.set(
        hash,
        { cacheMetadata: mapToObject(cacheMetadata), data: cachedData },
        { cacheHeaders: { cacheControl },
      });

      return this._resolve({
        cacheMetadata,
        data: cachedData,
        hash,
        operation: "query",
      });
    }

    let fetchResult: FetchResult;
    const _updateQuery = updatedQuery as string;
    const _updateAST = updatedAST as DocumentNode;
    const _filterd = filtered as boolean;

    try {
      fetchResult = await this._fetch(_updateQuery, _updateAST, opts) as FetchResult;
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
      _updateQuery,
      _updateAST,
      hash,
      fetchResult.data,
      _cacheMetadata,
      { filtered: _filterd },
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
    const _data = data as ObjectMap;
    return { cacheMetadata, data: _data };
  }

  private _resolvePendingRequests(
    hash: string,
    cacheMetadata: CacheMetadata,
    data?: ObjectMap,
    error?: Error | Error[],
  ): void {
    const pendingRequests = this._requests.pending.get(hash);
    if (!pendingRequests) return;

    pendingRequests.forEach(({ reject, resolve }) => {
      if (error) {
        reject(error);
      } else {
        const _data = data as ObjectMap;
        resolve({ cacheMetadata, data: _data });
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

    return Promise.reject(new Error("request expected the operation to be 'query' or 'mutation'."));
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
    let fragmentDefinitions: FragmentDefinitionNodeMap | undefined;

    const ast = visit(parse(query), {
      enter(node: ASTNode): ValueNode | undefined {
        typeInfo.enter(node);
        const kind = getKind(node);

        if (kind === "Document") {
          const documentNode = node as DocumentNode;
          if (!opts.fragments || !hasFragmentDefinitions(documentNode)) return undefined;
          fragmentDefinitions = getFragmentDefinitions(documentNode);
          deleteFragmentDefinitions(documentNode);
          return undefined;
        }

        if (kind === "Field" || kind === "InlineFragment") {
          const fieldOrInlineFragmentNode = node as FieldNode | InlineFragmentNode;
          const type = _this._getFieldOrInlineFragmentType(kind, fieldOrInlineFragmentNode, typeInfo);
          if (!type) return undefined;

          if (kind === "Field") {
            const fieldNode = node as FieldNode;

            if (fragmentDefinitions && hasFragmentSpreads(fieldNode)) {
              setFragmentDefinitions(fragmentDefinitions, fieldNode);
            }
          }

          if (!type.hasOwnProperty("getFields")) return undefined;
          const objectOrInterfaceType = type as GraphQLObjectType | GraphQLInterfaceType;
          const fields = objectOrInterfaceType.getFields();

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

          return undefined;
        }

        if (kind === "OperationDefinition") {
          const operationDefinitionNode = node as OperationDefinitionNode;
          if (!opts.variables || !hasVariableDefinitions(operationDefinitionNode)) return undefined;
          deleteVariableDefinitions(operationDefinitionNode);
          return undefined;
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

        return undefined;
      },
      leave(node: ASTNode): any {
        typeInfo.leave(node);
      },
    });

    return { ast, query: print(ast) };
  }
}
