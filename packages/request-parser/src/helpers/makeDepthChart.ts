import { type Ancestor } from '../types.ts';
import { getFieldsFromAncestors } from './getFieldsFromAncestors.ts';
import { getRequestPathFromAncestors } from './getRequestPathFromAncestors.ts';

export const makeDepthChart = (ancestorsList: Ancestor[][]) => {
  return ancestorsList.reduce((acc: Record<string, number>, ancestors) => {
    const requestPath = getRequestPathFromAncestors(ancestors);
    const fields = getFieldsFromAncestors(ancestors);
    acc[requestPath] = fields.length;
    return acc;
  }, {});
};
