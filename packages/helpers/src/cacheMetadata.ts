import { type CacheMetadata } from '@graphql-box/core';
import { Cacheability } from 'cacheability';
import { OperationTypeNode } from 'graphql';

export const setCacheMetadata =
  (cacheMetadata: CacheMetadata) =>
  (key: string, headers: Headers, operation: OperationTypeNode = OperationTypeNode.QUERY) => {
    cacheMetadata[`${operation}.${key}`] = new Cacheability({ headers }).metadata;
  };
