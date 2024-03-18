import { isNumber } from 'lodash-es';
import { type Ancestor } from '../types.ts';

export const enrichAncestors = (ancestors: readonly Ancestor[], key: string | number) => {
  const last = ancestors[ancestors.length - 1];

  if (!last || !('selections' in last)) {
    return ancestors;
  }

  if (!(isNumber(key) && last.selections[key])) {
    return [...ancestors, last.selections];
  }

  return [...ancestors, last.selections, last.selections[key]];
};
