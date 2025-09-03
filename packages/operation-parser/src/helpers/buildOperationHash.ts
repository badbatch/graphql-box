import { type PlainObject } from '@graphql-box/core';
import { hashRequest } from '@graphql-box/helpers';
import { type Jsonifiable } from 'type-fest';

export const buildOperationHash = (query: string, variables: PlainObject<Jsonifiable> = {}) =>
  hashRequest(`${JSON.stringify(variables)}:${query}`);
