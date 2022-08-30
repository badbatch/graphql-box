import { CacheMetadata, MaybeRequestResult } from "@graphql-box/core";

export default (result?: MaybeRequestResult & { cacheMetadata?: CacheMetadata }) => {
  if (!result || !result.errors?.length) {
    return {};
  }

  return {
    err: result.errors[0],
  };
};
