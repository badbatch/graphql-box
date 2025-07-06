export const buildFieldCachePath = (
  fieldName: string,
  parentCachePath: string | undefined,
  populatedFieldArgs: Record<string, unknown> | undefined,
  iterations: number | undefined,
) => {
  let fieldCachePath = parentCachePath ? `${parentCachePath}.${fieldName}` : fieldName;

  if (populatedFieldArgs) {
    fieldCachePath += `(${JSON.stringify(populatedFieldArgs)})`;
  }

  if (iterations) {
    fieldCachePath += `{${String(iterations)}}`;
  }

  return fieldCachePath;
};
