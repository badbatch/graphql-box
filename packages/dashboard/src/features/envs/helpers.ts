import { type Step } from '../../types.ts';

export const sortSteps = (payload: Record<string, Step>) => (idA: string, idB: string) => {
  const stepA = payload[idA]!;
  const stepB = payload[idB]!;

  if (stepA.logOrder < stepB.logOrder) {
    return -1;
  }

  if (stepA.logOrder > stepB.logOrder) {
    return 1;
  }

  return 0;
};
