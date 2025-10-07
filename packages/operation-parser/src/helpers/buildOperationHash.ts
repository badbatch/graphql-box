import { type PlainObject } from '@graphql-box/core';
import { hashRequest } from '@graphql-box/helpers';

export const buildOperationHash = (query: string, variables: PlainObject<unknown> = {}) =>
  hashRequest(`${JSON.stringify(variables)}:${query}`);
