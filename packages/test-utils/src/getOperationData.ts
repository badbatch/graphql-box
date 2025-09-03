import { type OperationData } from '@graphql-box/core';
import { hashRequest } from '@graphql-box/helpers';
import { parse } from 'graphql';

export const getOperationData = (operation: string): OperationData => {
  return {
    ast: parse(operation),
    hash: hashRequest(operation),
    operation,
  };
};
