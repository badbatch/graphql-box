import { FieldTypeInfo } from "@graphql-box/core";
import { isPlainObject } from "lodash";

export const getValidTypeIDValue = (
  requestFieldPathData: any,
  { typeIDValue }: FieldTypeInfo,
  typeIDKey: string,
): string | number | undefined => {
  const requestFieldPathDataIDValue = isPlainObject(requestFieldPathData) ? requestFieldPathData[typeIDKey] : undefined;
  return typeIDValue || requestFieldPathDataIDValue;
};
