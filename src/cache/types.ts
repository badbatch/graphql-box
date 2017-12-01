import Cacheability from "cacheability";
import { DocumentNode } from "graphql";
import { CachemapOptions, DefaultCacheControls } from "../client/types";
import { ObjectMap } from "../types";

export interface AnalyzeResult {
  cachedData?: ObjectMap;
  cacheMetadata?: Map<string, Cacheability>;
  filtered?: boolean;
  updatedAST?: DocumentNode;
  updatedQuery?: string;
}

export interface CacheArgs {
  cachemapOptions?: CachemapOptions;
  defaultCacheControls: DefaultCacheControls;
}

export interface CheckDataObjectCacheEntryResult {
  cacheability: Cacheability;
  cacheData: ObjectMap | void;
}

export interface CheckObjectCacheMetadata {
  cacheMetadata: Map<string, Cacheability>;
  checkList: Map<string, string>;
  counter: { missing: number, total: number };
  queriedData: ObjectMap;
}

export interface KeyPaths {
  cachePath?: string;
  dataPath?: string;
  queryPath?: string;
}

export interface Keys {
  cacheKey?: string;
  dataKey?: string;
  hashKey?: string;
  name?: string;
  propKey?: string | number;
  queryKey?: string;
}

export interface PartialData {
  cachedData: ObjectMap;
  cacheMetadata: Map<string, Cacheability>;
}
