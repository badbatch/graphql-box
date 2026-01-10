export const getMaxFieldDepthFromChart = (depthChart: Record<string, number>) =>
  Object.values(depthChart).reduce<number>((acc, depthChartValue) => {
    return typeof depthChartValue === 'number' && depthChartValue > acc ? depthChartValue : acc;
  }, 0);
