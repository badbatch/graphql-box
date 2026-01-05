import { type PlainObject } from '@graphql-box/core';
import { hashOperation } from '@graphql-box/helpers';
import stableStringify from 'fast-json-stable-stringify';

export const buildOperationHash = (query: string, variables: PlainObject<unknown> = {}) =>
  hashOperation(`${stableStringify(variables)}:${query}`);
