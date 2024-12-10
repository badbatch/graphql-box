import { type AsyncExecutionResult, type ExecutionPatchResult } from '@graphql-box/core';
import { type SetRequired } from 'type-fest';

const isExecutionPatchResultWithPath = (
  result: AsyncExecutionResult,
): result is SetRequired<ExecutionPatchResult, 'path'> => 'path' in result;

export const standardizePath = (result: AsyncExecutionResult) => {
  if (!isExecutionPatchResultWithPath(result)) {
    return result;
  }

  const { path, ...rest } = result;

  return {
    ...rest,
    paths: [path.join('.')],
  };
};
