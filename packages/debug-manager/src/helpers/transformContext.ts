import { type RequestContext } from '@graphql-box/core';

export const transformContext = (context?: Omit<RequestContext, 'debugManager'>) => {
  if (!context) {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fieldTypeMap, ...rest } = context;
  return rest;
};
