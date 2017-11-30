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

export interface CheckObjectCacheMetadata {
  cachedData: ObjectMap;
  cacheMetadata: Map<string, Cacheability>;
  checkList: Map<string, string>;
  counter: { missing: number, total: number };
}

export interface PartialData {
  cachedData: ObjectMap;
  cacheMetadata: Map<string, Cacheability>;
}
