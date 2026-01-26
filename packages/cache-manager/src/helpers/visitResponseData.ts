import { isPlainObject } from '@graphql-box/helpers';

export type VisitCallback = (
  data: unknown,
  operationPathStack: string[],
  responseKeyStack: (string | number)[],
) => void;

export const visitResponseData = (
  node: unknown,
  operationPathStack: string[],
  responseKeyStack: (string | number)[],
  callback: VisitCallback,
): void => {
  if (node === undefined || node === null) {
    return;
  }

  if (Array.isArray(node)) {
    for (const [i, entry] of Object.entries(node)) {
      visitResponseData(entry, operationPathStack, [...responseKeyStack, Number(i)], callback);
    }

    callback(node, operationPathStack, responseKeyStack);
    return;
  }

  if (isPlainObject(node)) {
    for (const [key, value] of Object.entries(node)) {
      visitResponseData(value, [...operationPathStack, key], [...responseKeyStack, key], callback);
    }

    callback(node, operationPathStack, responseKeyStack);
    return;
  }

  callback(node, operationPathStack, responseKeyStack);
};
