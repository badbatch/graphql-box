import { type PlainObject } from '@graphql-box/core';
import { has } from 'lodash-es';
import { type RefTargets } from '#types.ts';

export const mergeRefTargets = (
  data: PlainObject<unknown>,
  existingRefTargets: RefTargets,
  incomingRefTargets: RefTargets,
): RefTargets => {
  const newRefTargets: RefTargets = {};

  for (const [ref, existingResponsePathTargets] of Object.entries(existingRefTargets)) {
    for (const existingResponseKey of existingResponsePathTargets) {
      if (has(data, existingResponseKey)) {
        newRefTargets[ref] ??= [];
        newRefTargets[ref].push(existingResponseKey);
      }
    }
  }

  for (const [ref, incomingResponsePathTargets] of Object.entries(incomingRefTargets)) {
    if (!newRefTargets[ref]) {
      newRefTargets[ref] = incomingResponsePathTargets;
      continue;
    }

    const newRefTarget = newRefTargets[ref];

    for (const incomingResponseKey of incomingResponsePathTargets) {
      const refTargetMatch = newRefTarget.find(newResponseKey => newResponseKey === incomingResponseKey);

      if (!refTargetMatch) {
        newRefTarget.push(incomingResponseKey);
      }
    }
  }

  return newRefTargets;
};
