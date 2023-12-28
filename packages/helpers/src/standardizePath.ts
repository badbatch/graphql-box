import { type AsyncExecutionResult, type ExecutionPatchResult } from '@graphql-box/core';
import { type SetRequired } from 'type-fest';

export const standardizePath = (result: AsyncExecutionResult) => {
  if (!('path' in result)) {
    return result;
  }

  const { path, ...rest } = result as SetRequired<ExecutionPatchResult, 'path'>;

  return {
    ...rest,
    paths: [path.join('.')],
  };
};
