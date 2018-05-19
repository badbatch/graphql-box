import { Cacheability } from "cacheability";
import { FieldNode, GraphQLSchema } from "graphql";
import { CachemapOptions } from "../client/types";
import { CacheMetadata, ObjectMap, StringObjectMap } from "../types";

export interface CacheArgs {
  cachemapOptions: CachemapArgsGroup;
  resourceKey: string;
  typeCacheControls?: StringObjectMap;
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
  tag?: any;
}
