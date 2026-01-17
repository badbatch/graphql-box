import { isPlainObject } from '@graphql-box/helpers';

export type VisitCallback = (data: unknown, operationPathStack: string[], responseKeyStack: string[]) => void;

export const visitResponseData = (
  node: unknown,
  ancestors: (string | number)[] = [],
  callback: VisitCallback,
): void => {
  if (node === undefined || node === null) {
    return;
  }

  const operationPathStack = ancestors.filter(entry => typeof entry !== 'number');
  const responseKeyStack = ancestors.map(String);

  if (Array.isArray(node)) {
    for (const [i, entry] of Object.entries(node)) {
      visitResponseData(entry, [...ancestors, Number(i)], callback);
    }

    callback(node, operationPathStack, responseKeyStack);
    return;
  }

  if (isPlainObject(node)) {
    for (const [key, value] of Object.entries(node)) {
      visitResponseData(value, [...ancestors, key], callback);
    }

    callback(node, operationPathStack, responseKeyStack);
    return;
  }

  callback(node, operationPathStack, responseKeyStack);
};
