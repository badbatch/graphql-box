import { type PlainObject } from '@graphql-box/core';
import stableStringify from 'fast-json-stable-stringify';
import { hashOperation } from './hashOperation.ts';

export const buildOperationHash = (operation: string, variables: PlainObject<unknown> = {}) =>
  hashOperation(`${stableStringify(variables)}:${operation}`);
