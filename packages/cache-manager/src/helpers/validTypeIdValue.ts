import { type FieldTypeInfo } from '@graphql-box/core';
import { isPlainObject } from '@graphql-box/helpers';

export const getValidTypeIdValue = (
  requestFieldPathData: unknown,
  { typeIDValue }: FieldTypeInfo,
  typeIDKey: string
): string | number | undefined => {
  if (typeIDValue) {
    return typeIDValue;
  }

  if (isPlainObject(requestFieldPathData)) {
    return requestFieldPathData[typeIDKey] as string | number | undefined;
  }

  return;
};
