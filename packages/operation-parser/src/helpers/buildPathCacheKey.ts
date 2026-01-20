import { getAlias, getArguments } from '@graphql-box/helpers';
import stableStringify from 'fast-json-stable-stringify';
import { type FieldNode } from 'graphql';

export type BuildPathCacheKeyOptions = {
  isList?: boolean;
};

export const buildPathCacheKey = (fieldNode: FieldNode, { isList }: BuildPathCacheKeyOptions = {}) => {
  const { value: name } = fieldNode.name;
  let cacheKey = getAlias(fieldNode) ?? name;
  const args = getArguments(fieldNode);

  if (args) {
    cacheKey += `(${stableStringify(args)})`;
  }

  if (isList) {
    cacheKey += '[]';
  }

  return cacheKey;
};
