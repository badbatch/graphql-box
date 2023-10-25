import { type PlainObject, type RequestContext } from '@graphql-box/core';

export const getRequestContext = (props: PlainObject = {}): RequestContext => {
  return {
    debugManager: null,
    experimentalDeferStreamSupport: false,
    fieldTypeMap: new Map(),
    filteredRequest: '',
    hasDeferOrStream: false,
    operation: 'query',
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
