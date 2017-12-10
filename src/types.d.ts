import Cacheability, { CacheabilityMetadata } from "cacheability";

export interface CacheabilityObjectMap { [key: string]: CacheabilityMetadata };
export type CacheMetadata = Map<string, Cacheability>;
export interface ObjectMap { [key: string]: any; }
