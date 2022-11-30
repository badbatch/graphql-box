import { RequestManagerResult } from "@graphql-box/core";
import { merge } from "lodash";

export default (results: RequestManagerResult[]): RequestManagerResult =>
  results.reduce((acc, result) => {
    const { _cacheMetadata, data, errors = [], extensions = {}, headers } = result;
    acc._cacheMetadata = acc._cacheMetadata ? new Map([...acc._cacheMetadata, ..._cacheMetadata]) : _cacheMetadata;
    acc.data = acc.data ? merge({}, acc.data, data) : data;
    acc.errors = [...(acc.errors ?? []), ...errors];
    acc.extensions = { ...(acc.extensions ?? {}), ...extensions };

    if (!acc.headers && headers) {
      acc.headers = headers;
    }

    return acc;
  }, ({} as unknown) as RequestManagerResult);
