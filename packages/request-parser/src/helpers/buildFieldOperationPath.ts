export const buildFieldOperationPath = (fieldName: string, parentFieldPath: string | undefined) =>
  parentFieldPath ? `${parentFieldPath}.${fieldName}` : fieldName;
