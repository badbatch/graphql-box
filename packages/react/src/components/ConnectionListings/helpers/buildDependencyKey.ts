export default (requestID: string, startCursor: string | undefined | null, paths: string[] = []) => {
  if (startCursor) {
    return startCursor;
  }

  if (!paths.length) {
    return requestID;
  }

  return `${requestID}::${paths.join("")}`;
};
