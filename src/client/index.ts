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
  FetchResult,
  MapFieldToTypeArgs,
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
  getAlias,
  getArguments,
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

import createCacheMetadata from "../helpers/create-cache-metadata";
import mapToObject from "../helpers/map-to-object";
import parseCacheabilityObjectMap from "../helpers/parse-cacheability-object-map";
import { FragmentDefinitionNodeMap } from "../helpers/parsing/types";

import {
  CachemapArgsGroup,
  CacheMetadata,
  ClientArgs,
  DefaultCacheControls,
  ObjectMap,
  RequestContext,
  RequestOptions,
  RequestResult,
  ResolveResult,
  ResponseCacheEntryResult,
} from "../types";

const deferredPromise = require("defer-promise");

let instance: Client;

export default class Client {
  public static async create(args: ClientArgs): Promise<Client> {
    const client = new Client(args);
    await client._createCache();
    return client;
  }

  private static _addFieldTypeMap(context: RequestContext): void {
    context.fieldTypeMaps.push(new Map());
  }

  private static _concatFragments(query: string, fragments: string[]): string {
    return [query, ...fragments].join("\n\n");
  }

  private static _mapFieldToType(args: MapFieldToTypeArgs): void {
    const { ancestors, context, fieldNode, resourceKey, typeName } = args;
    const ancestorFieldPath: string[] = [];

    ancestors.forEach((ancestor) => {
      if (isPlainObject(ancestor) && getKind(ancestor as ASTNode) === "Field") {
        const ancestorFieldNode = ancestor as FieldNode;
        ancestorFieldPath.push(getAlias(ancestorFieldNode) || getName(ancestorFieldNode) as string);
      }
    });

    const fieldName = getAlias(fieldNode) || getName(fieldNode) as string;
    ancestorFieldPath.push(fieldName);
    const fieldPath = ancestorFieldPath.join(".");

    const argumentsObjectMap = getArguments(fieldNode);
    let resourceValue: string | undefined;

    if (argumentsObjectMap && argumentsObjectMap[resourceKey]) {
      resourceValue = argumentsObjectMap[resourceKey];
    }

    const { fieldTypeMaps } = context;
    const fieldTypeMap = fieldTypeMaps[fieldTypeMaps.length - 1];
    fieldTypeMap.set(fieldPath, { resourceKey, resourceValue, typeName });
  }

  private _cache: Cache;

