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
    for (const [existingResponseKey, existingRequiredFields] of existingResponsePathTargets) {
      if (has(data, existingResponseKey)) {
        newRefTargets[ref] ??= [];
        newRefTargets[ref].push([existingResponseKey, existingRequiredFields]);
      }
    }
  }

  for (const [ref, incomingResponsePathTargets] of Object.entries(incomingRefTargets)) {
    if (!newRefTargets[ref]) {
      newRefTargets[ref] = incomingResponsePathTargets;
      continue;
    }

    const newRefTarget = newRefTargets[ref];

    for (const [incomingResponseKey, incomingRequiredFields] of incomingResponsePathTargets) {
      const refTargetMatch = newRefTarget.find(([newResponseKey]) => newResponseKey === incomingResponseKey);

      if (!refTargetMatch) {
        newRefTarget.push([incomingResponseKey, incomingRequiredFields]);
        continue;
      }

      const [, requiredFieldsMatch] = refTargetMatch;

      for (const [incomingTypeName, incomingFieldNames] of Object.entries(incomingRequiredFields)) {
        if (!requiredFieldsMatch[incomingTypeName]) {
          requiredFieldsMatch[incomingTypeName] = incomingFieldNames;
          continue;
        }

        requiredFieldsMatch[incomingTypeName] = new Set([
          ...requiredFieldsMatch[incomingTypeName],
          ...incomingFieldNames,
        ]);
      }
    }
  }

  return newRefTargets;
};
