import { CacheMetadata, MaybeRequestResult } from "@graphql-box/core";
import { serializeErrors } from "@graphql-box/helpers";
import { Environment } from "../defs";

export default (environment: Environment, result?: MaybeRequestResult & { cacheMetadata?: CacheMetadata }) => {
  if (!result || !result.errors?.length) {
    return {};
  }

  return {
    err: environment === "server" ? result.errors[0] : serializeErrors(result)?.errors?.[0],
  };
};
