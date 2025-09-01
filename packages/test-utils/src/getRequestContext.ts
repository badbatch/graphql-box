import { type PartialRequestContext, type RequestContext } from '@graphql-box/core';
import { OperationTypeNode } from 'graphql';
import { merge } from 'lodash-es';

export const getRequestContext = (ctx: PartialRequestContext = {}): RequestContext => {
  return merge(
    {
      data: {
        operation: OperationTypeNode.QUERY,
        operationName: '',
        originalRequestHash: '',
        queryFiltered: false,
        requestComplexity: undefined,
        requestDepth: undefined,
        requestId: '123456789',
      },
      debugManager: undefined,
      fieldPaths: undefined,
    },
    ctx,
  );
};
