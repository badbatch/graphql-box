import { Cacheability } from "cacheability";
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
  cachemapOptions: CachemapArgsGroup;
  defaultCacheControls: DefaultCacheControls;
  resourceKey: string;
}

export interface CachesCheckMetadata {
  cacheMetadata: CacheMetadata;
  checkList: CheckList;
  counter: { missing: number, total: number };
  queriedData: ObjectMap;
}

export interface CacheEntryData {
  cacheability?: Cacheability;
  primary?: any;
  secondary?: any;
}

export interface CacheEntryResult {
  cachedData: any;
  cacheability: Cacheability | false;
}

export interface CacheUpdateDataTypes {
  entities: ObjectMap | any[];
  paths: ObjectMap | any[];
}

export type CheckList = Map<string, boolean>;

export interface GetKeysResult {
  cacheKey: string;
  dataKey: string;
  hashKey: string;
  name: string;
  propKey: string | number;
  queryKey: string;
}

export type IterateChildFieldsCallback = (childField: FieldNode, childIndex?: number) => void;

export interface KeyPaths {
  cachePath?: string;
  dataPath?: string;
  queryPath?: string;
}

export interface PartialData {
  cachedData: ObjectMap;
  cacheMetadata: CacheMetadata;
}

export interface UpdateDataCachesOptions {
  setEntities?: boolean;
  setPaths?: boolean;
}
