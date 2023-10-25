import { type RequestData } from '@graphql-box/core';
import { hashRequest } from '@graphql-box/helpers';
import { parse } from 'graphql';

export const getRequestData = (request: string): RequestData => {
  return {
    ast: parse(request),
    hash: hashRequest(request),
    request,
  };
};
