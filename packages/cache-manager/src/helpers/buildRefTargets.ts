import { type FieldPaths } from '@graphql-box/core';
import { isRef } from '#helpers/isRef.ts';
import { visitResponseData } from '#helpers/visitResponseData.ts';
import { type RefTargets } from '#types.ts';

export const buildRefTargets = (cacheEntryValue: unknown, fieldPaths: FieldPaths): RefTargets => {
  const refTargets: RefTargets = {};

  visitResponseData(cacheEntryValue, [], (val, opPathStack, resKeyStack) => {
    if (isRef(val)) {
      const operationPath = opPathStack.join('.');
      const responseKey = resKeyStack.join('.');
      const fieldPathMetadata = fieldPaths[operationPath];

      if (!fieldPathMetadata?.requiredFields) {
        console.debug(`No required fields found for operation path ${operationPath} with ref value ${val.__ref}`);
        return;
      }

      refTargets[val.__ref] = [...(refTargets[val.__ref] ?? []), [responseKey, fieldPathMetadata.requiredFields]];
    }
  });

  return refTargets;
};
