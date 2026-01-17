import { isRef } from '#helpers/isRef.ts';
import { visitResponseData } from '#helpers/visitResponseData.ts';

export const buildRefTargets = (cacheEntryValue: unknown): Record<string, string[]> => {
  const refTargets: Record<string, string[]> = {};

  visitResponseData(cacheEntryValue, [], (val, _opPathStack, resKeyStack) => {
    if (isRef(val)) {
      const path = resKeyStack.join('.');

      refTargets[val.__ref] = [...(refTargets[val.__ref] ?? []), path];
    }
  });

  return refTargets;
};
