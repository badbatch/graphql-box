import { type FieldPaths } from '@graphql-box/core';

export const buildResponseDataKey = (operationPath: string, fieldPaths: FieldPaths) => {
  const parts = operationPath.split('.');
  const operationPathPartStack: string[] = [];
  const pathResponseKeyStack: string[] = [];

  for (const part of parts) {
    operationPathPartStack.push(part);
    const currentOperationPath = operationPathPartStack.join('.');
    const fieldPath = fieldPaths[currentOperationPath];

    if (!fieldPath) {
      throw new Error(`Could not resolve current operation path ${currentOperationPath} in field paths.`);
    }

    pathResponseKeyStack.push(fieldPath.pathResponseKey);
  }

  return pathResponseKeyStack.join('.');
};
