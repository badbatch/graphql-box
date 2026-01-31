export const buildOperationPathFromResponseKey = (responseKey: string, baseOperationPath?: string) => {
  const operationPathStack = baseOperationPath ? [baseOperationPath] : [];
  const responseKeyStack = responseKey.split('.');

  for (const key of responseKeyStack) {
    if (!/^\d+$/.test(key)) {
      operationPathStack.push(key);
    }
  }

  return operationPathStack.filter(val => !!val).join('.');
};
