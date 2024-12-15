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

  // Casting for ease of typing for consumers
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return {
    ...rest,
    paths: [path.join('.')],
  } as AsyncExecutionResult & { paths: string[] };
};
