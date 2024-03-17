import type { EntityData, FieldTypeInfo } from '@graphql-box/core';
import { isPlainObject } from '@graphql-box/helpers';

export const isFieldEntity = (
  fieldData: unknown,
  fieldTypeInfo: FieldTypeInfo | undefined,
  typeIDKey: string
): fieldData is EntityData => {
  if (!isPlainObject(fieldData) || !(typeIDKey in fieldData)) {
    return false;
  }

  const { isEntity = false, possibleTypes = [] } = fieldTypeInfo ?? {};

  if (isEntity) {
    return true;
  }

  if (possibleTypes.length === 0) {
    return false;
  }

  return possibleTypes.some(type => type.typeName === fieldData.__typename);
};
