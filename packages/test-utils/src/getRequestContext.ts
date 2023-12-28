import { type PlainObject, type RequestContext } from '@graphql-box/core';
import { OperationTypeNode } from 'graphql';

export const getRequestContext = (props: PlainObject = {}): RequestContext => {
  return {
    debugManager: null,
    experimentalDeferStreamSupport: false,
    fieldTypeMap: new Map(),
    filteredRequest: '',
    hasDeferOrStream: false,
    operation: OperationTypeNode.QUERY,
    operationName: '',
    originalRequestHash: '',
    parsedRequest: '',
    queryFiltered: false,
    request: '',
    requestComplexity: null,
    requestDepth: null,
    requestID: '123456789',
    ...props,
  };
};
