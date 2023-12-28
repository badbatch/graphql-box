import { type CacheMetadata, type PartialRequestResult } from '@graphql-box/core';
import { serializeErrors } from '@graphql-box/helpers';
import { type Environment } from '../types.ts';

export const transformError = (
  environment: Environment,
  result?: PartialRequestResult & { cacheMetadata?: CacheMetadata }
) => {
  if (!result?.errors?.length) {
    return {};
  }

  return {
    err: environment === 'server' ? result.errors[0] : serializeErrors(result).errors?.[0],
  };
};
