export const buildDependencyKey = (
  operationId: string,
  startCursor: string | undefined | null,
  paths: string[] = [],
) => {
  if (startCursor) {
    return startCursor;
  }

  if (paths.length === 0) {
    return operationId;
  }

  return `${operationId}::${paths.join('')}`;
};
