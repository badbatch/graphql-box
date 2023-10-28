import { isObjectLike } from '@graphql-box/helpers';
import { mergeDataSets } from './mergeObjects.ts';

export const combineDataSets = (dataSetA: unknown, dataSetB: unknown, typeIDKey: string) => {
  if (!dataSetA && dataSetB) {
    return dataSetB;
  }

  if (isObjectLike(dataSetA) && isObjectLike(dataSetB)) {
    return mergeDataSets(dataSetA, dataSetB, typeIDKey);
  }

  return dataSetA;
};
