import { isNumber, keys } from 'lodash-es';

export const getMaxDepthFromChart = (depthChart: Record<string, number>) =>
  keys(depthChart).reduce<number>((acc, key) => {
    const depthChartValue = depthChart[key];
    return isNumber(depthChartValue) && depthChartValue > acc ? depthChartValue : acc;
  }, 0);
