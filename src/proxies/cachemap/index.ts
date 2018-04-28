import { Cacheability } from "cacheability";

import {
  CachemapArgs,
  CachemapExportResult,
  CachemapImportArgs,
  CachemapMetadata,
  DefaultCachemap,
} from "cachemap";

import { logCacheEntry, logCacheQuery } from "../../monitoring";
import { ObjectMap, RequestContext } from "../../types";

export class CachemapProxy {
  public static async create(args: CachemapArgs): Promise<CachemapProxy> {
    try {
      const cachemap = await DefaultCachemap.create(args);
      const cachemapProxy = new CachemapProxy();
      cachemapProxy._cachemap = cachemap;
      return cachemapProxy;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _cachemap: DefaultCachemap;

  get metadata(): CachemapMetadata[] {
    return this._cachemap.metadata;
  }

  get storeType(): string {
    return this._cachemap.storeType;
  }

  get usedHeapSize(): number {
    return this._cachemap.usedHeapSize;
  }

  public async clear(): Promise<void> {
    try {
      await this._cachemap.clear();
    } catch (error) {
      Promise.reject(error);
    }
  }

  public async delete(key: string, opts?: ObjectMap): Promise<boolean> {
    try {
      return this._cachemap.delete(key, opts);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async entries(keys?: string[]): Promise<Array<[string, any]>> {
    try {
      return this._cachemap.entries(keys);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async export(opts?: ObjectMap): Promise<CachemapExportResult> {
    try {
      return this._cachemap.export(opts);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @logCacheQuery
  public async get(key: string, opts?: ObjectMap, context?: RequestContext): Promise<any> {
    try {
      return this._cachemap.get(key, opts);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async has(key: string, opts?: ObjectMap): Promise<Cacheability | false> {
    try {
      return this._cachemap.has(key, opts);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async import(exported: CachemapImportArgs): Promise<void> {
    try {
      await this._cachemap.import(exported);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @logCacheEntry
  public async set(key: string, value: any, opts: ObjectMap, context: RequestContext): Promise<void> {
    try {
      await this._cachemap.set(key, value, opts);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async size(): Promise<number> {
    try {
      return this._cachemap.size();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
