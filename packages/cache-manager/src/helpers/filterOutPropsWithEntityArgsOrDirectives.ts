import { type PlainObject } from '@graphql-box/core';
import {
  type KeysAndPaths,
  buildFieldKeysAndPaths,
  getName,
  isPlainObject,
  resolveFragments,
} from '@graphql-box/helpers';
import { type FieldNode } from 'graphql';
import { keys } from 'lodash-es';
import { type CacheManagerContext } from '../types.ts';
import { isFieldEntity } from './isFieldEntity.ts';

export const filterOutPropsWithEntityArgsOrDirectives = (
  fieldData: unknown,
  field: FieldNode,
  ancestorKeysAndPaths: KeysAndPaths,
  context: CacheManagerContext,
) => {
  if (!isPlainObject(fieldData)) {
    return fieldData;
  }

  const fieldAndTypeName = resolveFragments(field.selectionSet?.selections, context.fragmentDefinitions);

  return keys(fieldData).reduce<PlainObject>((acc, key) => {
    const match = fieldAndTypeName.find(({ fieldNode }) => getName(fieldNode) === key);

    if (match) {
      const keysAndPaths = buildFieldKeysAndPaths(match.fieldNode, ancestorKeysAndPaths, context);
      const fieldTypeInfo = context.fieldTypeMap.get(keysAndPaths.requestFieldPath);

      if (
        // In this context, typeIDKey cannot be undefined
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        isFieldEntity(fieldData[key], fieldTypeInfo, context.typeIDKey!) ||
        fieldTypeInfo?.hasArguments ||
        fieldTypeInfo?.hasDirectives
      ) {
        // In this context, this is safe
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete fieldData[key];
      }
    }

    return acc;
  }, fieldData);
};
