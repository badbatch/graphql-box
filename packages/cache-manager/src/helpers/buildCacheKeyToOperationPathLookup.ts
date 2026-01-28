import { type FieldPaths } from '@graphql-box/core';
import { buildOperationPathCacheKey } from '@graphql-box/helpers';

export const buildCacheKeyToOperationPathLookup = (fieldPaths: FieldPaths) => {
  const lookup: Record<string, string> = {};

  for (const operationPath of Object.keys(fieldPaths)) {
    const cacheKey = buildOperationPathCacheKey(operationPath, fieldPaths);
    lookup[cacheKey] = operationPath;
  }

  return lookup;
};
