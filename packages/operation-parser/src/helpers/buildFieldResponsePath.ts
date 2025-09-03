export const buildFieldResponsePath = (
  fieldName: string,
  parentResponsePath: string | undefined,
  iterations: number | undefined,
): string => {
  let fieldResponsePath = parentResponsePath ? `${parentResponsePath}.${fieldName}` : fieldName;

  if (iterations) {
    fieldResponsePath += `{${String(iterations)}}`;
  }

  return fieldResponsePath;
};
