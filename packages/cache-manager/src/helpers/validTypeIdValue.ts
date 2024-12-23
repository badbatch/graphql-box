import { type FieldTypeInfo } from '@graphql-box/core';
import { isPlainObject } from '@graphql-box/helpers';

export const getValidTypeIdValue = (
  requestFieldPathData: unknown,
  { typeIDValue }: FieldTypeInfo,
  typeIDKey: string,
): string | number | undefined => {
  if (typeIDValue) {
    return typeIDValue;
  }

  if (isPlainObject(requestFieldPathData)) {
    // Identifier value can only be one of these types
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return requestFieldPathData[typeIDKey] as string | number | undefined;
  }

  return;
};