  private _cachemapOptions: CachemapArgsGroup = {
    dataEntities: {
      indexedDBOptions: {
        databaseName: "handl-dataEntities-store",
        objectStoreName: "dataEntities",
      },
      name: "handl-dataEntities",
      redisOptions: { db: 0 },
      use: { client: "indexedDB", server: "redis" },
    },
    dataPaths: {
      indexedDBOptions: {
        databaseName: "handl-dataPaths-store",
        objectStoreName: "dataPaths",
      },
      name: "handl-dataPaths",
      redisOptions: { db: 1 },
      use: { client: "indexedDB", server: "redis" },
    },
    responses: {
      indexedDBOptions: {
        databaseName: "handl-responses-store",
        objectStoreName: "responses",
      },
      name: "handl-responses",
      redisOptions: { db: 2 },
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
      this._cache.dataPaths.clear(),
      this._cache.dataEntities.clear(),
      this._cache.responses.clear(),
    ]);
  }

  public async getDataEntityCacheEntry(key: string): Promise<ObjectMap | undefined> {
    return this._cache.dataEntities.get(key);
  }

  public async getDataEntityCacheSize(): Promise<number> {
    return this._cache.dataEntities.size();
  }

  public async getDataPathCacheEntry(key: string): Promise<any> {
    return this._cache.dataPaths.get(key);
  }

  public async getDataPathCacheSize(): Promise<number> {
    return this._cache.dataPaths.size();
  }

  public async getResponseCacheEntry(key: string): Promise<ResponseCacheEntryResult | undefined> {
    const entry = await this._cache.responses.get(key);
    if (!entry) return undefined;
    const { cacheMetadata, data } = entry;
    return { cacheMetadata: createCacheMetadata({ cacheMetadata }), data };
  }

  public async getResponseCacheSize(): Promise<number> {
    return this._cache.responses.size();
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
      const context: RequestContext = { fieldTypeMaps: [] };
      const updated = await this._updateQuery(_query, opts, context);
      errors = validate(this._schema, updated.ast) as GraphQLError[];
      if (errors.length) return Promise.reject(errors);
      const operations = getOperationDefinitions(updated.ast);
      const multiQuery = operations.length > 1;

      if (!multiQuery) {
        const result = await this._resolveRequestOperation(updated.query, updated.ast, opts, context);

        if (opts.awaitDataCached && result.cachePromise) {
          await result.cachePromise;
          delete result.cachePromise;
        }

        return result;
      }

      return Promise.all(operations.map(async (operation, index) => {
        const operationQuery = print(operation);
        const _context: RequestContext = { fieldTypeMaps: [context.fieldTypeMaps[index]] };
        const result = await this._resolveRequestOperation(operationQuery, parse(operationQuery), opts, _context);

        if (opts.awaitDataCached && result.cachePromise) {
          await result.cachePromise;
          delete result.cachePromise;
        }

        return result;
      }));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _checkResponseCache(queryHash: string): Promise<ResolveResult | undefined> {
    const cacheability = await this._cache.responses.has(queryHash);
    if (!cacheability || !Cache.isValid(cacheability)) return;
    const res = await this._cache.responses.get(queryHash);
    return { cacheMetadata: parseCacheabilityObjectMap(res.cacheMetadata), data: res.data };
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
  ): Promise<FetchResult> {
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
  ): Promise<ResolveResult> {
    let fetchResult: FetchResult;

    try {
      fetchResult = await this._fetch(mutation, ast, opts);
    } catch (error) {
      return this._resolve({
        cacheMetadata: createCacheMetadata(),
        error,
        operation: "mutation",
      });
    }

    return this._resolve({
      cacheMetadata: createCacheMetadata({
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
    context: RequestContext,
  ): Promise<ResolveResult> {
    const queryHash = Cache.hash(query);

    if (!opts.forceFetch) {
      const cachedResponse = await this._checkResponseCache(queryHash);

      if (cachedResponse) {
        return this._resolve({
          cacheMetadata: cachedResponse.cacheMetadata,
          data: cachedResponse.data,
          operation: "query",
          queryHash,
          resolvePending: false,
        });
      }
    }

    if (this._requests.active.has(queryHash)) {
      return new Promise((resolve: PendingRequestResolver, reject: PendingRequestRejection) => {
        this._setPendingRequest(queryHash, { reject, resolve });
      });
    }

    this._requests.active.set(queryHash, query);

    const {
      cachedData,
      cacheMetadata,
      filtered,
      updatedAST,
      updatedQuery,
    } = await this._cache.analyze(queryHash, ast, context.fieldTypeMaps[0]);

    const deferred: DeferPromise.Deferred<void> = deferredPromise();

    if (cachedData && cacheMetadata) {
      const defaultCacheControl = this._defaultCacheControls.query;
      const queryCacheability = cacheMetadata.get("query");
      const cacheControl = queryCacheability && queryCacheability.printCacheControl() || defaultCacheControl;

      (async () => {
        await this._cache.responses.set(
          queryHash,
          { cacheMetadata: mapToObject(cacheMetadata), data: cachedData },
          { cacheHeaders: { cacheControl },
        });

        deferred.resolve();
      })();

      return this._resolve({
        cacheMetadata,
        cachePromise: deferred.promise,
        data: cachedData,
        operation: "query",
        queryHash,
      });
    }

    let fetchResult: FetchResult;
    const _updateQuery = updatedQuery as string;
    const _updateAST = updatedAST as DocumentNode;
    const _filterd = filtered as boolean;

    try {
      fetchResult = await this._fetch(_updateQuery, _updateAST, opts);
    } catch (error) {
      return this._resolve({
        cacheMetadata: createCacheMetadata(),
        error,
        operation: "query",
        queryHash,
      });
    }

    const _cacheMetadata = createCacheMetadata({
      cacheMetadata: fetchResult.cacheMetadata,
      headers: fetchResult.headers,
    });

    const resolveResult = await this._cache.resolve(
      _updateQuery,
      _updateAST,
      queryHash,
      fetchResult.data,
      _cacheMetadata,
      { cacheResolve: deferred.resolve, filtered: _filterd },
    );

    return this._resolve({
      cacheMetadata: resolveResult.cacheMetadata,
      cachePromise: deferred.promise,
      data: resolveResult.data,
      operation: "query",
      queryHash,
    });
  }

  private async _resolve(args: ResolveArgs): Promise<ResolveResult> {
    const { cacheMetadata, cachePromise, data, error, operation, queryHash, resolvePending = true } = args;

    if (!cacheMetadata.has("query")) {
      const cacheability = new Cacheability();
      cacheability.parseCacheControl(this._defaultCacheControls[operation]);
      cacheMetadata.set("query", cacheability);
    }

    if (resolvePending && queryHash) {
      this._resolvePendingRequests(queryHash, cacheMetadata, data, error);
      this._requests.active.delete(queryHash);
    }

    if (error) return Promise.reject(error);

    const output: ResolveResult = {
      cacheMetadata,
      data: data as ObjectMap,
    };

    if (cachePromise) output.cachePromise = cachePromise;
    if (queryHash) output.queryHash = queryHash as string;
    return output;
  }

  private _resolvePendingRequests(
    queryHash: string,
    cacheMetadata: CacheMetadata,
    data?: ObjectMap,
    error?: Error | Error[],
  ): void {
    const pendingRequests = this._requests.pending.get(queryHash);
    if (!pendingRequests) return;

    pendingRequests.forEach(({ reject, resolve }) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          cacheMetadata,
          data: data as ObjectMap,
          queryHash,
        });
      }
    });

    this._requests.pending.delete(queryHash);
  }

  private _resolveRequestOperation(
    query: string,
    ast: DocumentNode,
    opts: RequestOptions,
    context: RequestContext,
  ): Promise<ResolveResult> {
    const operationDefinition = getOperationDefinitions(ast)[0];

    if (operationDefinition.operation === "query") {
      return this._query(query, ast, opts, context);
    } else if (operationDefinition.operation === "mutation") {
      return this._mutation(query, ast, opts);
    }

    return Promise.reject(new Error("request expected the operation to be 'query' or 'mutation'."));
  }

  private _setPendingRequest(queryHash: string, { reject, resolve }: PendingRequestActions): void {
    let pending = this._requests.pending.get(queryHash);
    if (!pending) pending = [];
    pending.push({ reject, resolve });
    this._requests.pending.set(queryHash, pending);
  }

  private async _updateQuery(
    query: string,
    opts: RequestOptions,
    context: RequestContext,
  ): Promise<{ ast: DocumentNode, query: string }> {
    const _this = this;
    const typeInfo = new TypeInfo(this._schema);
    let fragmentDefinitions: FragmentDefinitionNodeMap | undefined;

    const ast = visit(parse(query), {
      enter(
        node: ASTNode,
        key: string | number,
        parent: any,
        path: Array<string | number>,
        ancestors: any[],
      ): ValueNode | undefined {
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

          if (!(type instanceof GraphQLObjectType) && !(type instanceof GraphQLInterfaceType)) return undefined;
          const objectOrInterfaceType = type as GraphQLObjectType | GraphQLInterfaceType;
          const fields = objectOrInterfaceType.getFields();

          if (fields[_this._resourceKey]) {
            if (!hasChildFields(fieldOrInlineFragmentNode, _this._resourceKey)) {
              const mockAST = parse(`{${_this._resourceKey}}`);
              const queryNode = getOperationDefinitions(mockAST, "query")[0];
              const field = getChildFields(queryNode, _this._resourceKey) as FieldNode;
              addChildFields(fieldOrInlineFragmentNode, field);
            }

            if (kind === "Field") {
              const fieldNode = node as FieldNode;

              Client._mapFieldToType({
                ancestors,
                context,
                fieldNode,
                resourceKey: _this._resourceKey,
                typeName: objectOrInterfaceType.name,
              });
            }
          }

          if (fields._metadata && !hasChildFields(fieldOrInlineFragmentNode, "_metadata")) {
            const mockAST = parse(`{ _metadata { cacheControl } }`);
            const queryNode = getOperationDefinitions(mockAST, "query")[0];
            const field = getChildFields(queryNode, "_metadata") as FieldNode;
            addChildFields(fieldOrInlineFragmentNode, field);
          }

          return undefined;
        }

        if (kind === "OperationDefinition") {
          Client._addFieldTypeMap(context);
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
