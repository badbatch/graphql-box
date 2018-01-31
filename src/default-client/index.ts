import { Cacheability } from "cacheability";

import {
  ASTNode,
  buildClientSchema,
  DocumentNode,
  FieldNode,
  GraphQLError,
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
import { isAsyncIterable } from "iterall";

import {
  isArray,
  isObjectLike,
  isPlainObject,
  isString,
  merge,
} from "lodash";

import {
  FetchResult,
  MapFieldToTypeArgs,
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
  FieldTypeMap,
  ObjectMap,
  PendingRequestActions,
  PendingRequestRejection,
  PendingRequestResolver,
  RequestContext,
  RequestOptions,
  RequestResult,
  ResolveResult,
  ResponseCacheEntryResult,
} from "../types";

import SubscriptionService from "../subscription-service";

const deferredPromise = require("defer-promise");

let instance: DefaultClient;

export class DefaultClient {
  public static async create(args: ClientArgs): Promise<DefaultClient> {
    if (instance && isPlainObject(args) && !args.newInstance) return instance;

    try {
      const client = new DefaultClient(args);
      await client._createCache();
      instance = client;
      return instance;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private static _concatFragments(query: string, fragments: string[]): string {
    return [query, ...fragments].join("\n\n");
  }

  private static _mapFieldToType(args: MapFieldToTypeArgs): void {
    const { ancestors, context, fieldNode, isEntity, resourceKey, typeName, variables } = args;
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

    if (argumentsObjectMap) {
      if (argumentsObjectMap[resourceKey]) {
        resourceValue = argumentsObjectMap[resourceKey];
      } else if (variables && variables[resourceKey]) {
        resourceValue = variables[resourceKey];
      }
    }

    const { fieldTypeMap } = context;

    fieldTypeMap.set(fieldPath, {
      hasArguments: !!argumentsObjectMap,
      isEntity,
      resourceValue,
      typeName,
    });
  }

  private static _socketsSupported(): boolean {
    if (!process.env.WEB_ENV) return true;
    return !!self.WebSocket;
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
    subscription: "max-age=0, s-maxage=0, no-cache, no-store",
  };

  private _headers: ObjectMap = { "content-type": "application/json" };
  private _resourceKey: string = "id";
  private _schema: GraphQLSchema;
  private _subscriptionsEnabled: boolean = false;
  private _subscriptionService: SubscriptionService;
  private _url: string;

  constructor(args: ClientArgs) {
    if (!isPlainObject(args)) {
      throw new TypeError("Constructor expected args to be a plain object.");
    }

    const {
      cachemapOptions,
      defaultCacheControls,
      headers,
      introspection,
      resourceKey,
      subscriptions,
      url,
    } = args;

    const errors: TypeError[] = [];

    if (!isPlainObject(introspection)) {
      errors.push(new TypeError("Constructor expected introspection to be a plain object."));
    }

    if (!isString(url)) {
      errors.push(new TypeError("Constructor expected url to be a string."));
    }

    if (errors.length) throw errors;

    if (cachemapOptions && isPlainObject(cachemapOptions)) {
      this._cachemapOptions = merge(this._cachemapOptions, cachemapOptions);
    }

    if (defaultCacheControls && isPlainObject(defaultCacheControls)) {
      this._defaultCacheControls = { ...this._defaultCacheControls, ...defaultCacheControls };
    }

    if (headers && isPlainObject(headers)) this._headers = { ...this._headers, ...headers };
    if (isString(resourceKey)) this._resourceKey = resourceKey;
    const introspectionQuery = introspection as IntrospectionQuery;
    this._schema = buildClientSchema(introspectionQuery);

    if (DefaultClient._socketsSupported() && subscriptions && isPlainObject(subscriptions)) {
      this._subscriptionsEnabled = true;
      this._subscriptionService = new SubscriptionService(subscriptions.address);
    }

    this._url = url;
  }

  public async clearCache(): Promise<void> {
    try {
      await Promise.all([
        this._cache.dataPaths.clear(),
        this._cache.dataEntities.clear(),
        this._cache.responses.clear(),
      ]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getDataEntityCacheEntry(key: string): Promise<ObjectMap | undefined> {
    try {
      return this._cache.dataEntities.get(key);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getDataEntityCacheSize(): Promise<number> {
    try {
      return this._cache.dataEntities.size();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getDataPathCacheEntry(key: string): Promise<any> {
    try {
      return this._cache.dataPaths.get(key);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getDataPathCacheSize(): Promise<number> {
    try {
      return this._cache.dataPaths.size();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getResponseCacheEntry(key: string): Promise<ResponseCacheEntryResult | undefined> {
    try {
      const entry = await this._cache.responses.get(key);
      if (!entry) return undefined;
      const { cacheMetadata, data } = entry;
      return { cacheMetadata: createCacheMetadata({ cacheMetadata }), data };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getResponseCacheSize(): Promise<number> {
    try {
      return this._cache.responses.size();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async request(query: string, opts: RequestOptions = {}): Promise<RequestResult> {
    let errors: Error[] = [];

    if (!isString(query)) {
      errors.push(new TypeError("Request expected query to be a string."));
    }

    if (!isPlainObject(opts)) {
      errors.push(new TypeError("Request expected opts to be a plain object."));
    }

    if (errors.length) return Promise.reject(errors);

    if (opts.fragments && (!isArray(opts.fragments) || opts.fragments.some((value) => !isString(value)))) {
      return Promise.reject(new TypeError("Request expected opts.fragments to be an array of strings."));
    }

    try {
      const _query = opts.fragments ? DefaultClient._concatFragments(query, opts.fragments) : query;
      const context: RequestContext = { fieldTypeMap: new Map() };
      const updated = await this._updateQuery(_query, opts, context);
      errors = validate(this._schema, updated.ast) as GraphQLError[];
      if (errors.length) return Promise.reject(errors);
      const operations = getOperationDefinitions(updated.ast);

      if (operations.length > 1) {
        return Promise.reject(new TypeError("Request expected to process one operation, but got multiple."));
      }

      const result = await this._resolveRequestOperation(updated.query, updated.ast, opts, context);
      if (isAsyncIterable(result)) return result;
      const resolveResult = result as ResolveResult;

      if (opts.awaitDataCached && resolveResult.cachePromise) {
        await resolveResult.cachePromise;
        delete resolveResult.cachePromise;
      }

      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _checkResponseCache(queryHash: string): Promise<ResolveResult | undefined> {
    try {
      const cacheability = await this._cache.responses.has(queryHash);
      if (!cacheability || !Cache.isValid(cacheability)) return undefined;
      const res = await this._cache.responses.get(queryHash);
      return { cacheMetadata: parseCacheabilityObjectMap(res.cacheMetadata), data: res.data };
    } catch (error) {
      return undefined;
    }
  }

  private async _createCache(): Promise<void> {
    try {
      this._cache = await Cache.create({
        cachemapOptions: this._cachemapOptions,
        defaultCacheControls: this._defaultCacheControls,
        resourceKey: this._resourceKey,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _fetch(
    request: string,
    ast: DocumentNode,
    opts: RequestOptions,
  ): Promise<FetchResult> {
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

    if (!isPlainObject(jsonResult)) {
      const message = "Fetch expected the result to be a JSON object.";
      return Promise.reject(new TypeError(message));
    }

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
      const typeDef = typeInfo.getFieldDef();
      return typeDef ? getType(typeDef) : undefined;
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
    context: RequestContext,
  ): Promise<ResolveResult> {
    let fetchResult: FetchResult;

    try {
      fetchResult = await this._fetch(mutation, ast, opts);
    } catch (error) {
      return this._resolve({ error, operation: "mutation" });
    }

    const cacheMetadata = createCacheMetadata({
      cacheMetadata: fetchResult.cacheMetadata,
      headers: fetchResult.headers,
    });

    const deferred: DeferPromise.Deferred<void> = deferredPromise();

    const resolveResult = await this._cache.resolveMutation(
      ast,
      context.fieldTypeMap,
      fetchResult.data,
      cacheMetadata,
      { cacheResolve: deferred.resolve },
    );

    return this._resolve({
      cacheMetadata: resolveResult.cacheMetadata,
      cachePromise: deferred.promise,
      data: resolveResult.data,
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

    if (this._cache.requests.active.has(queryHash)) {
      return new Promise((resolve: PendingRequestResolver, reject: PendingRequestRejection) => {
        this._setPendingRequest(queryHash, { reject, resolve });
      });
    }

    this._cache.requests.active.set(queryHash, query);
    const analyzeResult = await this._cache.analyze(queryHash, ast, context.fieldTypeMap);
    const { cachedData, cacheMetadata, filtered, updatedAST, updatedQuery } = analyzeResult;
    const deferred: DeferPromise.Deferred<void> = deferredPromise();

    if (cachedData && cacheMetadata) {
      const defaultCacheControl = this._defaultCacheControls.query;
      const queryCacheability = cacheMetadata.get("query");
      const cacheControl = queryCacheability && queryCacheability.printCacheControl() || defaultCacheControl;

      (async () => {
        try {
          await this._cache.responses.set(
            queryHash,
            { cacheMetadata: mapToObject(cacheMetadata), data: cachedData },
            { cacheHeaders: { cacheControl },
          });
        } catch (error) {
          // no catch
        } finally {
          deferred.resolve();
        }
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
      return this._resolve({ error, operation: "query", queryHash });
    }

    const _cacheMetadata = createCacheMetadata({
      cacheMetadata: fetchResult.cacheMetadata,
      headers: fetchResult.headers,
    });

    const resolveResult = await this._cache.resolveQuery(
      _updateQuery,
      _updateAST,
      queryHash,
      context.fieldTypeMap,
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

    if (cacheMetadata && !cacheMetadata.has("query")) {
      const cacheability = new Cacheability();
      cacheability.parseCacheControl(this._defaultCacheControls[operation]);
      cacheMetadata.set("query", cacheability);
    }

    if (resolvePending && queryHash) {
      this._resolvePendingRequests(queryHash, cacheMetadata, data, error);
      this._cache.requests.active.delete(queryHash);
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
    cacheMetadata?: CacheMetadata,
    data?: ObjectMap,
    error?: Error | Error[],
  ): void {
    const pendingRequests = this._cache.requests.pending.get(queryHash);
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

    this._cache.requests.pending.delete(queryHash);
  }

  private _resolveRequestOperation(
    query: string,
    ast: DocumentNode,
    opts: RequestOptions,
    context: RequestContext,
  ): Promise<ResolveResult | AsyncIterator<Event | undefined>> {
    const operationDefinition = getOperationDefinitions(ast)[0];

    if (operationDefinition.operation === "query") {
      return this._query(query, ast, opts, context);
    } else if (operationDefinition.operation === "mutation") {
      return this._mutation(query, ast, opts, context);
    } else if (operationDefinition.operation === "subscription" && this._subscriptionsEnabled) {
      return this._subscription(query, ast, opts, context);
    }

    return Promise.reject(new Error("Request expected the operation to be 'query' or 'mutation'."));
  }

  private async _resolveSubscriber(
    ast: DocumentNode,
    fieldTypeMap: FieldTypeMap,
    result: ObjectMap,
    opts: RequestOptions,
  ): Promise<ResolveResult> {
    if (!isPlainObject(result)) {
      return this._resolve({
        error: new TypeError("Subscriber expected the result to be a JSON object."),
        operation: "subscription",
      });
    }

    if (isArray(result.errors) && result.errors[0] instanceof Error) {
      return this._resolve({ error: result.errors, operation: "subscription" });
    }

    const deferred: DeferPromise.Deferred<void> = deferredPromise();

    const resolveResult = await this._cache.resolveSubscription(
      ast,
      fieldTypeMap,
      result.data,
      createCacheMetadata(result.cacheMetadata),
      { cacheResolve: deferred.resolve },
    );

    if (opts.awaitDataCached) await deferred.promise;

    return this._resolve({
      cacheMetadata: resolveResult.cacheMetadata,
      data: resolveResult.data,
      operation: "subscription",
    });
  }

  private _setPendingRequest(queryHash: string, { reject, resolve }: PendingRequestActions): void {
    let pending = this._cache.requests.pending.get(queryHash);
    if (!pending) pending = [];
    pending.push({ reject, resolve });
    this._cache.requests.pending.set(queryHash, pending);
  }

  private async _subscription(
    subscription: string,
    ast: DocumentNode,
    opts: RequestOptions,
    context: RequestContext,
  ): Promise<ResolveResult | AsyncIterator<Event | undefined>> {
    const hash = Cache.hash(subscription);

    try {
      return this._subscriptionService.send(
        subscription,
        hash,
        async (result) => this._resolveSubscriber(ast, context.fieldTypeMap, result, opts),
      );
    } catch (error) {
      return this._resolve({ error, operation: "subscription" });
    }
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

          if (kind === "Field") {
            const fieldNode = node as FieldNode;

            DefaultClient._mapFieldToType({
              ancestors,
              context,
              fieldNode,
              isEntity: !!fields[_this._resourceKey],
              resourceKey: _this._resourceKey,
              typeName: objectOrInterfaceType.name,
              variables: opts.variables,
            });
          }

          if (fields[_this._resourceKey]) {
            if (!hasChildFields(fieldOrInlineFragmentNode, _this._resourceKey)) {
              const mockAST = parse(`{${_this._resourceKey}}`);
              const queryNode = getOperationDefinitions(mockAST, "query")[0];
              const field = getChildFields(queryNode, _this._resourceKey) as FieldNode;
              addChildFields(fieldOrInlineFragmentNode, field);
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
