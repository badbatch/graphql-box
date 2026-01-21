import { type PlainObject } from '@graphql-box/core';
import { has } from 'lodash-es';

export const mergeRefTargets = (
  data: PlainObject<unknown>,
  existingRefTargets: Record<string, string[]>,
  incomingRefTargets: Record<string, string[]>,
): Record<string, string[]> => {
  const mergedRefTargets: Record<string, string[]> = {};

  for (const [ref, responsePathTargets] of Object.entries(existingRefTargets)) {
    for (const target of responsePathTargets) {
      if (has(data, target)) {
        mergedRefTargets[ref] ??= [];
        mergedRefTargets[ref].push(target);
      }
    }
  }

  for (const [ref, responsePathTargets] of Object.entries(incomingRefTargets)) {
    mergedRefTargets[ref] = mergedRefTargets[ref]
      ? [...new Set([...mergedRefTargets[ref], ...responsePathTargets])]
      : [...responsePathTargets];
  }

  return mergedRefTargets;
};
