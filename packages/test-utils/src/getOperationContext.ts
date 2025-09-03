import { type OperationContext, type PartialOperationContext } from '@graphql-box/core';
import { OperationTypeNode } from 'graphql';
import { merge } from 'lodash-es';

export const getOperationContext = (ctx: PartialOperationContext = {}): OperationContext => {
  return merge(
    {
      data: {
        operationId: '123456789',
        operationMaxFieldDepth: undefined,
        operationName: '',
        operationType: OperationTypeNode.QUERY,
        operationTypeComplexity: undefined,
        originalOperationHash: '',
      },
      debugManager: undefined,
      fieldPaths: undefined,
    },
    ctx,
  );
};
