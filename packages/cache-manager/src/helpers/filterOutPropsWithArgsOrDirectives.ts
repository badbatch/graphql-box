import { type PlainObject } from '@graphql-box/core';
import { type KeysAndPaths, buildFieldKeysAndPaths, getName, resolveFragments } from '@graphql-box/helpers';
import { type SelectionNode } from 'graphql';
import { keys } from 'lodash-es';
import { type CacheManagerContext } from '../types.ts';

export const filterOutPropsWithArgsOrDirectives = (
  fieldData: PlainObject,
  selectionNodes: readonly SelectionNode[],
  ancestorKeysAndPaths: KeysAndPaths,
  context: CacheManagerContext
) => {
  const fieldAndTypeName = resolveFragments(selectionNodes, context.fragmentDefinitions);

  return keys(fieldData).reduce((acc: PlainObject, key) => {
    const match = fieldAndTypeName.find(({ fieldNode }) => getName(fieldNode) === key);

    if (match) {
      const { requestFieldPath } = buildFieldKeysAndPaths(match.fieldNode, ancestorKeysAndPaths, context);
      const fieldTypeInfo = context.fieldTypeMap.get(requestFieldPath);

      if (!fieldTypeInfo?.hasArguments && !fieldTypeInfo?.hasDirectives) {
        acc[key] = fieldData[key];
      }
    }

    return acc;
  }, {});
};
