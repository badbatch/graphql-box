import { type FieldPathMetadataRequiredFields } from '@graphql-box/core';

export const getRequiredFieldNames = (
  requiredFields: FieldPathMetadataRequiredFields,
  hasTypeConditions: boolean,
  typeName: string,
): Set<string> => {
  return hasTypeConditions
    ? new Set([...requiredFields.__typename, ...(requiredFields[typeName] ?? [])])
    : requiredFields.__typename;
};
