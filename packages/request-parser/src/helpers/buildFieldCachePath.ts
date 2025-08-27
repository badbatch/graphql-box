export const buildFieldCachePath = (
  fieldName: string,
  parentCachePath: string | undefined,
  fieldArgs: Record<string, unknown> | undefined,
  iterations: number | undefined,
) => {
  let fieldCachePath = parentCachePath ? `${parentCachePath}.${fieldName}` : fieldName;

  if (fieldArgs) {
    fieldCachePath += `(${JSON.stringify(fieldArgs)})`;
  }

  if (iterations) {
    fieldCachePath += `{${String(iterations)}}`;
  }

  return fieldCachePath;
};
