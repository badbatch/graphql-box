import { type EntityData, type FieldTypeInfo } from '@graphql-box/core';
import { type CacheManagerContext } from '../types.ts';

export const createEntityDataKey = (
  fieldData: EntityData,
  fieldTypeInfo: FieldTypeInfo,
  context: CacheManagerContext,
) => {
  const fieldTypeName = fieldTypeInfo.isEntity ? fieldTypeInfo.typeName : fieldData.__typename;
  // In context, context.typeIDKey is never gonna be undefined
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return `${fieldTypeName}::${String(fieldData[context.typeIDKey!])}`;
};
