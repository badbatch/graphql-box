import { type PlainObject } from '@graphql-box/core';
import { hashOperation } from '@graphql-box/helpers';

export const buildOperationHash = (query: string, variables: PlainObject<unknown> = {}) =>
  hashOperation(`${JSON.stringify(variables)}:${query}`);
