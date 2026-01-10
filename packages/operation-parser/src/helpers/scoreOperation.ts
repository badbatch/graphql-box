import { calcTypeComplexity } from '#helpers/calcTypeComplexity.ts';
import { getMaxFieldDepthFromChart } from '#helpers/getMaxFieldDepthFromChart.ts';

export type ScoreOperationOptions = {
  depthChart: Record<string, number>;
  typeComplexityMap?: Record<string, number>;
  typeOccurrences: Record<string, number>;
};

export type ScoreOperationResult = {
  fieldDepth: number;
  typeComplexity: number;
};

export const scoreOperation = ({
  depthChart,
  typeComplexityMap,
  typeOccurrences,
}: ScoreOperationOptions): ScoreOperationResult => {
  const fieldDepth = getMaxFieldDepthFromChart(depthChart);
  const typeComplexity = typeComplexityMap ? calcTypeComplexity(typeOccurrences, typeComplexityMap) : 0;

  return {
    fieldDepth,
    typeComplexity,
  };
};
