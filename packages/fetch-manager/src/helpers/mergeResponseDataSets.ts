import { DeserializedGraphqlError, MaybeRawFetchData } from "@graphql-box/core";
import { merge } from "lodash";
import { ErrorObject } from "serialize-error";
import cleanPatchResponse from "./cleanPatchResponse";

export default (responseDataSets: MaybeRawFetchData[]): MaybeRawFetchData => {
  return responseDataSets.reduce((acc, dataSet, index) => {
    const { _cacheMetadata, data, errors, hasNext, headers, paths } = cleanPatchResponse(dataSet);

    if (_cacheMetadata) {
      acc._cacheMetadata = acc._cacheMetadata ? { ...acc._cacheMetadata, ..._cacheMetadata } : _cacheMetadata;
    }

    if (data) {
      acc.data = acc.data ? merge(acc.data, data) : data;
    }

    if (errors?.length) {
      if (!acc.errors) {
        acc.errors = [];
      }

      (acc.errors as (DeserializedGraphqlError | ErrorObject)[]).push(...errors);
    }

    if (index === 0) {
      acc.headers = headers;
    }

    if (index === responseDataSets.length - 1) {
      acc.hasNext = hasNext;
    }

    if (paths) {
      if (!acc.paths) {
        acc.paths = [];
      }

      acc.paths.push(paths[0]);
    }

    return acc;
  }, {});
};
