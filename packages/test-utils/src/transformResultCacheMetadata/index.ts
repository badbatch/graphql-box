import { CacheMetadata } from "@graphql-box/core";
import Cacheability from "cacheability";
import {
  MockCacheResult,
  MockIncrementalRequestManagerResult,
  MockRequestManagerResult,
  MockSubscriptionsManagerResult,
} from "../defs";

export default ({
  _cacheMetadata,
  ...rest
}:
  | MockRequestManagerResult
  | MockSubscriptionsManagerResult
  | MockCacheResult
  | MockIncrementalRequestManagerResult) => {
  return {
    _cacheMetadata: Object.keys(_cacheMetadata).reduce((map: CacheMetadata, key: string) => {
      const cacheability = new Cacheability({ cacheControl: _cacheMetadata[key] });
      map.set(key, cacheability);
      return map;
    }, new Map()),
    ...rest,
  };
};
