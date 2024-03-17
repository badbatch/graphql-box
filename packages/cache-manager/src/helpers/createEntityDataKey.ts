import type { EntityData, FieldTypeInfo } from '@graphql-box/core';
import type { CacheManagerContext } from '../types.ts';

export const createEntityDataKey = (
  fieldData: EntityData,
  fieldTypeInfo: FieldTypeInfo,
  context: CacheManagerContext
) => {
  const fieldTypeName = fieldTypeInfo.isEntity ? fieldTypeInfo.typeName : fieldData.__typename;
  return `${fieldTypeName}::${String(fieldData[context.typeIDKey!])}`;
};
