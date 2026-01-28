import { type FieldPaths } from '@graphql-box/core';
import { isRef } from '#helpers/isRef.ts';
import { visitResponseData } from '#helpers/visitResponseData.ts';
import { type RefTargets } from '#types.ts';

export const buildRefTargets = (
  cacheEntryValue: unknown,
  fieldPaths: FieldPaths,
  initialOpPathStack: string[] = [],
): RefTargets => {
  const refTargets: RefTargets = {};

  visitResponseData(cacheEntryValue, initialOpPathStack, [], (val, opPathStack, resKeyStack) => {
    if (isRef(val)) {
      const operationPath = opPathStack.join('.');
      const responseKey = resKeyStack.join('.');
      const fieldPathMetadata = fieldPaths[operationPath];

      if (!fieldPathMetadata?.requiredFields) {
        return;
      }

      refTargets[val.__ref] = [...(refTargets[val.__ref] ?? []), responseKey];
    }
  });

  return refTargets;
};
