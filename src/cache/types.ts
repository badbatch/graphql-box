import Cacheability from "cacheability";
import { DocumentNode, FieldNode } from "graphql";
import { CachemapOptions, DefaultCacheControls } from "../client/types";
import { CacheMetadata, ObjectMap } from "../types";

export interface AnalyzeResult {
  cachedData?: ObjectMap;
  cacheMetadata?: CacheMetadata;
  filtered?: boolean;
  updatedAST?: DocumentNode;
  updatedQuery?: string;
}

export interface CacheArgs {
  cachemapOptions?: CachemapOptions;
  defaultCacheControls: DefaultCacheControls;
}

export type CacheData = ObjectMap | any[] | string | number | boolean | null;

export interface CheckDataObjectCacheEntryResult {
  cacheability: Cacheability | boolean;
  cacheData: CacheData | void;
}

export type CheckList = Map<string, boolean>;

export type IterateChildFieldsCallback = (childField: FieldNode, childIndex?: number) => void;

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

export interface ObjectCacheCheckMetadata {
  cacheMetadata: CacheMetadata;
  checkList: CheckList;
  counter: { missing: number, total: number };
  queriedData: ObjectMap;
}

export interface PartialData {
  cachedData: ObjectMap;
  cacheMetadata: CacheMetadata;
}
