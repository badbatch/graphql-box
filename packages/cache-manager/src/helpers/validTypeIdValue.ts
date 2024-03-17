import { type FieldTypeInfo } from '@graphql-box/core';
import { isPlainObject } from '@graphql-box/helpers';

export const getValidTypeIdValue = (
  requestFieldPathData: unknown,
  fieldTypeInfo: FieldTypeInfo | undefined,
  typeIDKey: string
): string | number | undefined => {
  if (fieldTypeInfo?.typeIDValue) {
    return fieldTypeInfo.typeIDValue;
  }

  if (isPlainObject(requestFieldPathData)) {
    return requestFieldPathData[typeIDKey] as string | number | undefined;
  }

  return;
};
