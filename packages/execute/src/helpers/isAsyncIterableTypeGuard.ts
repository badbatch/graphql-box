import { type PlainObject } from '@graphql-box/core';
import { type ExecutionResult } from 'graphql';
import { isAsyncIterable } from 'iterall';

export const isAsyncIterableTypeGuard = (
  value: ExecutionResult<PlainObject> | AsyncGenerator<ExecutionResult<PlainObject>, void, void>,
): value is AsyncGenerator<ExecutionResult<PlainObject>, void, void> => isAsyncIterable(value);
