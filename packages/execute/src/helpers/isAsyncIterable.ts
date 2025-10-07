import { type ResponseData } from '@graphql-box/core';
import { isAsyncIterable as iterallIsAsyncIterable } from 'iterall';

export const isAsyncIterable = (value: unknown): value is AsyncIterator<ResponseData | undefined> =>
  iterallIsAsyncIterable(value);
