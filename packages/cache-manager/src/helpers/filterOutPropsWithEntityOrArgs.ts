import { type EntityData } from '@graphql-box/core';
import { type KeysAndPaths, buildFieldKeysAndPaths, getName, resolveFragments } from '@graphql-box/helpers';
import { type FieldNode } from 'graphql';
import { keys } from 'lodash-es';
import { type CacheManagerContext } from '../types.ts';
import { isFieldEntity } from './isFieldEntity.ts';

export const filterOutPropsWithEntityOrArgs = (
  fieldData: EntityData,
  field: FieldNode,
  ancestorKeysAndPaths: KeysAndPaths,
  context: CacheManagerContext,
) => {
  const fieldAndTypeName = resolveFragments(field.selectionSet?.selections, context.fragmentDefinitions);

  return keys(fieldData).reduce<Partial<EntityData>>((acc, key) => {
    const match = fieldAndTypeName.find(({ fieldNode }) => getName(fieldNode) === key);

    if (match) {
      const { requestFieldPath } = buildFieldKeysAndPaths(match.fieldNode, ancestorKeysAndPaths, context);
      const fieldTypeInfo = context.fieldTypeMap.get(requestFieldPath);

      if (isFieldEntity(fieldData[key], fieldTypeInfo, context.typeIDKey!) || fieldTypeInfo?.hasArguments) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete fieldData[key];
      }
    }

    return acc;
  }, fieldData) as EntityData;
};
