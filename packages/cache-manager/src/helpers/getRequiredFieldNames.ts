import { type FieldPathMetadataRequiredFields } from '@graphql-box/core';

export const getRequiredFieldNames = (requiredFields: FieldPathMetadataRequiredFields, typeName?: string): string[] => {
  const requiredFieldNames = [...requiredFields.__typename];
  const typeConditionRequiredFields = typeName ? (requiredFields[typeName] ?? []) : [];

  for (const requiredField of typeConditionRequiredFields) {
    if (!requiredFieldNames.includes(requiredField)) {
      requiredFieldNames.push(requiredField);
    }
  }

  return requiredFieldNames;
};
