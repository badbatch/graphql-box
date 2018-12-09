import Cachemap from "@cachemap/core";
import { coreDefs } from "@handl/core";
import { debugDefs } from "@handl/debug-manager";
import Cacheability from "cacheability";
import { get, isPlainObject } from "lodash";
import { CACHE_CONTROL, METADATA, NO_CACHE } from "../consts";
import logQuery from "../debug/log-query";
import * as defs from "../defs";

export class CacheManager implements defs.CacheManager  {
  public static async init(options: defs.InitOptions): Promise<CacheManager> {
    const errors: TypeError[] = [];

    if (!options.cache) {
       errors.push(new TypeError("@handl/cache-manager expected options.cache."));
    }

    if (!!options.typeCacheDirectives && !isPlainObject(options.typeCacheDirectives)) {
      errors.push(new TypeError("@handl/cache-manager expected options.typeCacheDirectives to be a plain object."));
    }

    if (errors.length) return Promise.reject(errors);

    try {
      CacheManager._debugManager = options.debugManager;
      return new CacheManager(options);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private static _debugManager: debugDefs.DebugManager | undefined;

  private static _isValid(cacheability?: Cacheability | false): boolean {
    const noCache = get(cacheability, [METADATA, CACHE_CONTROL, NO_CACHE], false);
    return !!cacheability && !noCache && cacheability.checkTTL();
  }

  private static _rehydrateCacheMetadata(dehydratedCacheMetadata: defs.DehydratedCacheMetadata): defs.CacheMetadata {
    const cacheMetadata: defs.CacheMetadata = new Map();

    return Object.keys(dehydratedCacheMetadata).reduce((map: defs.CacheMetadata, key: string) => {
      const cacheability = new Cacheability({ metadata: dehydratedCacheMetadata[key] });
      map.set(key, cacheability);
      return map;
    }, cacheMetadata);
  }

  private _cache: Cachemap;
  private _partialQueryResponses: Map<string, defs.PartialQueryResponse>;
  private _typeCacheDirectives: coreDefs.PlainObjectStringMap | undefined;
  private _typeIDKey: string;

  constructor(options: defs.ConstructorOptions) {
    this._cache = options.cache;
    this._typeCacheDirectives = options.typeCacheDirectives;
    this._typeIDKey = options.typeIDKey;
  }

  get cache(): Cachemap {
    return this._cache;
  }

  public async analyzeQuery(
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<defs.AnalyzeQueryResult> {
    const cachedRequestData = await this._getCachedRequestData(requestData, options, context);
    const { cacheMetadata, data, fieldPathChecklist, fields } = cachedRequestData;
    // TODO
  }

  public async check(
    cacheType: coreDefs.CacheTypes,
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.ResponseData | false> {
    try {
      return this._check(cacheType, requestData, options, context);
    } catch (error) {
      return false;
    }
  }

  private async _check(
    cacheType: coreDefs.CacheTypes,
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.ResponseData | false> {
    try {
      const cacheability = await this._has(cacheType, requestData);
      if (!CacheManager._isValid(cacheability)) return false;
      const { cacheMetadata, data, errors } = await this._get(cacheType, requestData, options, context);
      if (errors) return false;
      return { cacheMetadata, data };
    } catch (error) {
      return false;
    }
  }

  @logQuery(CacheManager._debugManager)
  private async _get(
    cacheType: coreDefs.CacheTypes,
    { hash }: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.ResponseData> {
    try {
      const { cacheMetadata, data } = await this._cache.get(`${cacheType}::${hash}`);
      return { cacheMetadata: CacheManager._rehydrateCacheMetadata(cacheMetadata), data };
    } catch (errors) {
      return { errors };
    }
  }

  private async _has(
    cacheType: coreDefs.CacheTypes,
    { hash }: coreDefs.RequestData,
  ): Promise<Cacheability | false> {
    try {
      return this._cache.has(`${cacheType}::${hash}`);
    } catch (error) {
      return false;
    }
  }

  private async _getCachedRequestData(
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<defs.CachedRequestDataResult> {
    const cachedRequestData: defs.CachedRequestDataResult = {
      cacheMetadata: new Map(),
      data: {},
      fieldPathChecklist: new Map(),
      fields: { missing: 0, total: 0 },
    };

    const queryNode = getOperationDefinitions(ast, context.operation)[0];
    const fields = getChildFields(queryNode) as FieldNode[];
    await Promise.all(fields.map((field) => this._parseField(field, metadata, context)));
    return metadata;
  }
}

export default function init(userOptions: defs.UserOptions): defs.CacheManagerInit {
  if (!isPlainObject(userOptions)) {
    throw new TypeError("@handl/cache-manager expected userOptions to be a plain object.");
  }

  return (clientOptions: defs.ClientOptions) => CacheManager.init({ ...clientOptions, ...userOptions });
}
