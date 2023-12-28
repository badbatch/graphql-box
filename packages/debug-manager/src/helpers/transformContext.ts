import { type RequestContext } from '@graphql-box/core';

export const transformContext = (context?: Omit<RequestContext, 'debugManager'>) => {
  if (!context) {
    return {};
  }

  const { fieldTypeMap, ...rest } = context;
  return rest;
};
