import { type Ancestor } from '#types.ts';
import { getFieldsFromAncestors } from './getFieldsFromAncestors.ts';
import { getOperationPathFromAncestors } from './getOperationPathFromAncestors.ts';

export const makeDepthChart = (ancestorsList: Ancestor[][]): Record<string, number> => {
  return ancestorsList.reduce((acc: Record<string, number>, ancestors) => {
    const requestPath = getOperationPathFromAncestors(ancestors);
    const fields = getFieldsFromAncestors(ancestors);
    acc[requestPath] = fields.length;
    return acc;
  }, {});
};
