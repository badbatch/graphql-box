export const buildDependencyKey = (requestID: string, startCursor: string | undefined | null, paths: string[] = []) => {
  if (startCursor) {
    return startCursor;
  }

  if (paths.length === 0) {
    return requestID;
  }

  return `${requestID}::${paths.join('')}`;
};
